import Rooms from "../models/Rooms.js";

// Create a new room
export const createRoom = async (req, res) => {
  try {
    const room = new Rooms(req.body);
    await room.save();
    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all rooms
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Rooms.find();
    res.status(200).json({ rooms });
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
