import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verifyOtp: {
        type: String,
        default: ''
    },
    verifyOtpExpired: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default: ''
    },
    resetOtpExpired: {
        type: Number,
        default: 0
    }
})

const userModel = mongoose.model.user || mongoose.model('user', userSchema);
export default userModel;