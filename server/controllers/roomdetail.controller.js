import RoomDetail from '../models/RoomDetail.js';

// Create a new room detail
export const createRoomDetail = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const newRoomDetail = new RoomDetail({ name, description, price });
    await newRoomDetail.save();
    res.status(201).json({ message: 'Room detail created successfully', roomDetail: newRoomDetail });
  } catch (error) {
    console.error('Error creating room detail:', error);
    res.status(400).json({ message: 'Failed to create room detail' });
  }
};

// Get all room details
export const getAllRoomDetails = async (req, res) => {
  try {
    const roomDetails = await RoomDetail.find();
    res.status(200).json({ roomDetails });
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ message: 'Failed to fetch room details' });
  }
};

// Update a room detail
export const updateRoomDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const updatedRoomDetail = await RoomDetail.findByIdAndUpdate(id, { name, description, price }, { new: true });
    if (!updatedRoomDetail) {
      return res.status(404).json({ message: 'Room detail not found' });
    }
    res.status(200).json({ message: 'Room detail updated successfully', roomDetail: updatedRoomDetail });
  } catch (error) {
    console.error('Error updating room detail:', error);
    res.status(400).json({ message: 'Failed to update room detail' });
  }
};

// Delete a room detail
export const deleteRoomDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoomDetail = await RoomDetail.findByIdAndDelete(id);
    if (!deletedRoomDetail) {
      return res.status(404).json({ message: 'Room detail not found' });
    }
    res.status(200).json({ message: 'Room detail deleted successfully' });
  } catch (error) {
    console.error('Error deleting room detail:', error);
    res.status(400).json({ message: 'Failed to delete room detail' });
  }
};
