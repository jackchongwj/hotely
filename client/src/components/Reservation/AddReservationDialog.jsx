import React, { useState, useEffect } from "react";
import { TextField, Button, DialogContent, DialogActions } from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const AddReservationDialog = ({ onSubmit, onCancel }) => {
  const [reservation, setReservation] = useState({
    numAdults: '',
    numChildren: '',
    daysOfStay: '',
    leadTime: ''
  });

  // Calculate lead time whenever the arrival date changes
  useEffect(() => {
    if (reservation.arrivalDate) {
      const today = dayjs();
      const arrivalDate = dayjs(reservation.arrivalDate);
      const leadTime = arrivalDate.diff(today, 'day'); // Calculates the difference in days
      setReservation(prev => ({ ...prev, leadTime }));
    }
  }, [reservation.arrivalDate]);

  // Calculate days of stay whenever the departure or arrival date changes
  useEffect(() => {
    if (reservation.departureDate && reservation.arrivalDate) {
      const departureDate = dayjs(reservation.departureDate);
      const arrivalDate = dayjs(reservation.arrivalDate);
      const daysOfStay = departureDate.diff(arrivalDate, 'day');
      setReservation(prev => ({ ...prev, daysOfStay }));
    }
  }, [reservation.departureDate, reservation.arrivalDate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReservation(prevReservation => ({ ...prevReservation, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    setReservation(prev => ({ ...prev, [field]: date ? date.$d : null }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("reservation", reservation);

    if (
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
        <TextField autoComplete="off" name="customerId" label="Customer ID" fullWidth margin="normal" onChange={handleChange} />
        <TextField autoComplete="off" type="number" inputProps={{ min: 0 }} name="numAdults" label="Adults" fullWidth margin="normal" onChange={handleChange} />
        <TextField autoComplete="off" type="number" inputProps={{ min: 0 }} name="numChildren" label="Children" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="roomType" label="Room Type" fullWidth margin="normal" onChange={handleChange} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker autoComplete="off" name="arrivalDate" label="Arrival Date" sx={{ width: "100%" }} onChange={(date) => handleDateChange(date, "arrivalDate")} />
          </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker autoComplete="off" name="departureDate" label="Departure Date" sx={{ width: "100%" }} onChange={(date) => handleDateChange(date, "departureDate")} />
          </DemoContainer>
        </LocalizationProvider>
        <TextField name="bookingChannel" label="Booking Channel" fullWidth margin="normal" onChange={handleChange} />
        <TextField disabled autoComplete="off" name="leadTime" label="Lead Time (days)" value={reservation.leadTime || ''} fullWidth margin="normal" />
        <TextField disabled autoComplete="off" name="daysOfStay" label="Days of Stay" value={reservation.daysOfStay || ''} fullWidth margin="normal" />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </>
  );
};

export default AddReservationDialog;
