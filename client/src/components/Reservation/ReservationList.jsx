import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Delete, Visibility, CheckCircle, Logout } from "@mui/icons-material";
import axios from "axios";
import dayjs from "dayjs";
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
  const [alert, setAlert] = useState({
    open: false,
    severity: "info",
    message: "",
  });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const today = dayjs().startOf("day");

  const rowsWithIndex = rows.map((row, index) => {
    const arrivalDate = new Date(row.arrivalDate);
    const leadTime = differenceInDays(arrivalDate, today.toDate());

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
    {
      field: "customerId",
      headerName: "Customer ID",
      width: 120,
      valueGetter: (params) => params.row.customerId.customerId,
    },
    {
      field: "leadTime",
      headerName: "Lead Time",
      width: 90,
      valueGetter: (params) => params.row.leadTime,
    },
    {
      field: "arrivalDate",
      headerName: "Arrival Date",
      width: 120,
      valueGetter: (params) =>
        format(new Date(params.row.arrivalDate), "yyyy-MM-dd"),
    },
    {
      field: "departureDate",
      headerName: "Departure Date",
      width: 120,
      valueGetter: (params) =>
        format(new Date(params.row.departureDate), "yyyy-MM-dd"),
    },
    { field: "daysOfStay", headerName: "Days of Stay", width: 80 },
    { field: "numAdults", headerName: "Adults", width: 80 },
    {
      field: "numChildren",
      headerName: "Children",
      width: 90,
      valueGetter: (params) => params.row.numChildren ?? 0,
    },
    {
      field: "roomType",
      headerName: "Room Type",
      width: 120,
      valueGetter: (params) => params.row.roomType.name,
    },
    {
      field: "roomNumber",
      headerName: "Room No.",
      width: 100,
      valueGetter: (params) => params.row.room?.roomNumber || "N/A",
    },
    {
      field: "totalPrice",
      headerName: "Total Price",
      width: 100,
      valueGetter: (params) =>
        params.row.roomType.price * params.row.daysOfStay,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-between" width="100%">
          <Tooltip title="Check-In">
            <span>
              <IconButton
                onClick={() => handleCheckIn(params.row)}
                disabled={
                  params.row.checkedIn ||
                  !dayjs(params.row.arrivalDate).isSame(today, "day")
                }
                sx={{
                  color: params.row.checkedIn ? "green" : "inherit",
                }}
              >
                <CheckCircle />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Check-Out">
            <span>
              <IconButton
                onClick={() => handleCheckOut(params.row)}
                disabled={!params.row.checkedIn || params.row.checkedOut}
                sx={{
                  color: params.row.checkedOut ? "red" : "inherit",
                }}
              >
                <Logout />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="View Details">
            <IconButton onClick={() => handleViewDetails(params.row)}>
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteReservation(params.row._id)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const fetchReservations = async (page, pageSize) => {
    try {
      const response = await axios.get(
        `${BASE_URL}?page=${page + 1}&limit=${pageSize}`,
        {
          withCredentials: true,
        }
      );
      setRows(response.data.reservations);
      setTotalRows(response.data.total);
    } catch (error) {
      showAlert("error", "Error fetching reservations.");
    }
  };

  const fetchAvailableRooms = async (roomTypeId) => {
    try {
      const response = await axios.get(
        `${ROOM_URL}/available?roomType=${roomTypeId}`
      );
      setAvailableRooms(response.data);
    } catch (error) {
      showAlert("error", "Error fetching available rooms.");
    }
  };

  const handleCheckIn = async (row) => {
    if (row.room) {
      // Directly check-in if a room is already assigned
      try {
        await axios.put(`${BASE_URL}/${row._id}/check-in`, {
          roomId: row.room._id,
        });
        setRows((prev) =>
          prev.map((r) => (r._id === row._id ? { ...r, checkedIn: true } : r))
        );
        showAlert("success", "Checked in successfully.");
      } catch (error) {
        showAlert("error", "Error during check-in.");
      }
    } else {
      // Open room selection dialog if no room is assigned
      try {
        await fetchAvailableRooms(row.roomType._id);
        setRoomDialogOpen(true);
        setSelectedRowId(row._id);
      } catch (error) {
        showAlert("error", "Error fetching available rooms for check-in.");
      }
    }
  };

  const handleConfirmCheckIn = async () => {
    if (!selectedRowId || !selectedRoom) return;

    try {
      await axios.put(`${BASE_URL}/${selectedRowId}/check-in`, {
        roomId: selectedRoom,
      });
      setRows((prev) =>
        prev.map((r) =>
          r._id === selectedRowId
            ? { ...r, checkedIn: true, room: { _id: selectedRoom } }
            : r
        )
      );
      setRoomDialogOpen(false);
      setSelectedRoom("");
      setSelectedRowId(null);
      showAlert("success", "Checked in successfully.");
    } catch (error) {
      showAlert("error", "Error during check-in.");
    }
  };

  const handleCheckOut = async (row) => {
    try {
      await axios.put(`${BASE_URL}/${row._id}/check-out`);
      setRows((prev) =>
        prev.map((r) => (r._id === row._id ? { ...r, checkedOut: true } : r))
      );
      showAlert("success", "Checked out successfully.");
    } catch (error) {
      showAlert("error", "Error checking out reservation.");
    }
  };

  const handleViewDetails = (row) => {
    showAlert("info", `Viewing details for reservation: ${row.reservationId}`);
  };

  const handleDeleteReservation = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setRows((prev) => prev.filter((row) => row._id !== id));
      showAlert("success", "Reservation deleted successfully.");
    } catch (error) {
      showAlert("error", "Error deleting reservation.");
    }
  };

  const createReservation = async (reservation) => {
    try {
      const response = await axios.post(`${BASE_URL}`, reservation);
      setRows((prevRows) => [response.data.reservation, ...prevRows]);
      setDialogOpen(false);
      showAlert("success", "Reservation created successfully.");
    } catch (error) {
      showAlert("error", "Error creating reservation.");
    }
  };

  useEffect(() => {
    fetchReservations(page, pageSize);
  }, [page, pageSize]);

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const handleCloseAlert = () => {
    setAlert({ open: false, severity: "info", message: "" });
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h3" mb={2}>
        Reservation List
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          variant="contained"
          sx={{
            mr: 2,
            backgroundColor: (theme) => theme.palette.secondary.light,
          }}
          onClick={() => setDialogOpen(true)}
        >
          Add Reservation
        </Button>
      </Box>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <AddReservationDialog
          onSubmit={createReservation}
          onCancel={() => setDialogOpen(false)}
        />
      </Dialog>
      <DataGrid
        rows={rowsWithIndex}
        columns={columns}
        disableSelectionOnClick
        autoHeight
        pagination
        paginationMode="server"
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20]}
        rowCount={totalRows}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        page={page}
      />

      {/* Room Selection Dialog */}
      <Dialog open={roomDialogOpen} onClose={() => setRoomDialogOpen(false)}>
        <DialogTitle>Select Room for Check-In</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Room
            </MenuItem>
            {availableRooms.map((room) => (
              <MenuItem key={room._id} value={room._id}>
                {room.roomNumber}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <Button onClick={handleConfirmCheckIn} disabled={!selectedRoom}>
          Confirm
        </Button>
      </Dialog>
      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
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
