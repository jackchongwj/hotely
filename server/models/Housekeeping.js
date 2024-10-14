import mongoose from "mongoose";

const housekeepingSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true, 
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: "Pending",
    },
    priority: {
        type: String,
        default: "Medium",
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
    },
    completedDate: {
        type: Date,
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rooms',
        required: true,
    },
});

const Housekeeping = mongoose.model('Housekeeping', housekeepingSchema);

export default Housekeeping;
