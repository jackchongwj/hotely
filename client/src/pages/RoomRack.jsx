import React, { useState, useEffect } from "react";
import axios, { HttpStatusCode } from "axios";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Menu,
  MenuItem,
  Select,
  Typography,
  IconButton,
  useTheme,
  SvgIcon,
  Popover
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';

const RoomRack = () => {
  const theme = useTheme();
  const [rooms, setRooms] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [menuOptions, setMenuOptions] = React.useState([]);
  const [showMsg, setShowMsg] = React.useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token"); // get the token from local storage
        const config = {
          headers: { Authorization: token }, // pass the token as a header
        };
        const response = await axios.get(
          "http://localhost:5001/api/room-rack",
          config
        );
        setRooms(response.data.rooms);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRooms();
  }, []);

  const handleHousekeepingChange = async (id, newHousekeeping) => {
    try {
      const token = localStorage.getItem("token"); // get the token from local storage
      const config = {
        headers: { Authorization: token }, // pass the token as a header
      };
      const response = await axios.put(
        `http://localhost:5001/api/room-rack/${id}`,
        { housekeeping: newHousekeeping },
        config
      );
      const updatedRoom = response.data.room;
      setRooms((prevRooms) =>
        prevRooms.map((room) => (room._id === updatedRoom._id ? updatedRoom : room))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const showReservations = (roomID) => {
    setAnchorEl(null);
  }

  const markStatus = (room) => {
    console.log("markStatus called with roomiD and status: ", room._id, room.roomStatus)
    setAnchorEl(null);
  }

  const handleIconClick = (event, roomStatus) => {
    console.log("my room status is : ", roomStatus)
    if (roomStatus == "Vacant") {
      setShowMsg(false);
      setMenuOptions(
        [{ title: "Check In", callbackMethod: (room) => { showReservations(room) } },
        {
          title: "Reserve", callbackMethod: (room) => {
            room.roomStatus = "Reserved";
            markStatus(room)
          }
        },
        {
          title: "Out of Order", callbackMethod: (room) => {
            room.roomStatus = "Out of Order";
            markStatus(room)
          }
        }]);
    } else if (roomStatus == "Occupied") {
      setShowMsg(false);
      setMenuOptions([{ title: "Check Out" }]);
    } else {
      setShowMsg(true);
      setMenuOptions([]);
    }
    setAnchorEl(event.currentTarget);
  };

  const handleIconClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h3" sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
        Room Rack
      </Typography>
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
        {rooms.map((room) => (
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
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <FormControl variant="standard" sx={{ mb: 2, minWidth: "100%" }}>
                <Select
                  value={room.housekeeping}
                  onChange={(e) =>
                    handleHousekeepingChange(room._id, e.target.value)
                  }
                >
                  <MenuItem value="Clean">Clean</MenuItem>
                  <MenuItem value="Dirty">Dirty</MenuItem>
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
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1">{room.roomType}</Typography>
              </Box>
            </CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              sx={{ padding: "0.5rem" }}
            >
              <IconButton onClick={(event) => handleIconClick(event, room.roomStatus)}>
                <AddCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleIconClose}
              >
                {
                  showMsg ?
                    <MenuItem value={"dfgh"}> dasdsada </MenuItem>
                    : menuOptions.map((item, index) => (
                      <MenuItem key={index} value={item.title} onClick={() => { item.callbackMethod(room) }}>
                        {item.title}
                      </MenuItem>
                    ))
                }
              </Menu>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
export default RoomRack;
