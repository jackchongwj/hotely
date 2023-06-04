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
  Slide, Dialog, DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const RoomRack = () => {
  const theme = useTheme();
  const [rooms, setRooms] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menus, setMenus] = useState([]);
  const [menuOptions, setMenuOptions] = React.useState([]);
  const [showMsg, setShowMsg] = React.useState(false);
  const [reservations, setReservations] = useState([]);
  const [reservationsDialogOpen, setReservationsDialogOpen] = useState(false);
  const [roomNumber, setRoomNumber] = useState(null);
  const [reloadList, setReloadList] = useState(false);


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
        const menus = rooms.map(m => false);
        setMenus(menus);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRooms();
  }, [reloadList]);

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

  const checkIn = async (reservationId) => {
    setReservationsDialogOpen(false);
    const token = localStorage.getItem("token"); // get the token from local storage
    const config = {
      headers: { Authorization: token }, // pass the token as a header
    };
    try {
      const response = await axios.get(`http://localhost:5001/api/room-rack/checkIn/${reservationId}/${roomNumber}`, config);
      if (response.status == 200) {
        setReloadList(!reloadList);
        alert("Checked In");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const showReservations = async (room,roomIndex) => {
    const token = localStorage.getItem("token"); // get the token from local storage
    const config = {
      headers: { Authorization: token }, // pass the token as a header
    };
    var roomType = room.roomType;
    try {
      const response = await axios.get(`http://localhost:5001/api/reservation-list/getAllAvailableReservations/${roomType}`, config);
      if (response.status != 200 || response.data == null || response.data == undefined || response.data.length <= 0) {
        return;
      }
      if (response.data && response.data.reservations && response.data.reservations.length > 0) {
        var reservations = response.data.reservations;
        setRoomNumber(room.roomNumber);
        setReservations(reservations);
        setReservationsDialogOpen(true);
      } else {
        setRoomNumber(null)
        setReservations([]);
        setReservationsDialogOpen(false);
      }
      menus[roomIndex] = false;
      setMenus(menus);
      setAnchorEl(null);
    } catch (error) {
      console.log(error);
    }
  }

  const markStatus = async (room, roomIndex, status) => {
    try {
      const token = localStorage.getItem("token"); // get the token from local storage
      const config = {
        headers: { Authorization: token }, // pass the token as a header
      };
      const roomnumber = room.roomNumber
      const response = await axios.put(`http://localhost:5001/api/room-rack/changeStatus/${roomnumber}/${status}`, {}, config);
      if (response.status == 200) {
        setReloadList(!reloadList);
        alert("Status updated");
      }
    } catch (error) {
      console.log(error);
    }
    menus[roomIndex] = false;
    setMenus(menus);
    setAnchorEl(null);
  }

  const checkout = async (room, roomIndex) => {
    try {
      const roomnumber = room.roomNumber
      const token = localStorage.getItem("token"); // get the token from local storage
      const config = {
        headers: { Authorization: token }, // pass the token as a header
      };
      const response = await axios.put(`http://localhost:5001/api/room-rack/checkOutFromRoom/${roomnumber}`, {}, config);
      if (response.status == 200) {
        setReloadList(!reloadList);
        alert("Checked Out");
      }
    } catch (error) {
      console.log(error)
    }
    menus[roomIndex] = false;
    setMenus(menus);
    setAnchorEl(null);
  }

  const handleIconClick = (event, roomStatus, roomIndex) => {
    console.log("roomIndex", roomIndex);
    if (roomStatus == "Vacant") {
      setShowMsg(false);
      setMenuOptions(
        [{ title: "Check In", callbackMethod: (room) => { showReservations(room, roomIndex) } },
        {
          title: "Reserve", callbackMethod: (room) => {
            markStatus(room, roomIndex, "1");
          }
        },
        {
          title: "Out of Order", callbackMethod: (room) => {
            markStatus(room, roomIndex, "2");
          }
        }]);
    } else if (roomStatus == "Occupied") {
      setShowMsg(false);
      setMenuOptions([{ title: "Check Out", callbackMethod: (room) => checkout(room, roomIndex) }]);
    } else {
      setShowMsg(true);
      setMenuOptions([]);
    }
    menus[roomIndex] = true;
    setMenus(menus);
    setAnchorEl(event.currentTarget)
  };

  const handleIconClose = (roomIndex) => {
    menus[roomIndex] = false;
    setMenus(menus);
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
        {rooms.map((room, roomIndex) => (
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
              <IconButton onClick={(event) => handleIconClick(event, room.roomStatus, roomIndex)}>
                <AddCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={menus[roomIndex]}
                onClose={() => { handleIconClose(roomIndex) }}
              >
                {
                  showMsg ?
                    <MenuItem value={"Room is Reserved / Out Of Order"}> Room is Reserved / Out Of Order </MenuItem>
                    : menuOptions.map((item, index) => {
                      return <MenuItem onClick={() => item.callbackMethod(room)} >
                        {item.title}
                      </MenuItem>
                    }

                    )
                }
              </Menu>
            </Box>
          </Card>
        ))}
        <Dialog
          open={reservationsDialogOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => { setReservationsDialogOpen(false); }}
        >
          <DialogTitle>{"Select Reservation to check In"}</DialogTitle>
          <DialogContent>
            {
              reservations.map((item, index) => (
                <Button onClick={() => { checkIn(item._id) }}> {item.reservationId} </Button>
              ))
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setReservationsDialogOpen(false) }}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};
export default RoomRack;
