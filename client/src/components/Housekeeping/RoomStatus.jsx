import React, { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import axios from "axios";

const RoomStatus = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/rooms");
        setRooms(response.data.rooms);
      } catch (error) {
        console.error("Error fetching room statuses:", error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Room Status
      </Typography>
      <Box>
        {rooms.map((room) => (
          <Paper key={room._id} sx={{ padding: "1rem", marginBottom: "1rem" }}>
            <Typography variant="h6">Room {room.roomNumber}</Typography>
            <Typography variant="body1">Status: {room.housekeepingStatus}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default RoomStatus;
