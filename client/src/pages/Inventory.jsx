import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Box, Typography, Button, Dialog } from "@mui/material";
import AddInventoryDialog from "components/AddInventoryDialog";
import DeleteConfirmationDialog from "components/DeleteConfirmationDialog";

const Inventory = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(null);
  const [rows, setRows] = useState([]);
  const rowsWithIndex = rows.map((row, index) => ({ ...row, id: index + 1 }));
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = React.useState(false);

  const columns = [
    { field: "id", headerName: "#", width: 90 },
    { field: "code", headerName: "Stock Code", width: 150 },
    { field: "name", headerName: "Stock Name", width: 200 },
    { field: "description", headerName: "Stock Description", width: 250 },
    { field: "type", headerName: "Stock Type", width: 150 },
    { field: "amount", headerName: "Stock Amount", width: 150 },
    { field: "price", headerName: "Price", width: 120, valueFormatter: ({ value }) => `$${value.toFixed(2)}` },
  ];

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const token = localStorage.getItem("token"); // get the token from local storage
        const config = {
          headers: { Authorization: token }, // pass the token as a header
        };
        const response = await axios.get(
          "http://localhost:5001/api/inventory",
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


  const createInventory = async (inventory) => {
    console.log("inventory", inventory);
    try {
      const token = localStorage.getItem("token"); // get the token from local storage
      const config = {
        headers: { Authorization: token }, // pass the token as a header
      };
      const response = await axios.post(
        "http://localhost:5001/api/inventory", inventory , config);
      rows.push(response.data.inventory)
    } catch (error) {
      console.log(error);
    }
    setOpenAddDialog(false);
  }

  const confirmDelete = () => {
    if(selectedRow == null || selectedRow == undefined){
      return;
    }
    setDeleteConfirmationDialog(true);
  };

  const deleteInventory = async (id) => {
    try {
      setDeleteConfirmationDialog(false);
      if(id == null || id == undefined){
        return;
      }
      const inventoryCode = rows[id-1].code;
      await axios.delete(`http://localhost:5001/api/inventory/${inventoryCode}`);
      setRows(rows.filter((row) => row.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem" >
      <Typography variant="h3" sx={{ marginTop: "1rem", marginBottom: "1rem" }}>Inventory</Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex">
          <Button variant="contained" color="primary" sx={{ mr: 2 }}  onClick={() => setOpenAddDialog(true)}>
            Add Item
          </Button>
          <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
            <AddInventoryDialog
              onSubmit={createInventory}
              onCancel={() => setOpenAddDialog(false)}
            />
          </Dialog>
          <Button variant="contained" color="primary">
            Edit Item
          </Button>
        </Box>
        <Box display="flex">
          <Button variant="contained" color="secondary" sx={{ mr: 2 }} onClick={confirmDelete}>
            Delete Selected
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
            onClose={deleteInventory}
          />
    </Box>
  );
};

export default Inventory;