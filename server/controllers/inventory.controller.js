import Inventory from '../models/Inventory.js';

export const getAlInventoryItem = async (req, res) => {
    try {
      const inventory = await Inventory.find();
      res.status(200).json({ inventory });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

export const createInventoryItem = async (req, res) => {
  try {
    const inventory = new Inventory(req.body);
    await inventory.save();
    res.status(201).json({ message: 'Guest created successfully', guest });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findByIdAndUpdate(id, req.body, { new: true });
    if (!inventory) throw new Error('Item not found');
    res.status(200).json({ message: 'Item updated successfully', inventory });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findByIdAndDelete(id);
    if (!inventory) throw new Error('Item not found');
    res.status(200).json({ message: 'Item deleted successfully', inventory });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};