import mongoose from "mongoose";
import Reservation, { getNextSequenceValue } from "../models/Reservation.js";
import Room from "../models/Room.js";
import Guest from "../models/Guest.js";
import RoomDetail from "../models/RoomDetail.js";
import Housekeeping from "../models/Housekeeping.js";
import { notifyAll } from "../services/notification.service.js";
import { logActivity } from "../services/activityLog.service.js";
import { sendBookingConfirmation, sendCheckInConfirmation, sendCheckOutSummary } from "../services/email.service.js";

// Returns availability for a room type over a date range.
// Pass excludeId to ignore an existing reservation (used when editing).
// Pass session to run inside a MongoDB transaction.
const checkAvailability = async (roomTypeId, arrival, departure, excludeId = null, session = null) => {
  const opts = session ? { session } : {};
  const totalRooms = await Room.countDocuments({ roomType: roomTypeId }, opts);
  if (totalRooms === 0) return { ok: false, total: 0, booked: 0 };
  const q = {
    roomType: roomTypeId,
    cancelled: false,
    arrivalDate: { $lt: new Date(departure) },
    departureDate: { $gt: new Date(arrival) },
  };
  if (excludeId) q._id = { $ne: excludeId };
  const booked = await Reservation.countDocuments(q, opts);
  return { ok: booked < totalRooms, total: totalRooms, booked };
};

