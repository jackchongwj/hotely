import React, { useState } from "react";
import { TextField, Button, DialogContent, DialogActions } from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const AddGuestDialog = ({ onSubmit, onCancel }) => {
  const [guest, setGuest] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setGuest((prevGuest) => ({ ...prevGuest, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    console.log("dateeeee", date.$d)
    setGuest({...guest, [field]:date.$d })
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      guest.firstName != null &&
      guest.lastName != null &&
      guest.phone != null &&
      guest.email != null &&
      guest.identification != null &&
      guest.dateOfBirth != null &&
      guest.nationality != null &&
      guest.address != null 
    ) {
    onSubmit(guest);
    } else {
      alert("Please fill in all fields.");
    }
  };
  return (
    <>
      <DialogContent>
        <TextField name="firstName" label="First Name" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="lastName" label="Last Name" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="phone" label="Phone No" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="email" label="Email" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="identification" label="ID Number" fullWidth margin="normal" onChange={handleChange} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']} >
            <DatePicker name="dateOfBirth" label="DOB" sx={{ width: "100%" }} onChange={(date)=>handleDateChange(date, "dateOfBirth")} />
          </DemoContainer>
        </LocalizationProvider>
        <TextField name="nationality" label="Nationality" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="address" label="Address" fullWidth margin="normal" onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </>
  );
};

export default AddGuestDialog;