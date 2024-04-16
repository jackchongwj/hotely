import Guests from '../models/Guest.js';

export const getAllGuests = async (req, res) => {
    try {
      const guests = await Guests.find();
      res.status(200).json({ guests });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

export const createGuest = async (req, res) => {
  try {
    const guest = new Guests(req.body);
    await guest.save();
    res.status(201).json({ message: 'Guest created successfully', guest });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const guest = await Guests.findByIdAndUpdate(id, req.body, { new: true });
    if (!guest) throw new Error('Guest not found');
    res.status(200).json({ message: 'Guest updated successfully', guest });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const guest = await Guests.findByIdAndDelete(id);
    if (!guest) throw new Error('Guest not found');
    res.status(200).json({ message: 'Guest deleted successfully', guest });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};