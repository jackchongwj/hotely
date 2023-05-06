import React, { useState } from "react";
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const AddReservation = ({ open, onClose, onSubmit }) => {
  const [reservation, setReservation] = useState({
    reservationId: "",
    customerId: "",
    numAdults: 0,
    numChildren: 0,
    daysOfStay: 0,
    roomType: "",
    arrivalDate: "",
    departureDate: "",
    leadTime: 0,
    bookingChannel: "",
    cancelled: false,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReservation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(reservation);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Reservation</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            <TextField name="reservationId" label="Reservation ID" value={reservation.reservationId} onChange={handleInputChange} margin="normal" />
            <TextField name="customerId" label="Customer ID" value={reservation.customerId} onChange={handleInputChange} margin="normal" />
            <TextField type="number" name="numAdults" label="Number of Adults" value={reservation.numAdults} onChange={handleInputChange} margin="normal" />
            <TextField type="number" name="numChildren" label="Number of Children" value={reservation.numChildren} onChange={handleInputChange} margin="normal" />
            <TextField type="number" name="daysOfStay" label="Days of Stay" value={reservation.daysOfStay} onChange={handleInputChange} margin="normal" />
            <TextField name="roomType" label="Room Type" value={reservation.roomType} onChange={handleInputChange} margin="normal" />
            <TextField type="date" name="arrivalDate" label="Arrival Date" value={reservation.arrivalDate} onChange={handleInputChange} margin="normal" />
            <TextField type="date" name="departureDate" label="Departure Date" value={reservation.departureDate} onChange={handleInputChange} margin="normal" />
            <TextField type="number" name="leadTime" label="Lead Time" value={reservation.leadTime} onChange={handleInputChange} margin="normal" />
            <TextField name="bookingChannel" label="Booking Channel" value={reservation.bookingChannel} onChange={handleInputChange} margin="normal" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddReservation;