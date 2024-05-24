import mongoose, { mongo } from "mongoose";

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        required: true,
    },
    roomType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoomType',
        required: true,
      },
    roomStatus: {
        type: String,
        required: true,
    },
    housekeeping: {
        type: String,
        required: true,
    },
})

const Rooms = mongoose.model('Rooms', roomSchema);

export default Rooms;