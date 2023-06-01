import React, { useState } from "react";
import { TextField, Button, DialogContent, DialogActions } from "@mui/material";

const AddInventoryDialog = ({ onSubmit, onCancel }) => {
  const [inventory, setInventory] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInventory((prevInventory) => ({ ...prevInventory, [name]: value }));
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      inventory.code != null &&
      inventory.name != null &&
      inventory.description != null &&
      inventory.type != null &&
      inventory.amount != null &&
      inventory.price != null
    ) {
    onSubmit(inventory);
    } else {
      alert("Please fill in all fields.");
    }
  };
  return (
    <>
      <DialogContent>
        <TextField name="code" label="Stock Code" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="name" label="Stock Name" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="description" label="Stock Description" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="type" label="Stock Type" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="amount" label="Stock Amount" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="price" label="Stock Price" fullWidth margin="normal" onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </>
  );
};

export default AddInventoryDialog;