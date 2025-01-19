import mongoose from "mongoose";

const housekeepingSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true, 
    },
    description: {
        type: String,
        required: true, 
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        required: true, 
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true, 
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
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
});

const Housekeeping = mongoose.model('Housekeeping', housekeepingSchema);

export default Housekeeping;
