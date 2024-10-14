import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
  reference_value: { type: String, required: true, unique: true } 
});

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;