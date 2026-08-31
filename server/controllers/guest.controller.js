import Guest from '../models/Guest.js';
import Counter from '../models/Counter.js';
import Reservation from '../models/Reservation.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function getNextSequenceValue(sequenceName) {
  const counter = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

export const getAllGuests = async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(500, Math.max(1, parseInt(req.query.limit) || 20));
    const search = req.query.search?.trim();
    const skip   = (page - 1) * limit;

    const filter = { isDeleted: { $ne: true } };
    if (search) {
      filter.$or = [
        { firstName:  { $regex: search, $options: 'i' } },
        { lastName:   { $regex: search, $options: 'i' } },
        { email:      { $regex: search, $options: 'i' } },
        { customerId: { $regex: search, $options: 'i' } },
      ];
    }

    const [guests, total] = await Promise.all([
      Guest.find(filter).sort({ lastName: 1, firstName: 1 }).skip(skip).limit(limit).lean(),
      Guest.countDocuments(filter),
    ]);

    res.status(200).json({ guests, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const checkDuplicates = async (req, res) => {
  try {
    const { firstName, lastName, identification } = req.query;
    const q = [];
    if (firstName && lastName) {
      q.push({
        firstName: { $regex: new RegExp(`^${firstName.trim()}$`, 'i') },
        lastName:  { $regex: new RegExp(`^${lastName.trim()}$`,  'i') },
      });
    }
    if (identification && identification.trim()) {
      q.push({ identification: identification.trim() });
    }
    if (!q.length) return res.json({ duplicates: [] });
    const duplicates = await Guest.find({ $or: q, isDeleted: { $ne: true } }).limit(5);
    res.json({ duplicates });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createGuest = async (req, res) => {
  try {
    const nextCustomerId = await getNextSequenceValue('customer_id');
    const guest = new Guest({
      customerId: `C${nextCustomerId.toString().padStart(4, '0')}`,
      ...req.body,
    });
    await guest.save();
    res.status(201).json({ message: 'Guest created successfully', guest });
  } catch (error) {
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
    const guest = await Guest.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!guest) throw new Error('Guest not found');
    res.status(200).json({ message: 'Guest deleted successfully', guest });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGuestReservations = async (req, res) => {
  try {
    const { id } = req.params;
    const reservations = await Reservation.find({ customerId: id })
      .populate('roomType')
      .populate('room')
      .sort({ arrivalDate: -1 });
    res.status(200).json({ reservations });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const guest = await Guest.findByIdAndUpdate(
      id,
      { $push: { documents: { filename: req.file.filename, originalName: req.file.originalname } } },
      { new: true }
    );
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.json({ message: 'Document uploaded', guest });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id, docId } = req.params;
    const guest = await Guest.findById(id);
    if (!guest) return res.status(404).json({ message: 'Guest not found' });

    const doc = guest.documents.id(docId);
    if (doc?.filename) {
      const filePath = path.join(__dirname, '../uploads', doc.filename);
      fs.unlink(filePath, () => {});
    }

    await Guest.findByIdAndUpdate(id, { $pull: { documents: { _id: docId } } });
    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
