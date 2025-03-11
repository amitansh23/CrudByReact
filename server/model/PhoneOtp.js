import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // Expires in 5 minutes
});

export default mongoose.model("PhoneOtp", otpSchema);
