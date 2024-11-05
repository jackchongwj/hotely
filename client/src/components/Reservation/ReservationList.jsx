import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Button, Dialog, DialogContent, DialogTitle, MenuItem, Select, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import AddReservationDialog from "./AddReservationDialog";
import { format, differenceInDays } from "date-fns";

const BASE_URL = "http://localhost:5001/api/reservation-list";
const ROOM_URL = "http://localhost:5001/api/rooms";

const ReservationList = () => {
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [rows, setRows] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [alert, setAlert] = useState({ open: false, severity: "", message: "" }); // Alert state for notifications
  const [page, setPage] = useState(0); // DataGrid page starts at 0
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const rowsWithIndex = rows.map((row, index) => {
    const arrivalDate = new Date(row.arrivalDate);
    const today = new Date();
    const leadTime = differenceInDays(arrivalDate, today);

    return {
      ...row,
      id: index + 1 + page * pageSize,
      _id: row._id,
      leadTime: leadTime >= 0 ? leadTime : 0,
    };
  });

  const columns = [
    { field: "id", headerName: "#", width: 50 },
    { field: "reservationId", headerName: "Reservation ID", width: 100 },
    { field: "customerId", headerName: "Customer ID", width: 120, valueGetter: (params) => params.row.customerId.customerId },
    { field: "numAdults", headerName: "Adults", width: 80 },
    { field: "numChildren", headerName: "Children", width: 90, valueGetter: (params) => params.row.numChildren ?? 0 },
    { field: "daysOfStay", headerName: "Days of Stay", width: 80 },
    { field: "roomType", headerName: "Room Type", width: 120, valueGetter: (params) => params.row.roomType.name },
    { field: "arrivalDate", headerName: "Arrival Date", width: 120, valueGetter: (params) => format(new Date(params.row.arrivalDate), 'yyyy-MM-dd') },
    { field: "departureDate", headerName: "Departure Date", width: 120, valueGetter: (params) => format(new Date(params.row.departureDate), 'yyyy-MM-dd') },
    { ffield: "leadTime", headerName: "Lead Time", width: 90, valueGetter: (params) => params.row.leadTime },
    { field: "checkedIn", headerName: "Checked In", width: 90 },
    { field: "checkedOut", headerName: "Checked Out", width: 90 },
    { field: "bookingChannel", headerName: "Booking Channel", width: 150 },
    { field: "cancelled", headerName: "Cancelled", width: 90 },
    { field: "totalPrice", headerName: "Total Price", width: 150, valueGetter: (params) => params.row.roomType.price * params.row.daysOfStay },
  ];

  const fetchReservations = async (page, pageSize) => {
    try {
      const response = await axios.get(`${BASE_URL}?page=${page + 1}&limit=${pageSize}`, {
        withCredentials: true,
      });
      setRows(response.data.reservations);
      setTotalRows(response.data.total); // Set total rows for pagination
    } catch (error) {
      showAlert("error", "Error fetching reservations.");
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchAvailableRooms = async (roomTypeId) => {
    try {
      const response = await axios.get(`${ROOM_URL}/available?roomType=${roomTypeId}`);
      setAvailableRooms(response.data);
    } catch (error) {
      showAlert("error", "Error fetching available rooms.");
    }
  };

  useEffect(() => {
    fetchReservations(page, pageSize);
  }, [page, pageSize]); // Fetch data whenever page or pageSize changes

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const handleRowClick = (params) => {
    setSelectedRowId(params.row._id);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(0); // Reset to the first page when page size changes
  };

  const handleCheckIn = async () => {
    const selectedRow = rows.find(row => row._id === selectedRowId);
    if (selectedRow && selectedRow.checkedIn === false) {
      await fetchAvailableRooms(selectedRow.roomType._id);
      setRoomDialogOpen(true);
    }
  };

  const handleConfirmCheckIn = async () => {
    try {
      await axios.put(`${BASE_URL}/${selectedRowId}/check-in`, { roomId: selectedRoom });
      setRows(rows.map((row) => (row._id === selectedRowId ? { ...row, checkedIn: true, room: selectedRoom } : row)));
      showAlert("success", "Checked in successfully.");
    } catch (error) {
      showAlert("error", "Error checking in reservation.");
    } finally {
      setRoomDialogOpen(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      await axios.put(`${BASE_URL}/${selectedRowId}/check-out`);
      setRows(rows.map((row) => (row._id === selectedRowId ? { ...row, checkedOut: true } : row)));
      showAlert("success", "Checked out successfully.");
    } catch (error) {
      showAlert("error", "Error checking out reservation.");
    }
  };

  const createReservation = async (reservation) => {
    try {
      const response = await axios.post(`${BASE_URL}`, reservation);
      setRows([...rows, response.data.reservation]);
      setDialogOpen(false);
      showAlert("success", "Reservation created successfully.");
    } catch (error) {
      showAlert("error", error.response ? error.response.data : error.message);
      console.error('Error occurred:', error.response ? error.response.data : error.message);
      setDialogOpen(false);
    }
  };

  const cancelReservation = async (id) => {
    console.log("Attempting to cancel reservation with ID:", id);
    try {
      const response = await axios.put(`${BASE_URL}/${id}`);
      if (response.status === 200) {
        setRows(rows.map((row) => (row._id === id ? { ...row, cancelled: true } : row)));
        showAlert("success", "Reservation cancelled successfully.");
        console.log("Reservation cancelled successfully:", response.data);
      } else {
        throw new Error('Error cancelling reservation');
      }
    } catch (error) {
      showAlert("error", "Error cancelling reservation.");
      console.error("Error cancelling reservation:", error);
    }
  };
  
  // Determine if the Check-in and Check-out buttons should be enabled or disabled
  const selectedRow = rows.find(row => row._id === selectedRowId);
  const isCheckInDisabled = selectedRowId === null || selectedRow?.checkedIn;
  const isCheckOutDisabled = selectedRowId === null || !selectedRow?.checkedIn || selectedRow?.checkedOut;

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h3" sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
        Reservation List
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex">
          <Button
            variant="contained"
            sx={{ mr: 2, backgroundColor: theme => theme.palette.secondary.light }} 
            onClick={handleCheckIn}
            disabled={isCheckInDisabled}
          >
            Check-in
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: theme => theme.palette.secondary.light }} 
            onClick={handleCheckOut}
            disabled={isCheckOutDisabled}
          >
            Check-out
          </Button>
        </Box>
        <Box display="flex">
          <Button
            variant="contained"
            sx={{ mr: 2, backgroundColor: theme => theme.palette.secondary.light }} 
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
            sx={{ backgroundColor: theme => theme.palette.secondary.light }} 
            onClick={() => selectedRowId && cancelReservation(selectedRowId)}
          >
            Cancel Reservation
          </Button>
        </Box>
      </Box>
      <DataGrid
        rows={rowsWithIndex}
        columns={columns}
        disableSelectionOnClick
        autoHeight
        disableMultipleRowSelection
        onRowClick={handleRowClick}
        selectionModel={selectedRowId ? [rowsWithIndex.find(row => row._id === selectedRowId)?.id] : []}
        pagination
        paginationMode="server"
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20]}
        rowCount={totalRows}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        page={page}
      />

      {/* Room selection dialog */}
      <Dialog open={roomDialogOpen} onClose={() => setRoomDialogOpen(false)}>
        <DialogTitle>Select Room for Check-In</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>Select Room</MenuItem>
            {availableRooms.map((room) => (
              <MenuItem key={room._id} value={room._id}>{room.roomNumber}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <Button onClick={handleConfirmCheckIn} disabled={!selectedRoom}>Confirm</Button>
      </Dialog>

      {/* Snackbar for alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReservationList;
