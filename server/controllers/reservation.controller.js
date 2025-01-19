import Reservation, { getNextSequenceValue } from "../models/Reservation.js";
import Room from "../models/Room.js";
import Guest from "../models/Guest.js";
import RoomDetail from "../models/RoomDetail.js";

export const getAllReservations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    const reservations = await Reservation.find()
      .populate('customerId')
      .populate('roomType')
      .populate('room')
      .skip(skip)
      .limit(limit);

    const totalReservations = await Reservation.countDocuments(); // Total number of reservations

    res.status(200).json({ reservations, total: totalReservations });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createReservation = async (req, res) => {
  try {
    // Retrieve guest by custom customer ID (e.g., "C0007")
    const guest = await Guest.findOne({ customerId: req.body.customerId });
    if (!guest) {
      return res.status(404).json({ message: "Guest not found with this customerId" });
    }

    // Retrieve room details using roomType ObjectId
    const room = await RoomDetail.findById(req.body.roomType);
    if (!room) {
      return res.status(404).json({ message: "Room not found with this roomType ID" });
    }

    // Fetch next sequence value for reservationId
    const nextReservationId = await getNextSequenceValue('reservation_id');

    // Define reservation data with roomType and guest details
    const reservationData = {
      reservationId: `R${nextReservationId.toString().padStart(4, '0')}`,
      customerId: guest._id,
      numAdults: Number(req.body.numAdults),
      numChildren: Number(req.body.numChildren),
      daysOfStay: Number(req.body.daysOfStay),
      roomType: room._id, 
      arrivalDate: req.body.arrivalDate,
      departureDate: req.body.departureDate,
      leadTime: Number(req.body.leadTime),
      bookingChannel: req.body.bookingChannel,
      totalPrice: room.price * Number(req.body.daysOfStay), 
    };

    // Create and save the reservation document
    const reservation = new Reservation(reservationData);
    await reservation.save();

    // Populate customerId and roomType for display purposes
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('customerId', 'customerId') // Fetch customerId field from Guest
      .populate('roomType', 'name price');  // Fetch name and price fields from Room

    // Return success message and the populated reservation with totalPrice
    res.status(201).json({
      message: 'Reservation created successfully',
      reservation: {
        ...populatedReservation.toObject(), // Convert document to plain object
      },
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(400).json({ message: error.message });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.cancelById(id, { cancelled: true }, { new: true });
    if (!reservation) {
      res.status(404).json({ message: "Reservation not found" });
      return;
    }
    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const checkInReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId } = req.body; 

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { checkedIn: true, room: roomId },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    await Room.findByIdAndUpdate(roomId, { roomStatus: "Occupied", currentReservation: id });

    res.status(200).json({ message: "Checked in successfully", reservation });
  } catch (error) {
    res.status(500).json({ error: "Error during check-in." });
  }
};

export const checkOutReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const room = await Room.findOne({ currentReservation: id });
    if (!room) {
      return res.status(404).json({ error: "Room associated with this reservation not found" });
    }

    reservation.checkedOut = true;
    await reservation.save();

    room.roomStatus = "Vacant"; 
    room.currentReservation = null; 
    await room.save();

    res.status(200).json({ message: "Reservation checked out successfully" });
  } catch (error) {
    console.error("Error during check-out:", error);
    res.status(500).json({ error: "Error during check-out." });
  }
};



