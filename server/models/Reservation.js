import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  reservationId: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
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
  daysOfStay: {
    type: Number,
    required: true,
  },
  roomType: {
    type: String,
    required: true,
  },
  arrivalDate: {
    type: Date,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  leadTime: {
    type: Number,
    required: true,
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
  }
});

reservationSchema.statics.cancelById = async function (id, update, options) {
    const reservation = await this.findByIdAndUpdate(id, update, options);
    return reservation;
  };
  
const Reservations = mongoose.model('Reservations', reservationSchema);

export default Reservations;