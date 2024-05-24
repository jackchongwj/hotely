import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const AddRoomDialog = ({ onSubmit, onCancel }) => {
  const [roomType, setRoomType] = useState({
    name: "",
    description: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomType((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(roomType);
    setRoomType({
      name: "",
      description: "",
      price: "",
    });
  };

  return (
    <Dialog open={true} onClose={onCancel}>
      <DialogTitle>Add Room Type</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Room Type"
          fullWidth
          value={roomType.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          fullWidth
          value={roomType.description}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="price"
          label="Price"
          fullWidth
          value={roomType.price}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRoomDialog;
