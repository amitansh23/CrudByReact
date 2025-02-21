import React, { useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";

export default function Calendar() {
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs().add(1, "hour"));

 
  
  
  
  // Function to handle start date change
  const handleStartDateChange = (newValue) => {
    if (newValue) {
      setStartDate(newValue);
      // Automatically set End Date to be at least 1 hour later
      setEndDate(newValue.add(1, "hour"));
    }
  };

  // Function to handle end date change
  const handleEndDateChange = (newValue) => {
    if (newValue && newValue.isAfter(startDate.add(1, "hour"))) {
      setEndDate(newValue);
    }
  };

  const handleSubmit = async () => {
    if (!eventName || !startDate || !endDate || !location) {
      alert("Please fill all required fields.");
      return;
    }

    const storedUser = localStorage.getItem("userData");
  const user = JSON.parse(storedUser);
  const usermail= user.email;


    const eventData = {
      eventName,
      location,
      description,
      startDateTime: startDate.toISOString(),
      endDateTime: endDate.toISOString(),
      usermail: usermail
    };

    try {
      
       await axios.post("http://localhost:8000/api/createEvent", eventData ,{withCredentials: true});
      alert("Event Create");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    }
  };

  return (
    <div className="container " style={{display: "flex",  justifyContent:"center", marginTop:"6%" }} >
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    
      <div style={{  display: "flex", flexDirection: "column", gap: "10px", width: "350px", padding: "20px", border: "2px solid green", borderRadius: "10px"}}>
        
        <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle}></textarea>

        <DesktopDateTimePicker 
          label="Start Date & Time"
          value={startDate}
          onChange={handleStartDateChange}
          disablePast
          minDateTime={dayjs()} // Disable past dates
          maxDate={dayjs().add(10, "day")} // Allow selection only for the next 10 days
        />

        <DesktopDateTimePicker 
          label="End Date & Time"
          value={endDate}
          onChange={handleEndDateChange}
          disablePast
          minDateTime={startDate.add(1, "hour")} // Minimum 1 hour after start time
          maxDate={dayjs().add(10, "day")} // Limit to the next 10 days
        />

        <button onClick={handleSubmit} style={buttonStyle}>Create Event</button>
      </div>
    </LocalizationProvider>
    </div>
  );

}

// Styles
const inputStyle = { padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "100%" };
const buttonStyle = { padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" };
