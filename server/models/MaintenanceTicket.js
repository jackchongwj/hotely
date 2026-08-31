import mongoose from 'mongoose';

const maintenanceTicketSchema = new mongoose.Schema({
  ticketNumber: { type: String, unique: true },
  roomId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  title:        { type: String, required: true, trim: true },
  description:  { type: String, default: '' },
  category:     {
    type: String,
    enum: ['plumbing', 'electrical', 'hvac', 'furniture', 'appliance', 'cleaning', 'other'],
    default: 'other',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open',
  },
  reportedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedTo:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  resolutionNotes: { type: String, default: '' },
  resolvedAt:      { type: Date, default: null },
}, { timestamps: true });

maintenanceTicketSchema.index({ status: 1, priority: 1 });
maintenanceTicketSchema.index({ roomId: 1 });

export default mongoose.model('MaintenanceTicket', maintenanceTicketSchema);
