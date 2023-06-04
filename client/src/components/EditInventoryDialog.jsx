import React, { useState } from "react";
import { TextField, Button, DialogContent, DialogActions } from "@mui/material";

const EditInventoryDialog = ({ onSubmit, onCancel, fetchedInventory }) => {
  const [inventory, setInventory] = useState(fetchedInventory);

  const handleChange = (event) => {
    const { name, value } = event.target;
    fetchedInventory[name] = value;
    setInventory((prevInventory) => ({ ...prevInventory, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    inventory.code = fetchedInventory.code;
    if (
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
        <TextField name="name" value = {fetchedInventory.name} label="Stock Name" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="description" value = {fetchedInventory.description} label="Stock Description" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="type" value = {fetchedInventory.type} label="Stock Type" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="amount" value = {fetchedInventory.amount} label="Stock Amount" fullWidth margin="normal" onChange={handleChange} />
        <TextField name="price" value = {fetchedInventory.price} label="Stock Price" fullWidth margin="normal" onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </>
  );
};

export default EditInventoryDialog;