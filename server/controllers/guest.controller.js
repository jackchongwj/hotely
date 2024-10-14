import Guest from '../models/Guest.js';

export const getAllGuests = async (req, res) => {
    try {
      const guests = await Guest.find();
      res.status(200).json({ guests });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

export const createGuest = async (req, res) => {
  try {
    // Get the next customerId from the sequence collection
    const nextCustomerId = await getNextSequenceValue('customer_id');

    // Create a new guest with the next customerId
    const guest = new Guest({
      customerId: `C${nextCustomerId.toString().padStart(4, '0')}`, // Format as C0001, C0002, ...
      ...req.body,
    });

    // Save the guest to the database
    await guest.save();

    // Return success message and the created guest
    res.status(201).json({ message: 'Guest created successfully', guest });
  } catch (error) {
    // Return error message if there's an issue creating the guest
    res.status(400).json({ message: error.message });
  }
};

export const updateGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const guest = await Guest.findByIdAndUpdate(id, req.body, { new: true });
    if (!guest) throw new Error('Guest not found');
    res.status(200).json({ message: 'Guest updated successfully', guest });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const guest = await Guest.findByIdAndDelete(id);
    if (!guest) throw new Error('Guest not found');
    res.status(200).json({ message: 'Guest deleted successfully', guest });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};