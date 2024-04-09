import React, { useState, useEffect } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Box, Typography, Button, Dialog } from "@mui/material";
import axios from "axios";
import AddReservationDialog from "./AddReservationDialog";

const ReservationList = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const rowsWithIndex = rows.map((row, index) => ({ ...row, id: index + 1 }));

  const columns = [
    { field: "id", headerName: "#", width: 90 },
    { field: "reservationId", headerName: "Reservation ID", width: 150 },
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
  }, []);

  const handleRowClick = (params) => {
    setSelectedRow(params.id);
  };

  const createReservation = async (reservation) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/reservation-list", reservation
      );
      setRows([...rows, response.data]);
    } catch (error) {
      console.log(error);
    }
    setDialogOpen(false);
  };

  const cancelReservation = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/reservation-list/${id}`);
      setRows(rows.filter((row) => row.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h3" sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
        Reservation List
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex">
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Check-in
          </Button>
          <Button variant="contained" color="primary">
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
            onClick={cancelReservation}
          >
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
    </Box>
  );
};
export default ReservationList;
