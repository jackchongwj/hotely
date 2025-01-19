import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import AssignTaskDialog from "components/RoomRack/AssignTaskDialog";
import axios from "axios";

const HousekeepingPage = () => {
  const [tasks, setTasks] = useState([]);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  // Fetch tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/housekeeping");
      setTasks(
        response.data.tasks.map((task, index) => ({
          id: task._id, // Use the unique ID as DataGrid row ID
          index: index + 1,
          roomNumber: task.roomId?.roomNumber || "N/A",
          roomType: task.roomId?.roomType || "N/A",
          status: task.status,
          availability: task.availability || "N/A",
          priority: task.priority,
          assignedTo: task.assignedTo?.name || "Unassigned",
          inspectBy: task.inspectBy || "N/A",
        }))
      );
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Mark task as "Inspect"
  const handleMarkAsInspect = async (taskId) => {
    try {
      await axios.put(`http://localhost:5001/api/housekeeping/${taskId}`, {
        status: "Inspect",
      });
      fetchTasks(); // Refresh data
    } catch (error) {
      console.error("Error marking task as inspect:", error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5001/api/housekeeping/${taskId}`);
      fetchTasks(); // Refresh data
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Open Assign Task Dialog
  const openAssignTaskDialog = () => {
    setAssignDialogOpen(true);
  };

  const closeAssignTaskDialog = () => {
    setAssignDialogOpen(false);
    fetchTasks(); // Refresh tasks after assigning
  };

  // Define DataGrid columns
  const columns = [
    { field: "roomNumber", headerName: "Room No", width: 100 },
    { field: "roomType", headerName: "Room Type", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            color:
              params.value === "Inspect"
                ? "orange"
                : params.value === "Ready"
                ? "green"
                : params.value === "In Progress"
                ? "blue"
                : "gray",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    { field: "availability", headerName: "Availability", width: 120 },
    {
      field: "priority",
      headerName: "Priority",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            color:
              params.value === "High"
                ? "red"
                : params.value === "Normal"
                ? "orange"
                : "green",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    { field: "assignedTo", headerName: "Assigned To", width: 150 },
    { field: "inspectBy", headerName: "Inspect By", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleMarkAsInspect(params.row.id)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteTask(params.row.id)}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box p="1.5rem 2.5rem">
      <Typography variant="h3" mb={3}>
        Housekeeping Tasks
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          variant="contained"
          sx={{ mr: 2, backgroundColor: theme => theme.palette.secondary.light }} 
          onClick={() => openAssignTaskDialog}
        >
          Add Cleaning Task
        </Button>
      </Box>

      {/* DataGrid for Housekeeping Tasks */}
      <Box style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={tasks}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
        />
      </Box>

      {/* Assign Task Dialog */}
      <AssignTaskDialog
        open={assignDialogOpen}
        onClose={closeAssignTaskDialog}
      />
    </Box>
  );
};

export default HousekeepingPage;
