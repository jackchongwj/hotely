import Reservations from "../models/Reservation.js";
import connectDB from "../config/db.js";

// Get the next sequence value from the 'counter' collection
const getNextSequenceValue = async (sequenceName) => {
  try {
      const db = await connectDB();
      const sequenceDocument = await db.collection('counters').findOneAndUpdate(
          { id: sequenceName },
          { $inc: { seq: 1 } },
          { new: true, upsert: true, returnOriginal: false }
      );
      return sequenceDocument.value.seq;
  } catch (error) {
      console.error("Failed to get or increment sequence value:", error);
      throw error;  // Re-throw or handle error as appropriate
  }
};

export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservations.find().populate('roomType');
    res.status(200).json({ reservations });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createReservation = async (req, res) => {
  try {
    // Get the next reservationId from the sequence collection
    const nextReservationId = await getNextSequenceValue('reservation_id_seq');
    // Create a new reservation with the next reservationId
    const reservation = new Reservations({
      reservationId: nextReservationId,
      ...req.body
    });

    // Save the reservation to the database
    await reservation.save();

    // Return success message and the created reservation
    res.status(201).json({ message: "Reservation created successfully", reservation });
  } catch (error) {
    // Return error message if there's an issue creating the reservation
    res.status(400).json({ message: error.message });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservations.cancelById(id, { cancelled: true }, { new: true });
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
    const reservation = await Reservations.findById(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

    reservation.checkedIn = true;
    await reservation.save();
    res.status(200).json({ message: 'Reservation checked in successfully' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const checkOutReservation = async (req, res) => {
  try {
    const reservation = await Reservations.findById(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

    reservation.checkedOut = true;
    await reservation.save();
    res.status(200).json({ message: 'Reservation checked out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

