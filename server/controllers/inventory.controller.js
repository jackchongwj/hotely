import Inventory from '../models/Inventory.js';
import { notifyAll } from '../services/notification.service.js';

const LOW_STOCK_THRESHOLD = 10;

export const getAllInventoryItems = async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(200, Math.max(1, parseInt(req.query.limit) || 20));
    const search = req.query.search?.trim();
    const type   = req.query.type?.trim();
    const skip   = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }
    if (type && type !== 'all') filter.type = type;

    const [inventory, total] = await Promise.all([
      Inventory.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
      Inventory.countDocuments(filter),
    ]);

    res.status(200).json({ inventory, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createInventoryItem = async (req, res) => {
  try {
    const inventory = new Inventory(req.body);
    await inventory.save();

    if (inventory.amount <= LOW_STOCK_THRESHOLD) {
      notifyAll('low_stock', 'Low Stock',
        `${inventory.name} is low (${inventory.amount} remaining)`,
        '/rooms/inventory').catch(() => {});
    }

    res.status(201).json({ message: 'Item created successfully', inventory });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const before = await Inventory.findById(id);
    const inventory = await Inventory.findByIdAndUpdate(id, req.body, { new: true });
    if (!inventory) throw new Error('Item not found');

    // Notify when quantity drops to/below threshold (and is lower than before)
    const newAmt = inventory.amount;
    const oldAmt = before?.amount ?? Infinity;
    if (newAmt <= LOW_STOCK_THRESHOLD && newAmt < oldAmt) {
      notifyAll('low_stock', 'Low Stock',
        `${inventory.name} is running low (${newAmt} remaining)`,
        '/rooms/inventory').catch(() => {});
    }

    res.status(200).json({ message: 'Item updated successfully', inventory });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findByIdAndDelete(id);
    if (!inventory) throw new Error('Item not found');
    res.status(200).json({ message: 'Item deleted successfully', inventory });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
