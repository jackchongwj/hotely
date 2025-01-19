import mongoose from "mongoose";
import Counter from "./Counter.js";

const reservationSchema = new mongoose.Schema({
  reservationId: {
    type: String,
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guest", 
    required: true,
  },
  numAdults: {
    type: Number,
    required: true,
  },
  numChildren: {
    type: Number,
    required: false,
  },
  arrivalDate: {
    type: Date,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  daysOfStay: {
    type: Number,
    required: true,
  },
  roomType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomDetail",
  },
  bookingChannel: {
    type: String,
    required: true,
  },
  checkedIn: {
    type: Boolean,
    default: false,
  },
  checkedOut: {
    type: Boolean,
    default: false,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: false,
  },
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date, default: Date.now },
});

// Function to get the next sequence value from the counters collection
export async function getNextSequenceValue(sequenceName) {
  const counter = await Counter.findByIdAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// Static method to get the next sequence value and create reservation
reservationSchema.statics.createWithNextId = async function (customerId, otherFields) {
  const reservationId = await getNextSequenceValue('reservation_id');
  return this.create({ reservationId, customerId, ...otherFields });
};


// Static method to set cancelled to true
reservationSchema.statics.cancelById = async function (id) {
  const reservation = await this.findByIdAndUpdate(id, { cancelled: true }, { new: true });
  return reservation;
};

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
