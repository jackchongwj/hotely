import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  channel: { type: String, required: true }, // 'all' | 'dm_id1_id2'
  content: { type: String, required: true, trim: true },
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema);
