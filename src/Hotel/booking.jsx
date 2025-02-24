import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

const BookingSystem = () => {
  const [hotel, setHotel] = useState("H1"); // Default hotel
  const [date, setDate] = useState(dayjs().add(1, "day"));
  const [timeSlot, setTimeSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);

  const storedUser = localStorage.getItem("userData");
  const user = JSON.parse(storedUser);



  // **Fetch available slots when date changes**
  useEffect(() => {
    if (date) {
      axios
        .get(`http://localhost:8000/api/available_slots?hotel=${hotel}&date=${date.format("YYYY-MM-DD")}`)
        .then((res) => setAvailableSlots(res?.data?.availableSlots))
        .catch((err) => console.error(err));
    }
  }, [date, hotel]);

  const handleBooking = async () => {
    if (!timeSlot) {
      alert("Please select a time slot");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/book", {
        hotel,
        date: date.format("YYYY-MM-DD"),
        timeSlot,
        userId: user._id, // Fetch from localStorage or context
      });

      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Error booking slot");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "350px", padding: "20px", border: "2px solid green", borderRadius: "10px", margin: "auto", textAlign: "center" }}>
        <h2>Book a Hotel Slot</h2>

        {/* Hotel Selection */}
        <select value={hotel} onChange={(e) => setHotel(e.target.value)} style={inputStyle}>
          <option value="H1">Hotel H1</option>
          <option value="H2">Hotel H2</option>
          <option value="H3">Hotel H3</option>
        </select>

        {/* Date Picker (Only next 10 days allowed) */}
        <DesktopDatePicker
          label="Select Date"
          value={date}
          onChange={(newValue) => setDate(newValue)}
          disablePast
          minDate={dayjs()}
          maxDate={dayjs().add(10, "day")}
          renderInput={(params) => <input {...params} style={inputStyle} />}
        />

        {/* Time Slot Selection */}
        <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} style={inputStyle} disabled={availableSlots.length === 0}>
          <option value="">Select Time Slot</option>
          {availableSlots.length === 0 ? (
            <option disabled>No slots available</option>
          ) : (
            availableSlots.map((slot, index) => <option key={index} value={slot}>{slot}</option>)
          )}
        </select>

        <button onClick={handleBooking} style={buttonStyle}>Book Now</button>
      </div>
    </LocalizationProvider>
  );
};

// Styles
const inputStyle = { padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "100%" };
const buttonStyle = { padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" };

export default BookingSystem;
