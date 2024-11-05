import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
  Typography,
  IconButton,
  useTheme,
  Menu,
  MenuItem as MenuOption,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  InputLabel,
} from "@mui/material";
import { AddCircle, FilterList } from "@mui/icons-material";

const RoomRack = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    availability: "all",
    type: "all",
    status: "all",
  });
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/room-rack", {
          withCredentials: true,
        });
        const sortedRooms = response.data.rooms.sort((a, b) => a.roomNumber - b.roomNumber);
        
        // Apply housekeeping logic
        const updatedRooms = sortedRooms.map((room) => {
          if (room.roomStatus === "Vacant" && !room.housekeeping) {
            room.housekeeping = { status: "Clean" };
          } else {
            room.housekeeping = { status: "Dirty" };
          }
          return room;
        });

        setRooms(updatedRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, [theme]);

  const handleHousekeepingChange = async (id, newHousekeeping) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/room-rack/${id}`,
        { housekeeping: newHousekeeping }
      );
      const updatedRoom = response.data.room;
      setRooms((prevRooms) =>
        prevRooms.map((room) => (room._id === updatedRoom._id ? updatedRoom : room))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleMenuOpen = (event, room) => {
    setAnchorEl(event.currentTarget);
    setSelectedRoom(room);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRoom(null);
  };

  const handleMenuOptionClick = (option) => {
    console.log(`Selected option ${option} for room ${selectedRoom.roomNumber}`);
    handleMenuClose();
  };

  const applyFilters = (rooms) => {
    return rooms.filter((room) => {
      const matchesAvailability =
        filters.availability === "all" || room.roomStatus === filters.availability;
      const matchesType = filters.type === "all" || room.roomType === filters.type;
      const matchesStatus = filters.status === "all" || room.housekeeping === filters.status;
      return matchesAvailability && matchesType && matchesStatus;
    });
  };

  const handleFilterDialogOpen = () => {
    setFilterDialogOpen(true);
  };

  const handleFilterDialogClose = () => {
    setFilterDialogOpen(false);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3" sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
          Room Rack
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FilterList />}
          onClick={handleFilterDialogOpen}
        >
          Filters
        </Button>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box sx={{ display: "inline-block" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "50%",
                backgroundColor: "green",
                mr: 0.5,
              }}
            ></Box>
            <Typography variant="subtitle1" sx={{ fontSize: "0.9rem", mr: 2 }}>
              Vacant
            </Typography>
            <Box
              sx={{
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "50%",
                backgroundColor: "yellow",
                mr: 0.5,
              }}
            ></Box>
            <Typography variant="subtitle1" sx={{ fontSize: "0.9rem", mr: 2 }}>
              Occupied
            </Typography>
            <Box
              sx={{
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "50%",
                backgroundColor: "blue",
                mr: 0.5,
              }}
            ></Box>
            <Typography variant="subtitle1" sx={{ fontSize: "0.9rem", mr: 2 }}>
              Reserved
            </Typography>
            <Box
              sx={{
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "50%",
                backgroundColor: "red",
                mr: 0.5,
              }}
            ></Box>
            <Typography variant="subtitle1" sx={{ fontSize: "0.9rem" }}>
              Out of Order
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box display="flex" flexWrap="wrap" justifyContent="center">
        {applyFilters(rooms).map((room) => (
          <Card
            key={room._id}
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
              backgroundColor: theme.palette.secondary.light
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <FormControl variant="standard" sx={{ mt: 2, minWidth: "100%" }}>
                <Select
                  value={room.housekeeping.status}
                  onChange={(e) =>
                    handleHousekeepingChange(room._id, e.target.value)
                  }
                >
                  <MenuItem value="Clean">Clean</MenuItem>
                  <MenuItem value="Dirty">Dirty</MenuItem>
                </Select>
              </FormControl>
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: 60,
                  color:
                    room.roomStatus === "Vacant"
                      ? "green"
                      : room.roomStatus === "Occupied"
                      ? "yellow"
                      : room.roomStatus === "Reserved"
                      ? "blue"
                      : room.roomStatus === "Out of Order"
                      ? "red"
                      : "black",
                }}
              >
                {room.roomNumber}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: 14 }}>
                {room.roomType.name}
              </Typography>

            </CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              sx={{ padding: "0.5rem" }}
            >
              <IconButton onClick={(e) => handleMenuOpen(e, room)}>
                <AddCircle />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuOption onClick={() => handleMenuOptionClick("assignTask")}>
          Assign Task
        </MenuOption>
        <MenuOption onClick={() => handleMenuOptionClick("addNotes")}>
          Add Notes
        </MenuOption>
        <MenuOption onClick={() => handleMenuOptionClick("viewDetails")}>
          View Details
        </MenuOption>
        <MenuOption onClick={() => handleMenuOptionClick("changeStatus")}>
          Change Status
        </MenuOption>
      </Menu>

      <Dialog open={filterDialogOpen} onClose={handleFilterDialogClose}>
        <DialogTitle>Filter Options</DialogTitle>
        <DialogContent>
          <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
            <InputLabel>Room Availability</InputLabel>
            <Select
              value={filters.availability}
              onChange={(e) => handleFilterChange("availability", e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Vacant">Vacant</MenuItem>
              <MenuItem value="Occupied">Occupied</MenuItem>
              <MenuItem value="Reserved">Reserved</MenuItem>
              <MenuItem value="Out of Order">Out of Order</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
            <InputLabel>Room Type</InputLabel>
            <Select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Standard">Standard</MenuItem>
              <MenuItem value="Deluxe">Deluxe</MenuItem>
              <MenuItem value="Suite">Suite</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
            <InputLabel>Housekeeping Status</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Clean">Clean</MenuItem>
              <MenuItem value="Dirty">Dirty</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RoomRack;
