import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    hotel: { type: String, required: true }, // "H1", "H2", "H3"
    date: { type: String, required: true }, // "YYYY-MM-DD"
    timeSlot: { type: String, required: true }, // "1-3 pm", "4-6 pm", "6-9 pm"
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" , required: true}, // User ID
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
