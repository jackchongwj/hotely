import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

const AssignTaskDialog = ({ open, onClose, roomId, onTaskAssigned }) => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    assignedTo: "",
    dueDate: "",
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users"); // Adjust API endpoint as needed
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (open) {
      fetchUsers(); // Fetch users when the dialog opens
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const taskData = {
        ...formData,
        roomId, // Attach the roomId to the task
      };

      const response = await axios.post("http://localhost:5001/api/housekeeping", taskData);
      onTaskAssigned(response.data.task); // Notify parent component about the new task
      onClose(); // Close the dialog
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Task</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Task Type</InputLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <MenuItem value="Cleaning">Cleaning</MenuItem>
            <MenuItem value="Maintenance">Maintenance</MenuItem>
          </Select>
        </FormControl>

        <TextField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Priority</InputLabel>
          <Select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Assign To</InputLabel>
          <Select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
          >
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.name} {/* Adjust field if user schema differs */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          name="dueDate"
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Assign Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignTaskDialog;
