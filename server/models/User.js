import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: [true, 'Please add first name']
    },
    lname: {
        type: String,
        required: [true, 'Please add last name']
    },
    email: {
        type: String,
        required: [true, 'Please add email'],
        unique: true
    },
    password: {
        type: String,
        minimum: 5,
        required: [true, 'Please add password']
    },
    role: {
        type: String,
        required: [true, 'Please add user role']
    }
},
{
    timestamps: true
}
)

const User = mongoose.model("User", userSchema);
export default User;
