import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  IconButton,
  useTheme,
  Button,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";

const RoomRack = () => {
  const theme = useTheme();
  const [roomStatus, setRoomStatus] = useState({
    1: "Clean",
    2: "Clean",
    3: "Clean",
    4: "Clean",
    5: "Clean",
    6: "Clean",
  });
  // Handle the change of room status dropdown
  const handleRoomStatusChange = (event, roomId) => {
    setRoomStatus({ ...roomStatus, [roomId]: event.target.value });
  };

  const rooms = [
    {
      id: 1,
      number: 101,
      type: "Standard",
      status: "Clean",
      occupied: "Vacant",
    },
    {
      id: 2,
      number: 102,
      type: "Standard",
      status: "Clean",
      occupied: "Occupied",
    },
    {
      id: 3,
      number: 103,
      type: "Deluxe",
      status: "Clean",
      occupied: "Reserved",
    },
    {
      id: 4,
      number: 104,
      type: "Deluxe",
      status: "Clean",
      occupied: "Out of Order",
    },
    {
      id: 5,
      number: 105,
      type: "Standard",
      status: "Clean",
      occupied: "Vacant",
    },
    {
      id: 6,
      number: 106,
      type: "Deluxe",
      status: "Clean",
      occupied: "Vacant",
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h3" sx={{ marginTop: "1rem", marginBottom: "1rem"}}>Room Rack</Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex">
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Check-in
          </Button>
          <Button variant="contained" color="primary" >
            Check-out
          </Button>
        </Box>
        <Box display="flex">
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Add Room(s)
          </Button>
          <Button variant="contained" color="primary" >
            Delete Room(s)
          </Button>
        </Box>
      </Box>
      <Box display="flex" flexWrap="wrap" >
        {rooms.map((room) => (
          <Card
            key={room.id}
            sx={{
              margin: "1rem",
              width: "200px", // set the card width
              height: "250px", // set the card height
              borderRadius: theme.shape.borderRadius,
              boxShadow: theme.shadows[2],
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <FormControl sx={{ minWidth: "100px" }}>
                <Select
                  value={roomStatus[room.id] || ""}
                  onChange={(event) => handleRoomStatusChange(event, room.id)}
                  sx={{ height: "32px" }}
                >
                  <MenuItem value={"Clean"}>Clean</MenuItem>
                  <MenuItem value={"Dirty"}>Dirty</MenuItem>
                </Select>
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: 60,
                    color: 
                    room.occupied === "Vacant"
                    ? "green"
                    : room.occupied === "Occupied"
                    ? "yellow"
                    : room.occupied === "Reserved"
                    ? "blue"
                    : room.occupied === "Out of Order"
                    ? "red"
                    : "black",
                  }}
                >
                  {room.number}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1">{room.type}</Typography>
              </Box>
            </CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              sx={{ padding: "0.5rem" }}
            >
              <IconButton>
                <AddCircle />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
export default RoomRack;
