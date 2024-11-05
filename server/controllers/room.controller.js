import Room from "../models/Room.js";

// Fetch available rooms by room type
export const getAvailableRooms = async (req, res) => {
  try {
    const { roomType } = req.query;

    const availableRooms = await Room.find({
      roomType,
      roomStatus: "Vacant", // Ensures only unoccupied rooms are retrieved
    });

    res.status(200).json(availableRooms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/room-rack
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('roomType')
      .populate('housekeeping');
    res.status(200).json({ rooms });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST /api/room-rack
export const createRoom = async (req, res) => {
  try {
    const existingRoom = await Room.findOne({ roomNumber: req.body.roomNumber });
    if (existingRoom) {
      return res.status(409).json({ message: "Room number already exists" });
    }
    const room = new Room(req.body);
    await room.save();
    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/room-rack/:id
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndUpdate(
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

// DELETE /api/room-rack/:id
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }
    res.status(200).json({ message: "Room deleted successfully", room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
