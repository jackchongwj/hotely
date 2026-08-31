import mongoose from 'mongoose';

const hotelSettingsSchema = new mongoose.Schema({
  name: { type: String, default: 'Hotel Admin' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  website: { type: String, default: '' },
  checkInTime: { type: String, default: '14:00' },
  checkOutTime: { type: String, default: '11:00' },
  taxRate: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  currencySymbol: { type: String, default: '$' },
  bankName:          { type: String, default: 'Maybank' },
  bankAccountName:   { type: String, default: 'Jack Chong Wei Jie' },
  bankAccountNumber: { type: String, default: '112754096256' },
});

export default mongoose.model('HotelSettings', hotelSettingsSchema);
