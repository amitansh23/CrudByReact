import Booking from '../model/Hbooking.js'



export const book = async(req, res) =>{
    try {
        const { hotel, date, timeSlot, userId } = req.body;
    
        // **Check if the slot is already booked**
        const existingBooking = await Booking.findOne({ hotel, date, timeSlot });
    
        if (existingBooking) {
          return res.status(400).json({ message: "This slot is already booked!" });
        }
    
        // **Book the slot**
        const newBooking = await Booking.create({ hotel, date, timeSlot, bookedBy: userId });
    
        res.status(201).json({ message: "Booking successful!", booking: newBooking });
    
      } catch (error) {
        console.error("Error booking slot:", error);
        res.status(500).json({ message: "Server error" });
      }
    };

export const available_slots = async (req, res) => {
    try {
        const { hotel, date } = req.query;
    
        const bookedSlots = await Booking.find({ hotel, date }).select("timeSlot");
    
        const allSlots = ["1-3 pm", "4-6 pm", "6-9 pm"];
        const availableSlots = allSlots.filter(slot => !bookedSlots.some(b => b.timeSlot === slot));
    
        res.json({ availableSlots });
    
      } catch (error) {
        console.error("Error fetching available slots:", error);
        res.status(500).json({ message: "Server error" });
      }}