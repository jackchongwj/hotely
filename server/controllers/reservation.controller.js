import Reservation from "../models/Reservation.js";
import Room from "../models/Room.js";

export const getAllReservations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    const reservations = await Reservation.find()
      .populate('customerId')
      .populate('roomType')
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
    // Get the next reservationId from the sequence collection
    const nextReservationId = await getNextSequenceValue('reservation_id');

    // Create a new reservation with the next reservationId
    const reservation = new Reservation({
      reservationId: `R${nextReservationId.toString().padStart(4, '0')}`, // Format as R0001, R0002, ...
      ...req.body,
    });

    // Save the reservation to the database
    await reservation.save();

    // Return success message and the created reservation
    res.status(201).json({ message: 'Reservation created successfully', reservation });
  } catch (error) {
    // Return error message if there's an issue creating the reservation
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
    const { roomId } = req.body; // Expect roomId to be provided in the request body

    // Update reservation to check-in and assign room
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { checkedIn: true, room: roomId },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Update room status to Occupied
    await Room.findByIdAndUpdate(roomId, { roomStatus: "Occupied" });

    res.status(200).json({ message: "Checked in successfully", reservation });
  } catch (error) {
    res.status(500).json({ error: "Error during check-in." });
  }
};

export const checkOutReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

    reservation.checkedOut = true;
    await reservation.save();
    res.status(200).json({ message: 'Reservation checked out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

