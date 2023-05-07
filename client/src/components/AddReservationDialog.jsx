import React, { useState } from "react";
import { TextField, Button, DialogContent, DialogActions } from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const AddReservationDialog = ({ onSubmit, onCancel }) => {
  const [reservation, setReservation] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReservation((prevReservation) => ({ ...prevReservation, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    console.log("dateeeee", date.$d)
    setReservation({...reservation, [field]:date.$d })
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("reservation", reservation)

    if (
      // reservation.reservationId &&
      reservation.customerId &&
      reservation.numAdults &&
      reservation.numChildren &&
      reservation.daysOfStay &&
      reservation.roomType &&
      reservation.arrivalDate &&
      reservation.departureDate &&
      reservation.leadTime &&
      reservation.bookingChannel 
    ) {
      onSubmit(reservation);
    } else {
      alert("Please fill in all fields.");
    }
  };
  return (
    <>
      <DialogContent>
        {/* <TextField name="reservationId" label="Reservation ID" fullWidth margin="normal" onChange={handleChange} /> */}
        <TextField name="customerId" label="Customer ID" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="numAdults" label="Adults" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="numChildren" label="Children" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="daysOfStay" label="Days of Stay" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="roomType" label="Room Type" fullWidth margin="normal" onChange={handleChange} />
        {/* <TextField name="arrivalDate" label="Arrival Date" fullWidth margin="normal" onChange={handleChange} /> */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']} >
            <DatePicker name="arrivalDate" label="Arrival Date" sx={{ width: "100%" }} onChange={(date)=>handleDateChange(date, "arrivalDate")} />
          </DemoContainer>
        </LocalizationProvider>
        {/* <TextField name="departureDate" label="Departure Date" fullWidth margin="normal" onChange={handleChange} /> */}
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']} >
            <DatePicker name="departureDate" label="Departure Date" sx={{ width: "100%" }} onChange={(date)=>handleDateChange(date, "departureDate")} />
          </DemoContainer>
        </LocalizationProvider>

        <TextField name="leadTime" label="Lead Time" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="bookingChannel" label="Booking Channel" fullWidth margin="normal" onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </>
  );
};

export default AddReservationDialog;