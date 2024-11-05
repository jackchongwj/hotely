import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        required: true,
    },
    roomType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoomDetail',
        required: true,
    },
    roomStatus: {
        type: String,
        required: true,
        enum: ['Vacant', 'Occupied', 'Maintenance', 'Out Of Order'],
    },
    housekeeping: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Housekeeping',
        required: false,
    },
    currentReservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation",
        required: false,
      },
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
