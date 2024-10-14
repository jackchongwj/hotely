import mongoose from "mongoose";
import Counter from "./Counter.js";

const guestSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  identification: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

// Static method to create a guest with the next customerId
guestSchema.statics.createWithNextId = async function (firstName, lastName, otherFields) {
  const customerId = await getNextSequenceValue('customer_id');
  return this.create({ customerId, firstName, lastName, ...otherFields });
};

// Function to get the next sequence value from the counters collection
async function getNextSequenceValue(sequenceName) {
  const counter = await Counter.findByIdAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

const Guest = mongoose.model('Guest', guestSchema);

export default Guest;