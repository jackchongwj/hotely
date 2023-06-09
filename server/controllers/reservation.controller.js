import Reservations from "../models/Reservations.js";
import Rooms from "../models/Rooms.js";

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
    // const reservation = await Reservations.cancelById({reservationId: id}, { cancelled: true }, { new: true });
    const reservation = await Reservations.deleteOne({reservationId: id})
    if (!reservation) {
      res.status(404).json({ message: "Reservation not found" });
      return;
    }
    res.status(200).json({ message: "Reservation cancelled successfully", reservation });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a reservation
export const getAllAvailableReservations = async (req, res) => {
  try {
    const reservations = await Reservations.where("roomId").ne(null);
    res.status(200).json({ message: "checkd In", reservations });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const checkOutFromReservations = async (req, res) => {
  try {
    const { revId } = req.params;
    const preUpdateReservations = await Reservations.findById(revId);
    console.log(preUpdateReservations)
    if (preUpdateReservations.roomId == null || preUpdateReservations.roomId == undefined ){
      res.status(200).json({ message: "Not checked In" });
    }
    const roomid = preUpdateReservations.roomId;
    const reservations = await Reservations.findByIdAndUpdate(revId, {checkedIn: false, roomId: null});
    const room = await Rooms.findByIdAndUpdate(roomid,  { roomStatus : "Vacant" })
    res.status(200).json({ message: "checked out", reservations });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