export const getAllReservations = async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(200, Math.max(1, parseInt(req.query.limit) || 10));
    const skip   = (page - 1) * limit;
    const search = req.query.search?.trim();
    const status = req.query.status?.trim();

    // Build pre-match filter from query params
    const matchFilter = {};
    if (search) matchFilter.reservationId = { $regex: search, $options: 'i' };
    if (status === 'Cancelled')   matchFilter.cancelled  = true;
    else if (status === 'Checked Out') matchFilter.checkedOut = true;
    else if (status === 'Checked In')  { matchFilter.checkedIn = true; matchFilter.checkedOut = false; matchFilter.cancelled = false; }
    else if (status === 'Confirmed')   { matchFilter.checkedIn = false; matchFilter.checkedOut = false; matchFilter.cancelled = false; }

    const today    = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    const reservations = await Reservation.aggregate([
      { $match: matchFilter },
      {
        $addFields: {
          _sortPriority: {
            $switch: {
              branches: [
                {
                  case: { $or: [
                    { $and: [{ $gte: ['$arrivalDate', today] },   { $lt: ['$arrivalDate', tomorrow] }] },
                    { $and: [{ $gte: ['$departureDate', today] }, { $lt: ['$departureDate', tomorrow] }] },
                  ]},
                  then: 0,
                },
                { case: { $and: [{ $eq: ['$checkedIn', true]  }, { $eq: ['$checkedOut', false] }] }, then: 1 },
                { case: { $and: [{ $eq: ['$checkedIn', false] }, { $eq: ['$cancelled', false] }] }, then: 2 },
              ],
              default: 3,
            },
          },
        },
      },
      { $sort: { _sortPriority: 1, arrivalDate: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    await Reservation.populate(reservations, [
      { path: 'customerId' },
      { path: 'roomType' },
      { path: 'room' },
    ]);

    const total = await Reservation.countDocuments(matchFilter);
    res.status(200).json({ reservations, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const buildReservationData = (guest, roomType, body) => ({
  reservationId:  '', // set after sequence fetch
  customerId:     guest._id,
  numAdults:      Number(body.numAdults),
  numChildren:    Number(body.numChildren),
  daysOfStay:     Number(body.daysOfStay),
  roomType:       roomType._id,
  arrivalDate:    body.arrivalDate,
  departureDate:  body.departureDate,
  leadTime:       Number(body.leadTime),
  bookingChannel: body.bookingChannel,
  totalPrice:     roomType.price * Number(body.daysOfStay),
});

export const createReservation = async (req, res) => {
  try {
    const guest = await Guest.findOne({ customerId: req.body.customerId });
    if (!guest) return res.status(404).json({ message: "Guest not found with this customerId" });

    const roomType = await RoomDetail.findById(req.body.roomType);
    if (!roomType) return res.status(404).json({ message: "Room type not found" });

    let reservation;

    // Wrap availability check + insert in a transaction to prevent race conditions.
    // Falls back to non-transactional if MongoDB is standalone (dev environment).
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const { ok, total, booked } = await checkAvailability(
          roomType._id, req.body.arrivalDate, req.body.departureDate, null, session
        );
        if (!ok) {
          const err = new Error(`No ${roomType.name} rooms available for these dates (${booked}/${total} booked)`);
          err.status = 409;
          throw err;
        }
        const nextId = await getNextSequenceValue('reservation_id', session);
        const data = buildReservationData(guest, roomType, req.body);
        data.reservationId = `R${nextId.toString().padStart(4, '0')}`;
        [reservation] = await Reservation.create([data], { session });
      });
    } catch (txErr) {
      // MongoDB standalone (dev) doesn't support transactions — fall back
      if (txErr.code === 20 || txErr.message?.includes('Transaction numbers')) {
        const { ok, total, booked } = await checkAvailability(roomType._id, req.body.arrivalDate, req.body.departureDate);
        if (!ok) return res.status(409).json({ message: `No ${roomType.name} rooms available for these dates (${booked}/${total} booked)` });
        const nextId = await getNextSequenceValue('reservation_id');
        const data = buildReservationData(guest, roomType, req.body);
        data.reservationId = `R${nextId.toString().padStart(4, '0')}`;
        reservation = await Reservation.create(data);
      } else {
        if (txErr.status === 409) return res.status(409).json({ message: txErr.message });
        throw txErr;
      }
    } finally {
      session.endSession();
    }

    const populated = await Reservation.findById(reservation._id)
      .populate('customerId', 'customerId')
      .populate('roomType', 'name price');

    notifyAll('new_booking', 'New Booking',
      `Reservation ${reservation.reservationId} created for ${guest.firstName} ${guest.lastName}`,
      '/booking/reservations').catch(() => {});
    logActivity(req.user?._id, 'reservation_created', `Reservation ${reservation.reservationId} created for ${guest.firstName} ${guest.lastName}`, 'reservation', reservation._id.toString());
    sendBookingConfirmation(guest, reservation, roomType.name).catch(() => {});

    res.status(201).json({ message: 'Reservation created successfully', reservation: populated.toObject() });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(400).json({ message: error.message });
  }
};

export const editReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    if (reservation.checkedIn || reservation.checkedOut || reservation.cancelled) {
      return res.status(400).json({ message: 'Only confirmed reservations can be edited' });
    }

    const { guestId, roomType, arrivalDate, departureDate, numAdults, numChildren, bookingChannel } = req.body;

    const newRoomType  = roomType    || reservation.roomType.toString();
    const newArrival   = arrivalDate   || reservation.arrivalDate;
    const newDeparture = departureDate || reservation.departureDate;

    const { ok, total, booked } = await checkAvailability(newRoomType, newArrival, newDeparture, id);
    if (!ok) {
      const rt = await RoomDetail.findById(newRoomType);
      return res.status(409).json({
        message: `No ${rt?.name ?? ''} rooms available for these dates (${booked}/${total} booked)`,
      });
    }

    const updates = {};
    if (guestId)       updates.customerId = guestId;
    if (roomType)      updates.roomType   = roomType;
    if (arrivalDate)   updates.arrivalDate   = arrivalDate;
    if (departureDate) updates.departureDate = departureDate;
    if (arrivalDate || departureDate) {
      const a = new Date(arrivalDate   || reservation.arrivalDate);
      const d = new Date(departureDate || reservation.departureDate);
      updates.daysOfStay = Math.max(1, Math.ceil((d - a) / 86400000));
    }
    if (numAdults  != null) updates.numAdults  = numAdults;
    if (numChildren != null) updates.numChildren = numChildren;
    if (bookingChannel) updates.bookingChannel = bookingChannel;

    const updated = await Reservation.findByIdAndUpdate(id, updates, { new: true })
      .populate('customerId').populate('roomType').populate('room');

    res.json({ message: 'Reservation updated successfully', reservation: updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.cancelById(id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });
    const pop = await Reservation.findById(id).populate('customerId');
    const g = pop?.customerId;
    notifyAll('cancelled', 'Reservation Cancelled',
      `Reservation ${reservation.reservationId} for ${g ? `${g.firstName} ${g.lastName}` : 'Guest'} has been cancelled`,
      '/booking/reservations').catch(() => {});
    logActivity(req.user?._id, 'reservation_cancelled', `Reservation ${reservation.reservationId} cancelled`, 'reservation', id);
    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const extendReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { departureDate } = req.body;
    if (!departureDate) return res.status(400).json({ message: 'departureDate is required' });

    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    if (reservation.cancelled || reservation.checkedOut)
      return res.status(400).json({ message: 'Cannot extend a cancelled or checked-out reservation' });

    const arrival   = new Date(reservation.arrivalDate);
    const departure = new Date(departureDate);
    const daysOfStay = Math.ceil((departure - arrival) / 86400000);
    if (daysOfStay <= 0) return res.status(400).json({ message: 'Departure must be after arrival' });

    reservation.departureDate = departure;
    reservation.daysOfStay    = daysOfStay;
    await reservation.save();

    const pop = await Reservation.findById(id).populate('customerId');
    const g = pop?.customerId;
    notifyAll('extended', 'Stay Extended',
      `${g ? `${g.firstName} ${g.lastName}` : 'Guest'} (${reservation.reservationId}) extended to ${departure.toISOString().slice(0, 10)}`,
      '/booking/reservations').catch(() => {});

    res.status(200).json({ message: 'Reservation extended successfully', reservation });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const checkInReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId } = req.body;

    const reservation = await Reservation.findByIdAndUpdate(id, { checkedIn: true, room: roomId }, { new: true });
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });

    await Room.findByIdAndUpdate(roomId, { roomStatus: "Occupied", currentReservation: id });

    const pop = await Reservation.findById(id).populate('customerId').populate('room');
    const g   = pop?.customerId;
    notifyAll('check_in', 'Guest Checked In',
      `${g ? `${g.firstName} ${g.lastName}` : 'Guest'} (${reservation.reservationId}) checked into Room #${pop?.room?.roomNumber ?? '?'}`,
      '/guests/check-in-out').catch(() => {});
    logActivity(req.user?._id, 'check_in', `${g ? `${g.firstName} ${g.lastName}` : 'Guest'} checked into Room #${pop?.room?.roomNumber ?? '?'} (${reservation.reservationId})`, 'reservation', id);
    sendCheckInConfirmation(g, reservation, pop?.room?.roomNumber).catch(() => {});

    res.status(200).json({ message: "Checked in successfully", reservation });
  } catch (error) {
    res.status(500).json({ error: "Error during check-in." });
  }
};

