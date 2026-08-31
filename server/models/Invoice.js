import mongoose from 'mongoose';
import Counter from './Counter.js';

const paymentSchema = new mongoose.Schema({
  method:     { type: String, enum: ['cash', 'card', 'ewallet', 'bank_transfer', 'other'], required: true },
  amount:     { type: Number, required: true, min: 0 },
  reference:  { type: String, default: '' },
  paidAt:     { type: Date, default: Date.now },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { _id: true });

const lineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity:    { type: Number, required: true },
  unitPrice:   { type: Number, required: true },
  total:       { type: Number, required: true },
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true, unique: true },
  guestId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Guest' },
  lineItems:     [lineItemSchema],
  subtotal:      { type: Number, required: true },
  taxRate:       { type: Number, default: 0 },
  taxAmount:     { type: Number, default: 0 },
  total:         { type: Number, required: true },
  status:        { type: String, enum: ['draft', 'sent', 'partial', 'paid', 'void'], default: 'draft' },
  payments:      [paymentSchema],
  amountPaid:    { type: Number, default: 0 },
  balance:       { type: Number, required: true },
  dueDate:       { type: Date },
  notes:         { type: String, default: '' },
  sentAt:        { type: Date },
}, { timestamps: true });

invoiceSchema.index({ reservationId: 1 });
invoiceSchema.index({ status: 1 });

async function getNextInvoiceNumber() {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'invoice_id' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `INV-${counter.seq.toString().padStart(4, '0')}`;
}

export { getNextInvoiceNumber };
export default mongoose.model('Invoice', invoiceSchema);
