import React, { useState, useEffect } from "react";
import { TextField, Button, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import axios from 'axios';

const AddReservationDialog = ({ onSubmit, onCancel }) => {
  const today = dayjs();
  const [roomTypes, setRoomTypes] = useState([]);
  const bookingChannels = ["Walk-in", "Website", "Agoda.com", "Expedia.com", "Others"];
  const [reservation, setReservation] = useState({
    customerId: '',
    numAdults: '',
    numChildren: '',
    daysOfStay: '',
    roomType: '',
    arrivalDate: '',
    departureDate: '',
    bookingChannel: '',
  });

  // useEffect to fetch room types when component mounts
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/room-detail");
        setRoomTypes(response.data.roomDetails);
      } catch (error) {
        console.error('Error fetching room types:', error);
      }
    };
    fetchRoomTypes();
  }, []);

  // Calculate lead time whenever the arrival date changes
  useEffect(() => {
    if (reservation.arrivalDate) {
      const today = dayjs().startOf('day');
      const arrivalDate = dayjs(reservation.arrivalDate).startOf('day');
  
      if (arrivalDate.isValid()) {
        let leadTime = arrivalDate.diff(today, 'day');
        // Adjust logic to allow zero lead time explicitly
        setReservation(prev => ({ ...prev, leadTime: Math.max(0, leadTime) }));
      }
    } else {
      // Explicitly set to null when no date is available
      setReservation(prev => ({ ...prev, leadTime: null }));
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

    // Check required fields only
    if (
      reservation.customerId &&
      reservation.numAdults !== '' && 
      reservation.numChildren !== null &&
      reservation.daysOfStay !== '' && 
      reservation.roomType &&
      reservation.arrivalDate &&
      reservation.departureDate &&
      reservation.leadTime !== null &&
      reservation.bookingChannel
    ) {
      onSubmit(reservation);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <>
      <DialogContent>
        <TextField autoComplete="off" name="customerId" label="Customer ID" fullWidth margin="normal" onChange={handleChange} />
        <TextField autoComplete="off" type="number" inputProps={{ min: 0 }} name="numAdults" label="Adults" fullWidth margin="normal" onChange={handleChange} />
        <TextField autoComplete="off" type="number" inputProps={{ min: 0 }} name="numChildren" label="Children" fullWidth margin="normal" onChange={handleChange} />
        <FormControl fullWidth margin="normal">
          <InputLabel id="room-type-label">Room Type</InputLabel>
          <Select
            labelId="room-type-label"
            id="room-type-select"
            name="roomType"
            value={reservation.roomType || ''}
            label="Room Type"
            onChange={handleChange}
            fullWidth
          >
            {roomTypes.map(roomType => (
              <MenuItem key={roomType._id} value={roomType._id}>{roomType.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            autoComplete="off"
            name="arrivalDate"
            label="Arrival Date"
            sx={{ width: "100%" }}
            minDate={today}
            onChange={(date) => handleDateChange(date, "arrivalDate")}
            renderInput={(params) => <TextField {...params} />}
          />
        </DemoContainer>
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            autoComplete="off"
            name="departureDate"
            label="Departure Date"
            sx={{ width: "100%" }}
            minDate={today}
            onChange={(date) => handleDateChange(date, "departureDate")}
            renderInput={(params) => <TextField {...params} />}
          />
        </DemoContainer>
      </LocalizationProvider>
        <FormControl fullWidth margin="normal">
          <InputLabel id="booking-channel-label">Booking Channel</InputLabel>
          <Select
            labelId="booking-channel-label"
            id="booking-channel-select"
            name="bookingChannel"
            value={reservation.bookingChannel || ''}
            label="Booking Channel"
            onChange={handleChange}
            fullWidth
          >
            {bookingChannels.map(channel => (
              <MenuItem key={channel} value={channel}>{channel}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField disabled autoComplete="off" name="leadTime" label="Lead Time (days)" value={reservation.leadTime ?? ''} fullWidth margin="normal" />
        <TextField disabled autoComplete="off" name="daysOfStay" label="Days of Stay" value={reservation.daysOfStay ?? ''} fullWidth margin="normal" />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </>
  );
};

export default AddReservationDialog;