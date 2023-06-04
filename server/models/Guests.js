import mongoose from "mongoose";
import Inc from "mongoose-sequence";
const AutoIncrement = Inc(mongoose);

const guestSchema = new mongoose.Schema({
  customerId: {
    type: Number
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
  uniqueId: {
    type: String,
    required: false
  }
});

guestSchema.plugin(AutoIncrement, {id:'customer_iden_seq',inc_field: 'customerId'});

const Guests = mongoose.model("Guests", guestSchema);

export default Guests;
