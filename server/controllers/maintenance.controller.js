import MaintenanceTicket from '../models/MaintenanceTicket.js';
import Room from '../models/Room.js';
import { errorHandler } from '../helpers/error.handler.js';

let _ticketSeq = 0;

const nextTicketNumber = async () => {
  if (_ticketSeq === 0) {
    const last = await MaintenanceTicket.findOne().sort({ ticketNumber: -1 }).lean();
    if (last?.ticketNumber) {
      _ticketSeq = parseInt(last.ticketNumber.replace('MT-', ''), 10) || 0;
    }
  }
  _ticketSeq += 1;
  return `MT-${String(_ticketSeq).padStart(4, '0')}`;
};

export const getAllTickets = async (req, res) => {
  try {
    const { status, priority, category, roomId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status)   filter.status   = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (roomId)   filter.roomId   = roomId;

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await MaintenanceTicket.countDocuments(filter);
    const tickets = await MaintenanceTicket.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('roomId', 'roomNumber roomStatus')
      .populate('reportedBy', 'fname lname')
      .populate('assignedTo', 'fname lname')
      .lean();

    res.json({ tickets, total, pages: Math.ceil(total / parseInt(limit)), page: parseInt(page) });
  } catch (err) {
    errorHandler(res, err, req);
  }
};

export const createTicket = async (req, res) => {
  try {
    const { roomId, title, description, category, priority, assignedTo } = req.body;
    const ticketNumber = await nextTicketNumber();
    const ticket = await MaintenanceTicket.create({
      ticketNumber,
      roomId:      roomId || null,
      title,
      description: description || '',
      category:    category || 'other',
      priority:    priority || 'medium',
      assignedTo:  assignedTo || null,
      reportedBy:  req.user?._id || null,
      status: 'open',
    });

    // If a room is linked, auto-set it to Maintenance if it was Vacant
    if (roomId && priority === 'urgent') {
      await Room.findByIdAndUpdate(roomId, { roomStatus: 'Maintenance' });
    }

    const populated = await ticket.populate([
      { path: 'roomId',     select: 'roomNumber roomStatus' },
      { path: 'reportedBy', select: 'fname lname' },
      { path: 'assignedTo', select: 'fname lname' },
    ]);
    res.status(201).json({ ticket: populated });
  } catch (err) {
    errorHandler(res, err, req);
  }
};

export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.status === 'resolved' || updates.status === 'closed') {
      updates.resolvedAt = new Date();
    }

    const ticket = await MaintenanceTicket.findByIdAndUpdate(id, updates, { new: true })
      .populate('roomId',     'roomNumber roomStatus')
      .populate('reportedBy', 'fname lname')
      .populate('assignedTo', 'fname lname');

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json({ ticket });
  } catch (err) {
    errorHandler(res, err, req);
  }
};

export const deleteTicket = async (req, res) => {
  try {
    await MaintenanceTicket.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    errorHandler(res, err, req);
  }
};

export const getTicketStats = async (req, res) => {
  try {
    const [open, in_progress, resolved, urgent] = await Promise.all([
      MaintenanceTicket.countDocuments({ status: 'open' }),
      MaintenanceTicket.countDocuments({ status: 'in_progress' }),
      MaintenanceTicket.countDocuments({ status: 'resolved' }),
      MaintenanceTicket.countDocuments({ status: { $in: ['open', 'in_progress'] }, priority: 'urgent' }),
    ]);
    res.json({ open, in_progress, resolved, urgent });
  } catch (err) {
    errorHandler(res, err, req);
  }
};
