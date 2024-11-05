import React, { useEffect, useState } from "react";
import FlexBetween from "components/Layout/FlexBetween";
import Header from "components/Layout/Header";
import { Box, Button, useTheme } from "@mui/material";
import { DownloadOutlined } from "@mui/icons-material";
import Charts from "./Charts";
import StatBox from "./StatBox";
import Report from "./Report";
import axios from "axios";

// Shared Styles for the Dashboard
const dashboardStyles = (theme) => ({
  container: {
    margin: "1.5rem 2.5rem",
  },
  button: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.text.primary,
    fontSize: "14px",
    fontWeight: "bold",
    padding: "10px 20px",
  },
  grid: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gap: "20px",
    [theme.breakpoints.up("lg")]: {
      gridTemplateColumns: "repeat(12, 1fr)", // Full grid on large screens
    },
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "repeat(8, 1fr)", // Medium screen adjustments
    },
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "repeat(2, 1fr)", // Small screen adjustments
    },
  },
  statBox: {
    gridColumn: {
      xs: "span 6", // Half width on extra small screens
      md: "span 3", // Quarter width on medium screens
      lg: "span 3", // Quarter width on large screens
    },
    backgroundColor: theme.palette.background.alt,
    width: "100%",
  },
  reportBox: {
    gridColumn: {
      xs: "span 12", // Full width on small screens
      md: "span 8",  // Two-thirds width on medium screens
      lg: "span 8",  // Two-thirds width on large screens
    },
    gridRow: "span 2", // Ensure the row spans correctly
    backgroundColor: theme.palette.background.alt,
    width: "100%",
  },
  chartBox: {
    gridColumn: {
      xs: "span 12", // Full width on small screens
      md: "span 4",  // One-third width on medium screens
      lg: "span 4",  // One-third width on large screens
    },
    gridRow: "span 2", // Ensure the row spans correctly
    backgroundColor: theme.palette.background.alt,
    width: "100%",
  },
});

const Dashboard = () => {
  const theme = useTheme();
  const styles = dashboardStyles(theme);

  // Dummy data for the charts
  const occupancyData = [
    { channel: "Website", count: 15 },
    { channel: "Walk-in", count: 10 },
    { channel: "Agoda.com", count: 22 },
    { channel: "Booking.com", count: 24 },
  ];

  const reservationsData = [
    { roomType: "Standard", count: 45 },
    { roomType: "Double", count: 20 },
    { roomType: "Double Deluxe", count: 3 },
    { roomType: "Deluxe", count: 3},
  ];

  const roomsData = [
    { status: "Occupied", count: 10 },
    { status: "Vacant", count: 8 },
    { status: "Dirty", count: 4 },
    { status: "Out of Order", count: 1 },
  ];

  const [currentOccupancy, setOccupancyData] = useState({
    occupancyPercentage: 0,
    totalRooms: 0,
    occupiedRooms: 0,
  });

  const [currentGuests, setCurrentGuests] = useState(0);
  const [expectedArrivals, setExpectedArrivals] = useState(0);
  const [expectedDepartures, setExpectedDepartures] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState([]);

  useEffect(() => {
    const fetchOccupancyData = async () => {
      try {
        const response = await axios.get("/api/dashboard/getOccupancy");
        setOccupancyData(response.data); 
      } catch (error) {
        console.error("Error fetching occupancy data:", error);
      }
    };

    const fetchCurrentGuests = async () => {
      try {
        const response = await axios.get("/api/dashboard/getCurrentGuests"); 
        setCurrentGuests(response.data); 
      } catch (error) {
        console.error("Error fetching current guests:", error);
      }
    };

    const fetchExpectedArrivals = async () => {
      try {
        const response = await axios.get("/api/dashboard/getArrivals");
        setExpectedArrivals(response.data.totalArrivals); 
      } catch (error) {
        console.error("Error fetching expected arrivals:", error);
      }
    };

    const fetchExpectedDepartures = async () => {
      try {
        const response = await axios.get("/api/dashboard/getDepartures");
        setExpectedDepartures(response.data.totalDepartures);
      } catch (error) {
        console.error("Error fetching expected departures:", error);
      }
    };

    const fetchDailyRevenue = async () => {
      try {
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString();

        const response = await axios.get(`http://localhost:5001/api/dashboard/getDailyRevenue`, {
          params: { startDate, endDate },
        });
        // Store the fetched data in state
        const formattedData = response.data.map((item) => ({
          date: item._id,
          revenue: item.totalRevenue,
        }));
        setDailyRevenue(formattedData);
      } catch (error) {
        console.error("Error fetching daily revenue:", error);
      }
    };

    fetchDailyRevenue();
    fetchExpectedDepartures();
    fetchExpectedArrivals();
    fetchCurrentGuests();
    fetchOccupancyData();
  }, []);

  return (
    <Box sx={styles.container}>
      <FlexBetween>
        <Header title="CASA HOTEL" />
        <Button sx={styles.button}>
          <DownloadOutlined sx={{ mr: "10px" }} />
          Download Reports
        </Button>
      </FlexBetween>
  
      <Box sx={styles.grid}>
        {/* StatBoxes with applied grid styling */}
        <Box sx={styles.statBox}>
          <StatBox
            title="Current Occupancy"
            value={`${currentOccupancy.occupancyPercentage}%`}
            unit={`Occupied Rooms: ${currentOccupancy.occupiedRooms}/${currentOccupancy.totalRooms}`}
          />
        </Box>
  
        <Box sx={styles.statBox}>
          <StatBox title="Current Guests" value={currentGuests.totalGuests} unit={`${currentGuests.totalAdults} Adults ${currentGuests.totalChildren} Children`} />
        </Box>
  
        <Box sx={styles.statBox}>
          <StatBox title="Expected Arrival" value={expectedArrivals} />
        </Box>
  
        <Box sx={styles.statBox}>
          <StatBox title="Expected Departure" value={expectedDepartures} />
        </Box>
  
        {/* Revenue Chart */}
        <Box sx={styles.reportBox}>
          <Report revenueData={dailyRevenue} />
        </Box>
  
        {/* Occupancy Chart */}
        <Box sx={styles.chartBox}>
          <Charts
            occupancyData={occupancyData}
            reservationsData={reservationsData}
            roomsData={roomsData}
            />
          </Box>
        </Box>
      </Box>
  );
  
};

export default Dashboard;
