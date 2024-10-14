import React, { useState } from "react";
import { TextField, Button, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';

const BASE_URL = "http://localhost:5001/api";

const AddGuestDialog = ({ onSubmit, onCancel }) => {
  const [guest, setGuest] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    identification: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setGuest(prevGuest => ({ ...prevGuest, [name]: value }));
  };

  const handleDateChange = (date) => {
    setGuest(prev => ({ ...prev, dateOfBirth: date ? date.$d : null }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      guest.firstName &&
      guest.lastName &&
      guest.phone &&
      guest.email &&
      guest.identification &&
      guest.dateOfBirth &&
      guest.nationality &&
      guest.address
    ) {
      try {
        await axios.post(`${BASE_URL}/guests`, guest);
        onSubmit(); 
      } catch (error) {
        console.error('Error adding guest:', error);
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <>
      <DialogContent>
        <TextField 
          autoComplete="off" 
          name="firstName" 
          label="First Name" 
          fullWidth 
          margin="normal" 
          onChange={handleChange} 
        />
        <TextField 
          autoComplete="off" 
          name="lastName" 
          label="Last Name" 
          fullWidth 
          margin="normal" 
          onChange={handleChange} 
        />
        <TextField 
          autoComplete="off" 
          name="phone" 
          label="Phone" 
          fullWidth 
          margin="normal" 
          onChange={handleChange} 
        />
        <TextField 
          autoComplete="off" 
          name="email" 
          label="Email" 
          fullWidth 
          margin="normal" 
          onChange={handleChange} 
        />
        <TextField 
          autoComplete="off" 
          name="identification" 
          label="Identification" 
          fullWidth 
          margin="normal" 
          onChange={handleChange} 
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            autoComplete="off"
            name="dateOfBirth"
            label="Date of Birth"
            sx={{ width: "100%" }}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <TextField 
          autoComplete="off" 
          name="nationality" 
          label="Nationality" 
          fullWidth 
          margin="normal" 
          onChange={handleChange} 
        />
        <TextField 
          autoComplete="off" 
          name="address" 
          label="Address" 
          fullWidth 
          margin="normal" 
          onChange={handleChange} 
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </>
  );
};

export default AddGuestDialog;
