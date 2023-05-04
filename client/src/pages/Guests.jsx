import React, { useState } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Box, Typography, Button } from "@mui/material";

const Guests = () => {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (params) => {
    setSelectedRow(params.id);
  };

  const columns = [
    { field: "id", headerName: "#", width: 90 },
    { field: "customerId", headerName: "Customer ID", width: 150 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "email", headerName: "Email", width: 180 },
    { field: "idNumber", headerName: "ID Number", width: 150 },
    { field: "age", headerName: "Age", width: 120 },
    { field: "nationality", headerName: "Nationality", width: 150 },
    { field: "address", headerName: "Address", width: 300 },
  ];

  const rows = [
    {
      id: 1,
      customerId: "C001",
      firstName: "John",
      lastName: "Doe",
      phone: "+1 555-555-1234",
      email: "johndoe@example.com",
      idNumber: "123456789",
      age: 35,
      nationality: "American",
      address: "123 Main St, Anytown, USA",
    },
    {
      id: 2,
      customerId: "C002",
      firstName: "Jane",
      lastName: "Doe",
      phone: "+1 555-555-5678",
      email: "janedoe@example.com",
      idNumber: "987654321",
      age: 30,
      nationality: "Canadian",
      address: "456 Maple Ave, Somewhere, Canada",
    },
    {
      id: 3,
      customerId: "C003",
      firstName: "Bob",
      lastName: "Smith",
      phone: "+44 1234 567890",
      email: "bobsmith@example.com",
      idNumber: "ABC123",
      age: 45,
      nationality: "British",
      address: "789 High St, London, UK",
    },
    {
      id: 4,
      customerId: "C004",
      firstName: "Alice",
      lastName: "Jones",
      phone: "+61 2 1234 5678",
      email: "alicejones@example.com",
      idNumber: "XYZ789",
      age: 28,
      nationality: "Australian",
      address: "12 George St, Sydney, Australia",
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h3" sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
        Guests
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex">
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Add Guest
          </Button>
          <Button variant="contained" color="primary">
            Edit Guest
          </Button>
        </Box>
        <Box display="flex">
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Delete Guest
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
  );
};

export default Guests;
