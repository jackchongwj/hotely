import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const EditRoomDialog = ({ roomType, onSubmit, onCancel }) => {
  const [editedRoomType, setEditedRoomType] = useState({ ...roomType });

  useEffect(() => {
    setEditedRoomType({ ...roomType });
  }, [roomType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRoomType((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(editedRoomType);
  };

  return (
    <Dialog open={true} onClose={onCancel}>
      <DialogTitle>Edit Room Type</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Room Type"
          fullWidth
          value={editedRoomType.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          fullWidth
          value={editedRoomType.description}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="price"
          label="Price"
          fullWidth
          value={editedRoomType.price}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRoomDialog;
