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
    required: true,
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
    type: String,
    required: true,
  },
  departureDate: {
    type: String,
    required: true,
  },
  leadTime: {
    type: Number,
    required: true,
  },
  checkedIn: {
    type: Boolean,
    required: true,
  },
  checkedOut: {
    type: Boolean,
    required: true,
  },

  bookingChannel: {
    type: String,
    required: true,
  },
});

reservationSchema.statics.cancelById = async function (id, update, options) {
    const reservation = await this.findByIdAndUpdate(id, update, options);
    return reservation;
  };
  
const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;