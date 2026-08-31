import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  department: { type: String, default: 'Front Desk' },
  notes: { type: String, default: '' },
}, { timestamps: true });

shiftSchema.index({ date: 1 });

export default mongoose.model('Shift', shiftSchema);