export const scanReservation = async (req, res) => {
  try {
    const { code } = req.params;
    const reservation = await Reservation.findOne({ reservationId: code.trim().toUpperCase() })
      .populate('customerId')
      .populate('roomType')
      .populate('room');

    if (!reservation) return res.status(404).json({ message: `No reservation found for: ${code}` });

    // Return vacant rooms matching the room type for immediate check-in
    const vacantRooms = (!reservation.checkedIn && !reservation.cancelled)
      ? await Room.find({ roomType: reservation.roomType, roomStatus: 'Vacant', isDeleted: { $ne: true } }).lean()
      : [];

    res.json({ reservation, vacantRooms });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const markNoShow = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    if (reservation.checkedIn || reservation.checkedOut || reservation.cancelled) {
      return res.status(400).json({ message: 'Only confirmed reservations can be marked as no-show' });
    }
    reservation.noShow = true;
    reservation.cancelled = true;
    await reservation.save();
    logActivity(req.user?._id, 'reservation_cancelled', `Reservation ${reservation.reservationId} marked as no-show`, 'reservation', id);
    res.json({ message: 'Reservation marked as no-show', reservation });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const setReservationFlags = async (req, res) => {
  try {
    const { id } = req.params;
    const { earlyCheckIn, lateCheckOut } = req.body;
    const updates = {};
    if (earlyCheckIn !== undefined) updates.earlyCheckIn = earlyCheckIn;
    if (lateCheckOut !== undefined) updates.lateCheckOut = lateCheckOut;
    const updated = await Reservation.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Reservation not found' });
    res.json({ message: 'Flags updated', reservation: updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const checkOutReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });

    const room = await Room.findOne({ currentReservation: id });
    if (!room) return res.status(404).json({ error: "Room associated with this reservation not found" });

    reservation.checkedOut = true;
    await reservation.save();
    room.roomStatus = "Vacant";
    room.currentReservation = null;
    await room.save();

    // Auto-create a post-checkout cleaning task
    Housekeeping.create({
      type:        'Cleaning',
      description: `Post-checkout cleaning — Room ${room.roomNumber} (${reservation.reservationId})`,
      priority:    'High',
      status:      'Pending',
      category:    'Housekeeping',
      roomId:      room._id,
    }).catch(() => {});

    const pop = await Reservation.findById(id).populate('customerId');
    const g   = pop?.customerId;
    notifyAll('check_out', 'Guest Checked Out',
      `${g ? `${g.firstName} ${g.lastName}` : 'Guest'} (${reservation.reservationId}) has checked out`,
      '/guests/check-in-out').catch(() => {});
    logActivity(req.user?._id, 'check_out', `${g ? `${g.firstName} ${g.lastName}` : 'Guest'} (${reservation.reservationId}) checked out`, 'reservation', id);
    sendCheckOutSummary(g, reservation).catch(() => {});

    res.status(200).json({ message: "Reservation checked out successfully" });
  } catch (error) {
    console.error("Error during check-out:", error);
    res.status(500).json({ error: "Error during check-out." });
  }
};
