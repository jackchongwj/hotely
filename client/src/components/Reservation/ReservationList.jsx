import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Button, Dialog } from "@mui/material";
import axios from "axios";
import AddReservationDialog from "./AddReservationDialog";

const ReservationList = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const rowsWithIndex = rows.map((row, index) => ({ ...row, id: index + 1 }));

  const columns = [
    { field: "id", headerName: "#", width: 50 },
    { field: "reservationId", headerName: "Reservation ID", width: 100 },
    { field: "customerId", headerName: "Customer ID", width: 120 },
    { field: "numAdults", headerName: "Adults", width: 80 },
    { field: "numChildren", headerName: "Children", width: 80 },
    { field: "daysOfStay", headerName: "Days of Stay", width: 80 },
    { field: "roomType", headerName: "Room Type", width: 120, valueGetter: (params) => params.row.roomType.name },
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
        const response = await axios.get("http://localhost:5001/api/reservation-list", {
          withCredentials: true, 
        });
        const filteredReservations = response.data.reservations.filter(
          (reservation) => !reservation.cancelled
        );
          console.log(filteredReservations)
        setRows(filteredReservations);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };
    fetchReservations();
  }, []);
  

  const handleRowClick = (params) => {
    setSelectedRow(params.row._id);
    console.log('Selected row ID:', params.row._id); // Add this line for debugging
  };

  const handleCheckIn = async (id) => {
    try {
      setRows(rows.map((row) => row._id === id ? { ...row, checkedIn: true } : row));
      const response = await axios.put(`http://localhost:5001/api/reservation-list/${id}/check-in`);
      if (response.status !== 200) {
        throw new Error('Error checking in');
      }
    } catch (error) {
      setRows(rows.map((row) => row._id === id ? { ...row, checkedIn: false } : row));
      console.log("Error checking in reservation:", error);
    }
  };

  const handleCheckOut = async (id) => {
    try {
      setRows(rows.map((row) => row._id === id ? { ...row, checkedOut: true } : row));
      const response = await axios.put(`http://localhost:5001/api/reservation-list/${id}/check-out`);
      if (response.status !== 200) {
        throw new Error('Error checking out');
      }
    } catch (error) {
      setRows(rows.map((row) => row._id === id ? { ...row, checkedOut: false } : row));
      console.log("Error checking out reservation:", error);
    }
  };

  const createReservation = async (reservation) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/reservation-list", reservation
      );
      setRows([...rows, response.data.reservation]);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error occurred:', error.response ? error.response.data : error.message);
      setDialogOpen(false);
    }
  };

  const cancelReservation = async (id) => {
    console.log("Attempting to cancel reservation with ID:", id);
    try {
      const response = await axios.put(`http://localhost:5001/api/reservation-list/${id}`);
      console.log("Reservation cancelled successfully:", response.data);
      if (response.status === 200) {
          setRows(rows.filter((row) => row._id !== id));
      }
  } catch (error) {
      console.log("Error cancelling reservation:", error);
  }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h3" sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
        Reservation List
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex">
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            onClick={() => selectedRow && handleCheckIn(selectedRow)}
          >
            Check-in
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => selectedRow && handleCheckOut(selectedRow)}
          >
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
            onClick={() => selectedRow && cancelReservation(selectedRow)} // Pass the selectedRow as ID
          >
            Delete Reservation
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
        selectionModel={selectedRow !== null ? [selectedRow] : []}
        pageSize={10}
      />
    </Box>
  );
};
export default ReservationList;
