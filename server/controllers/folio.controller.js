import Folio from '../models/Folio.js';
import Reservation from '../models/Reservation.js';

export const getFolioCharges = async (req, res) => {
  try {
    const { reservationId } = req.query;
    if (!reservationId) return res.status(400).json({ message: 'reservationId is required' });
    const charges = await Folio.find({ reservationId }).populate('addedBy', 'fname lname').sort({ createdAt: 1 }).lean();
    const total = charges.reduce((s, c) => s + c.amount, 0);
    res.json({ charges, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFolioCharge = async (req, res) => {
  try {
    const { reservationId, description, amount, category } = req.body;
    if (!reservationId || !description || amount == null) {
      return res.status(400).json({ message: 'reservationId, description, and amount are required' });
    }
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    if (reservation.checkedOut || reservation.cancelled) {
      return res.status(400).json({ message: 'Cannot add charges to a checked-out or cancelled reservation' });
    }
    const charge = await Folio.create({
      reservationId, description, amount: Number(amount), category: category ?? 'Other',
      addedBy: req.user?._id,
    });
    res.status(201).json({ charge });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFolioCharge = async (req, res) => {
  try {
    const charge = await Folio.findByIdAndDelete(req.params.id);
    if (!charge) return res.status(404).json({ message: 'Charge not found' });
    res.json({ message: 'Charge removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
