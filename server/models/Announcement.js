import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  pinned: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);
