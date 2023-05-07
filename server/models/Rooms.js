import mongoose, { mongo } from "mongoose";

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        required: true,
    },
    roomType: {
        type: String, 
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