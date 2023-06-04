import mongoose from 'mongoose';
import Inc from "mongoose-sequence";
const AutoIncrement = Inc(mongoose);

const inventorySchema = new mongoose.Schema({
  code: {
    type: Number
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  }, 
  uniqueId: {
    type: String,
    required: false,
    unique: true
  }
});

inventorySchema.plugin(AutoIncrement, {id:'code_seq',inc_field: 'code'});


const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;