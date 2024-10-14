import React, { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import axios from "axios";

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/housekeeping-schedule");
        setSchedule(response.data.schedule);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };
    fetchSchedule();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Schedule
      </Typography>
      <Box>
        {schedule.map((entry) => (
          <Paper key={entry._id} sx={{ padding: "1rem", marginBottom: "1rem" }}>
            <Typography variant="h6">{entry.staffName}</Typography>
            <Typography variant="body1">Shift: {entry.shift}</Typography>
            <Typography variant="body1">Date: {new Date(entry.date).toLocaleDateString()}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Schedule;
