import Reservations from "../models/Reservations.js";
import Rooms from "../models/Rooms.js";

// Get all rooms
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Rooms.find();
    res.status(200).json({ rooms });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new room
export const createRoom = async (req, res) => {
  try {
    const existingRoom = await Rooms.findOne({ number: req.body.roomNumber });
    if (existingRoom) {
      return res.status(409).json({ message: "Room number already exists" });
    }
    const room = new Rooms({ ...req.body, housekeeping: "Clean" });
    await room.save();
    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Rooms.findByIdAndUpdate(
      id,
      { housekeeping: req.body.housekeeping },
      { new: true }
    );
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }
    res.status(200).json({ message: "Room updated successfully", room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a room
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Rooms.findByIdAndDelete(id);
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }
    res.status(200).json({ message: "Room deleted successfully", room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all room numbers for registrations.
export const getAvailableRoomNumberForType = async (req, res) => {
  try {
    const { type } = req.params;
    const rooms = await Rooms.find({roomType: type});
    res.status(200).json({ rooms });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// checkIn 
export const checkIn = async (req, res) => {
  try {
    const { revId, roomId } = req.params;
    const reservation = await Reservations.findByIdAndUpdate(
      revId,
      { checkedIn: true , roomId: Number(roomId)}
    );
    console.log("resv, rom" , reservation, roomId);
    const room = await Rooms.findOneAndUpdate(
      roomId,
      { roomStatus : "Occupied" }
    );
    console.log("rom, rom" , room, roomId);
    res.status(200).json({ message : "checked In" });
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message });
  }
};

// checkOut
export const checkOutFromRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const reservation = await Reservations.findOneAndUpdate(
      {roomId: roomId},
      { checkedIn: false },
      { roomId: null}
    );
    const room = await Rooms.findByIdAndUpdate(
      roomId,
      { roomStatus : "Vacant" }
    );
    res.status(200).json({ reservations });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};