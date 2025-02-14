import React, { useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";

export default function Calendar() {
  
  const [selectedDate, setSelectedDate] = useState(dayjs());

 
  const handleDateChange = (newValue) => {
    if (newValue) {
      setSelectedDate(newValue);
      console.log("Selected Date & Time:", newValue.format("DD-MM-YYYY HH:mm"));
    }
  };
  console.log(selectedDate)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDateTimePicker 
        label="Pick a Date & Time"
        value={selectedDate}
        onChange={handleDateChange} 
      />
    </LocalizationProvider>
  );
}
