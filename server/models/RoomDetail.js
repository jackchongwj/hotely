import mongoose from 'mongoose';

const roomDetailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: { 
    type: Number,
    },
});

const RoomDetail = mongoose.model('RoomDetail', roomDetailSchema);

export default RoomDetail;