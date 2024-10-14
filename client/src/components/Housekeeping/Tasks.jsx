import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import axios from "axios";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/tasks");
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:5001/api/tasks/${id}`, { status });
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>
      <Box>
        {tasks.map((task) => (
          <Paper key={task._id} sx={{ padding: "1rem", marginBottom: "1rem" }}>
            <Typography variant="h6">{task.type}</Typography>
            <Typography variant="body1">{task.description}</Typography>
            <Typography variant="body1">Status: {task.status}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleUpdateStatus(task._id, "Completed")}
            >
              Mark as Completed
            </Button>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Tasks;
