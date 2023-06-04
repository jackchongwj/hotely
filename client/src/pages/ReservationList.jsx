import React, { useState, useEffect } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Box, Typography, Button, Dialog, Slide, DialogContent, DialogActions, DialogTitle } from "@mui/material";
import axios from "axios";
import AddReservationDialog from "../components/AddReservationDialog";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ReservationList = () => {
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = React.useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [rows, setRows] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showRooms, setShowRooms] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const rowsWithIndex = rows.map((row, index) => ({ ...row, id: index + 1 }));
  const [reloadList, setReloadList] = useState(false);

  const columns = [
    { field: "id", headerName: "#", width: 90 },
    { field: "uniqueId", headerName: "Reservation ID", width: 150 },
    { field: "customerId", headerName: "Customer ID", width: 150 },
    { field: "numAdults", headerName: "Adults", width: 90 },
    { field: "numChildren", headerName: "Children", width: 90 },
    { field: "daysOfStay", headerName: "Days of Stay", width: 90 },
    { field: "roomType", headerName: "Room Type", width: 120 },
    { field: "arrivalDate", headerName: "Arrival Date", width: 120 },
    { field: "departureDate", headerName: "Departure Date", width: 120 },
    { field: "leadTime", headerName: "Lead Time", width: 90 },
    { field: "checkedIn", headerName: "Checked In", width: 90 },
    { field: "checkedOut", headerName: "Checked Out", width: 90 },
    { field: "bookingChannel", headerName: "Booking Channel", width: 150 },
    { field: "cancelled", headerName: "Cancelled", width: 90 },
  ];

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token"); // get the token from local storage
        const config = {
          headers: { Authorization: token }, // pass the token as a header
        };
        const response = await axios.get(
          "http://localhost:5001/api/reservation-list", config
        );
        console.log(response)
        // filter the reservations where cancelled is false
        const filteredReservations = response.data.reservations.filter(
          (reservation) => !reservation.cancelled
        );

        setRows(filteredReservations);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReservations();
  }, [reloadList]);

  const handleRowClick = (params) => {
    setSelectedRow(params.id);
  };

  const createReservation = async (reservation) => {
    try {
      const token = localStorage.getItem("token"); // get the token from local storage
      const config = {
        headers: { Authorization: token }, // pass the token as a header
      };
      const response = await axios.post(
        "http://localhost:5001/api/reservation-list", reservation
        , config);
      setReloadList(!reloadList)
    } catch (error) {
      console.log(error);
    }
    setDialogOpen(false);
  };

  const cancelReservation = async (id) => {
    try {
      setDeleteConfirmationDialog(false);
      if (id == null || id == undefined) {
        return;
      }
      const token = localStorage.getItem("token"); // get the token from local storage
      const config = {
        headers: { Authorization: token }, // pass the token as a header
      };
      const reservationId = rows[id - 1].reservationId;
      await axios.put(`http://localhost:5001/api/reservation-list/${reservationId}`, {}, config);
      setRows(rows.filter((row) => row.id !== id));
      setReloadList(!reloadList)
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = () => {
    if (selectedRow == null || selectedRow == undefined) {
      return;
    }
    setDeleteConfirmationDialog(true);
  };


  const checkIn = async (roomNumber) => {
    setShowRooms(true);
    setRoomDialogOpen(false)
    var selectedRowId = rows[selectedRow-1]._id;
    const token = localStorage.getItem("token"); // get the token from local storage
    const config = {
      headers: { Authorization: token }, // pass the token as a header
    };
    try {
      const response = await axios.get(`http://localhost:5001/api/room-rack/checkIn/${selectedRowId}/${roomNumber}`, config);
      if (response.status == 200) {
        alert("Checked In");
      }
      setReloadList(!reloadList);
    } catch (error){
      console.log(error)
    }
  }

  const checkOut = async () => {
    var selectedRowId = rows[selectedRow - 1]._id;
    const token = localStorage.getItem("token"); // get the token from local storage
    const config = {
      headers: { Authorization: token }, // pass the token as a header
    };
    try {
      const response = await axios.put(`http://localhost:5001/api//reservation-list/checkOutFromReservations/${selectedRowId}`, config);
      if (response.status == 200) {
        setReloadList(!reloadList);
        alert("Checked Out")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getAllAvailableReservations = async () => {
    const token = localStorage.getItem("token"); // get the token from local storage
    const config = {
      headers: { Authorization: token }, // pass the token as a header
    };
    var roomType = rows[selectedRow - 1].roomType;
    try {
      const response = await axios.get(`http://localhost:5001/api/room-rack/getAllAvailableRoomForType/${roomType}`, config);
      if (response.status != 200 || response.data == null || response.data == undefined || response.data.length <= 0) {
        return;
      }
      if(response.data &&  response.data.rooms &&  response.data.rooms.length > 0){
        var rooms = response.data.rooms;
        setRooms(rooms);
        setShowRooms(true);
      } else {
        setRooms([]);
        setShowRooms(false);
      }
      setRoomDialogOpen(true);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h3" sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
        Reservation List
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex">
          <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={getAllAvailableReservations}>
            Check-in
          </Button>
          <Button variant="contained" color="primary" onClick={checkOut}>
            Check-out
          </Button>
        </Box>
        <Box display="flex">
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            onClick={() => setDialogOpen(true)}
          >
            Add Reservation
          </Button>
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <AddReservationDialog
              onSubmit={createReservation}
              onCancel={() => setDialogOpen(false)}
            />
          </Dialog>
          <Button
            variant="contained"
            color="primary"
            onClick={confirmDelete}>
            Delete Reservation
          </Button>
        </Box>
      </Box>
      <DataGridPro
        rows={rowsWithIndex}
        columns={columns}
        disableSelectionOnClick
        autoHeight
        disableMultipleRowSelection
        onRowClick={handleRowClick}
        selectionModel={selectedRow !== null ? [selectedRow] : []}
        pageSize={10}
      />
      <DeleteConfirmationDialog
        selectedValue={selectedRow}
        open={deleteConfirmationDialog}
        onClose={cancelReservation}
      />
      <Dialog
        open={roomDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => { setShowRooms(true); setRoomDialogOpen(false) }}
      >
        <DialogTitle>{"Select Room Number to check In"}</DialogTitle>
        <DialogContent>
          {
            showRooms ?
              rooms.map((item, index) => (
                <Button onClick={() => { checkIn(item.roomNumber) }}> {item.roomNumber} </Button>
              ))
              : null
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowRooms(true); setRoomDialogOpen(false) }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ReservationList;
