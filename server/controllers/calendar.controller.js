import Room from '../models/Room.js';
import Reservation from '../models/Reservation.js';

export const getCalendar = async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).json({ message: 'start and end query params required' });

    const rangeStart = new Date(start); rangeStart.setHours(0, 0, 0, 0);
    const rangeEnd   = new Date(end);   rangeEnd.setHours(23, 59, 59, 999);

    const [rooms, reservations] = await Promise.all([
      Room.find().populate('roomType', 'name').sort({ roomNumber: 1 }).lean(),
      Reservation.find({
        cancelled: false,
        arrivalDate:   { $lt: rangeEnd },
        departureDate: { $gt: rangeStart },
      })
        .populate('customerId', 'firstName lastName')
        .populate('roomType', 'name')
        .lean(),
    ]);

    // Separate assigned (checked-in, has specific room) from unassigned
    const assignedMap = {};
    const unassigned  = [];

    for (const r of reservations) {
      if (r.room) {
        const key = r.room.toString();
        if (!assignedMap[key]) assignedMap[key] = [];
        assignedMap[key].push(r);
      } else {
        unassigned.push(r);
      }
    }

    const roomsData = rooms.map(room => ({
      _id:          room._id,
      roomNumber:   room.roomNumber,
      roomType:     room.roomType,
      roomStatus:   room.roomStatus,
      reservations: assignedMap[room._id.toString()] ?? [],
    }));

    res.json({ rooms: roomsData, unassigned });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
