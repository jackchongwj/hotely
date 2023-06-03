import Reservations from "../models/Reservations.js";

// Get all reservations
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservations.find();
    res.status(200).json({ reservations });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new reservation
export const createReservation = async (req, res) => {
  try {
    const reservation = new Reservations(req.body);
    await reservation.save();
    res.status(201).json({ message: "Reservation created successfully", reservation });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a reservation
export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservations.cancelById(id, { cancelled: true }, { new: true });
    if (!reservation) {
      res.status(404).json({ message: "Reservation not found" });
      return;
    }
    res.status(200).json({ message: "Reservation cancelled successfully", reservation });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

