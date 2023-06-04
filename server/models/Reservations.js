import mongoose from "mongoose";
import Inc from "mongoose-sequence";
const AutoIncrement = Inc(mongoose);

const reservationSchema = new mongoose.Schema({
  reservationId: {
    type: Number,
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
  checkedIn: {
    type: Boolean,
    // required: true,
    default: false
  },
  checkedOut: {
    type: Boolean,
    // required: true,
    default: false
  },

  bookingChannel: {
    type: String,
    required: true,
  },
  roomId: {
    type: Number,
    required: false,
  },
  uniqueId: {
    type: String,
    required: false,
    unique: true
  }
});

reservationSchema.plugin(AutoIncrement, {id:'reservation_id_seq',inc_field: 'reservationId'});

reservationSchema.statics.cancelById = async function (id, update, options) {
    const reservation = await this.findOneAndUpdate(id, update, options);
    return reservation;
  };
  
const Reservations = mongoose.model('Reservations', reservationSchema);

export default Reservations;