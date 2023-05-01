import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import FlexBetween from "../components/FlexBetween";
import { DataGrid } from "@mui/x-data-grid";
import {
    Box,
    Button,
    Typography,
    useTheme,
    useMediaQuery,
  } from "@mui/material";

const ReservationList = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [ setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const numberOfColumns = 5; // define number of columns
  const numberOfRows = 4; // define number of rows

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
    },
    {
      field: "roomNumber",
      headerName: "Room Number",
      flex: 1,
    },
    {
        field: "checkInDate",
        headerName: "Check In",
        flex: 1,
    },
    {
        field: "checkOutDate",
        headerName: "Check Out",
        flex: 1,
    },
  ]
  
  const data = [
    { id: 1, name: 'John Doe', roomNumber: 101, checkInDate: '2023-05-01', checkOutDate: '2023-05-05' },
    { id: 2, name: 'Jane Smith', roomNumber: 102, checkInDate: '2023-05-02', checkOutDate: '2023-05-04' },
    { id: 3, name: 'Bob Johnson', roomNumber: 103, checkInDate: '2023-05-03', checkOutDate: '2023-05-06' },
    { id: 4, name: 'Alice Lee', roomNumber: 104, checkInDate: '2023-05-04', checkOutDate: '2023-05-08' },
  ];

//   useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch("/api/reservations"); // make API call to retrieve data
    //     const json = await response.json();
    //     setData(json);
    //     setLoading(false);
    //   } catch (error) {
    //     setError(error);
    //     setLoading(false);
    //   }
    // };
    // fetchData();
//   }, []);

//   if (loading) {
//     return <p>Loading data...</p>;
//   }

//   if (error) {
//     return <p>Error loading data: {error.message}</p>;
//   }

return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h4">Reservation List</Typography>
      <Box mt="40px" height="75vh">
        <DataGrid
        //   loading={isLoading || !data}
          getRowId={(row) => row.id}
          rows={data || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default ReservationList;