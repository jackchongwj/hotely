import Shift from '../models/Shift.js';

export const getShifts = async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = {};
    if (start && end) {
      filter.date = { $gte: new Date(start), $lte: new Date(end) };
    }
    const shifts = await Shift.find(filter)
      .populate('userId', 'fname lname role')
      .sort({ date: 1, startTime: 1 })
      .lean();
    res.json({ shifts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createShift = async (req, res) => {
  try {
    const { userId, date, startTime, endTime, department, notes } = req.body;
    const shift = await Shift.create({ userId, date: new Date(date), startTime, endTime, department, notes });
    const populated = await Shift.findById(shift._id).populate('userId', 'fname lname role').lean();
    res.status(201).json({ message: 'Shift created', shift: populated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateShift = async (req, res) => {
  try {
    const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('userId', 'fname lname role');
    if (!shift) return res.status(404).json({ message: 'Shift not found' });
    res.json({ message: 'Shift updated', shift });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteShift = async (req, res) => {
  try {
    await Shift.findByIdAndDelete(req.params.id);
    res.json({ message: 'Shift deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
