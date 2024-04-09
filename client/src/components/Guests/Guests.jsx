import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Box, Typography, Button } from "@mui/material";

const Guests = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const rowsWithIndex = rows.map((row, index) => ({ ...row, id: index + 1 }));

  const columns = [
    { field: "id", headerName: "#", width: 90 },
    { field: "customerId", headerName: "Customer ID", width: 120 },
    { field: "firstName", headerName: "First Name", width: 120 },
    { field: "lastName", headerName: "Last Name", width: 120 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "email", headerName: "Email", width: 180 },
    { field: "identification", headerName: "ID Number", width: 120 },
    { field: "dateOfBirth", headerName: "DOB", width: 120 },
    { field: "nationality", headerName: "Nationality", width: 120 },
    { field: "address", headerName: "Address", width: 300 },
  ];

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const token = localStorage.getItem("token"); // get the token from local storage
        const config = {
          headers: { Authorization: token }, // pass the token as a header
        };
        const response = await axios.get(
          "http://localhost:5001/api/guests",
          config
        );
        console.log(response)
        setRows(response.data.guests);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGuests();
  }, []);

  const handleRowClick = (params) => {
    setSelectedRow(params.id);
  };

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
    </Box>
  );
};

export default Guests;
