import Rooms from "../models/Room.js";

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
