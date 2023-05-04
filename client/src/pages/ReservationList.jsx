import React, { useState } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";


const ReservationList = () => {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (params) => {
    setSelectedRow(params.id);
  };

  const columns = [
    { field: "id", headerName: "#", width: 90 },
    { field: "reservationId", headerName: "Reservation ID", width: 150 },
    { field: "customerId", headerName: "Customer ID", width: 150 },
    { field: "numAdults", headerName: "Adults", width: 120 },
    { field: "numChildren", headerName: "Children", width: 120 },
    { field: "daysOfStay", headerName: "Days of Stay", width: 150 },
    { field: "roomType", headerName: "Room Type", width: 150 },
    { field: "arrivalDate", headerName: "Arrival Date", width: 150 },
    { field: "leadTime", headerName: "Lead Time", width: 120 },
    { field: "cancelled", headerName: "Cancelled", width: 120 },
    { field: "bookingChannel", headerName: "Booking Channel", width: 180 },
  ];

  const rows = [
    {
      id: 1,
      reservationId: "R001",
      customerId: "C001",
      numAdults: 2,
      numChildren: 1,
      daysOfStay: 4,
      roomType: "Deluxe",
      arrivalDate: "2023-05-01",
      leadTime: 14,
      cancelled: false,
      bookingChannel: "Expedia",
    },
    {
      id: 2,
      reservationId: "R002",
      customerId: "C002",
      numAdults: 1,
      numChildren: 0,
      daysOfStay: 2,
      roomType: "Standard",
      arrivalDate: "2023-05-02",
      leadTime: 7,
      cancelled: false,
      bookingChannel: "Booking.com",
    },
    {
      id: 3,
      reservationId: "R003",
      customerId: "C003",
      numAdults: 2,
      numChildren: 2,
      daysOfStay: 3,
      roomType: "Suite",
      arrivalDate: "2023-05-03",
      leadTime: 21,
      cancelled: true,
      bookingChannel: "Agoda",
    },
    {
      id: 4,
      reservationId: "R004",
      customerId: "C004",
      numAdults: 1,
      numChildren: 0,
      daysOfStay: 4,
      roomType: "Standard",
      arrivalDate: "2023-05-04",
      leadTime: 10,
      cancelled: false,
      bookingChannel: "Hotels.com",
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h3" sx={{ marginTop: "1rem", marginBottom: "1rem"}}>Reservation List</Typography>
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
            Add Reservation
          </Button>
          <Button variant="contained" color="primary" >
            Delete Reservation
          </Button>
        </Box>
      </Box>
      <Box style={{ height: "100%", width: "100%" }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          pageSize={5}
          onRowClick={handleRowClick}
          rowSelected={selectedRow !== null}
          disableMultipleRowSelection
          selectionModel={selectedRow !== null ? [selectedRow] : []}
        />
      </Box>
    </Box>
  )
  }
export default ReservationList;
