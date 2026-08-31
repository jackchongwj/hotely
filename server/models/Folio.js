import mongoose from 'mongoose';

const folioSchema = new mongoose.Schema({
  reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
  description:   { type: String, required: true },
  amount:        { type: Number, required: true, min: 0 },
  category: {
    type: String,
    enum: ['Room Service', 'Minibar', 'Laundry', 'Parking', 'Phone', 'Spa', 'Other'],
    default: 'Other',
  },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

folioSchema.index({ reservationId: 1 });

export default mongoose.model('Folio', folioSchema);
