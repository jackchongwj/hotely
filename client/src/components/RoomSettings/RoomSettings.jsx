import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Button, Dialog } from "@mui/material";
import axios from "axios";
import AddRoomDialog from "./AddRoomTypeDialog";

const RoomSettings = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const roomTypesWithIndex = roomTypes.map((roomType, index) => ({ ...roomType, id: index + 1 }));

  const columns = [
    { field: "id", headerName: "#", width: 90 },
    { field: "name", headerName: "Room Type", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "price", headerName: "Price", width: 90 },
  ];

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/room-detail");
        setRoomTypes(response.data.roomDetails);
      } catch (error) {
        console.error('Error fetching room types:', error);
      }
    };
    fetchRoomTypes();
  }, []);

  const handleRowClick = (params) => {
    setSelectedRow(params.row._id);
  };

  const addRoomType = async (roomType) => {
    try {
      const response = await axios.post("http://localhost:5001/api/room-detail", roomType);
      setRoomTypes([...roomTypes, response.data]);
    } catch (error) {
      console.error("Error adding room type:", error);
    }
    setDialogOpen(false);
  };

  const deleteRoomType = async (id) => {
    console.log("Attempting to delete room type with ID:", id);
    try {
      await axios.delete(`http://localhost:5001/api/room-detail/${id}`);
      setRoomTypes(roomTypes.filter((roomType) => roomType._id !== id));
    } catch (error) {
      console.error("Error deleting room type:", error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h3" sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
        Room Types
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex">
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Edit
          </Button>
          <Button variant="contained" color="primary">
            Delete
          </Button>
        </Box>
        <Box display="flex">
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            onClick={() => setDialogOpen(true)}
          >
            Add Room Type
          </Button>
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <AddRoomDialog
              onSubmit={addRoomType}
              onCancel={() => setDialogOpen(false)}
            />
          </Dialog>
          <Button
            variant="contained"
            color="primary"
            onClick={() => selectedRow && deleteRoomType(selectedRow)} // Pass the selectedRow as ID
          >
            Delete Room Type
          </Button>
        </Box>
      </Box>
      <DataGrid
        rows={roomTypesWithIndex}
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

export default RoomSettings;
