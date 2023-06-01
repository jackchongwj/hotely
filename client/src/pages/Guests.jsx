import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Box, Typography, Button, Dialog } from "@mui/material";
import AddGuestDialog from "components/AddGuestDialog";
import DeleteConfirmationDialog from "components/DeleteConfirmationDialog";

const Guests = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(null);
  const [rows, setRows] = useState([]);
  const rowsWithIndex = rows.map((row, index) => ({ ...row, id: index + 1 }));
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = React.useState(false);

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

  
  const confirmDelete = () => {
    if(selectedRow == null || selectedRow == undefined){
      return;
    }
    setDeleteConfirmationDialog(true);
  };

  const createGuest = async(guest) => {
    console.log("guest", guest);
    try {
      const token = localStorage.getItem("token"); // get the token from local storage
      const config = {
        headers: { Authorization: token }, // pass the token as a header
      };
      const response = await axios.post(
        "http://localhost:5001/api/guests", guest
      , config);
      rows.push(response.data.guest)
    } catch (error) {
      console.log(error);
    }
    setOpenAddDialog(false);
  }

    
  const deleteGuest = async (id) => {
    try {
      setDeleteConfirmationDialog(false);
      if(id == null || id == undefined){
        return;
      }
      const customerID = rows[id-1].customerId;
      await axios.delete(`http://localhost:5001/api/guests/${customerID}`);
      setRows(rows.filter((row) => row.id !== id));
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h3" sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
        Guests
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex">
          <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => setOpenAddDialog(true)}>
            Add Guest
          </Button>
          <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
            <AddGuestDialog
              onSubmit={createGuest}
              onCancel={() => setOpenAddDialog(false)}
            />
          </Dialog>
          <Button variant="contained" color="primary">
            Edit Guest
          </Button>
        </Box>
        <Box display="flex">
          <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={confirmDelete}>
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
      <DeleteConfirmationDialog
            selectedValue={selectedRow}
            open={deleteConfirmationDialog}
            onClose={deleteGuest}
          />
    </Box>
  );
};

export default Guests;
