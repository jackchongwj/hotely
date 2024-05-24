import React from "react";
import FlexBetween from "components/Layout/FlexBetween";
import Header from "components/Layout/Header";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Charts from "components/Dashboard/Charts";
import StatBox from "components/Layout/StatBox";
import Report from "components/Dashboard/Report";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  // Dummy data for the charts
  const occupancyData = [
    { channel: "Website", count: 15 },
    { channel: "Walk-in", count: 10 },
    { channel: "Agoda.com", count: 22 },
    { channel: "Booking.com", count: 24 },
  ];
  const reservationsData = [
    { roomType: "Standard", count: 45 },
    { roomType: "Deluxe", count: 20 },
    { roomType: "Suite", count: 3 },
  ];
  const roomsData = [
    { status: "Occupied", count: 10 },
    { status: "Vacant", count: 8 },
    { status: "Dirty", count: 4 },
    { status: "Out of Order", count: 1 },
  ];

  const revenueData = [
    { date: "2023-05-01", revenue: 1200 },
    { date: "2023-05-02", revenue: 1500 },
    { date: "2023-05-03", revenue: 1800 },
    { date: "2023-05-04", revenue: 2000 },
    { date: "2023-05-05", revenue: 2200 },
    { date: "2023-05-06", revenue: 2500 },
    { date: "2023-05-07", revenue: 2800 },
    { date: "2023-05-08", revenue: 3000 },
    { date: "2023-05-09", revenue: 3200 },
    { date: "2023-05-10", revenue: 3500 },
    { date: "2023-05-11", revenue: 3800 },
    { date: "2023-05-12", revenue: 4000 },
    { date: "2023-05-13", revenue: 4200 },
    { date: "2023-05-14", revenue: 4500 },
    { date: "2023-05-15", revenue: 4800 },
    { date: "2023-05-16", revenue: 5000 },
    { date: "2023-05-17", revenue: 5200 },
  ];

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <FlexBetween>
          <Header title="CASA HOTEL" />
          <Box>
            <Button
              sx={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.background.alt,
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              <DownloadOutlined sx={{ mr: "10px" }} />
              Download Reports
            </Button>
          </Box>
        </FlexBetween>
  
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridTemplateRows="auto auto"  // Define rows for better control over height
          gridAutoRows="minmax(100px, auto)"  // Controls the minimum and natural height of the rows not explicitly set
          gap="20px"
          sx={{
            "@media (max-width: 600px)": {  // Adjustments for small screens
              gridTemplateColumns: "repeat(2, 1fr)",  // 2x2 layout for stat boxes
            },
            "@media (min-width: 601px)": {  // Adjustments for medium and large screens
              gridTemplateColumns: "repeat(8, 1fr) 4fr",  // 8 columns for stat boxes and revenue, 4 for occupancy
            },
          }}
        >
          {/* StatBoxes (1x1 each on large screens, 2x2 on small) */}
          <StatBox title="Current Occupancy" value="75" sx={{ gridColumn: "span 2" }} />
          <StatBox title="Current Guests" value="122" sx={{ gridColumn: "span 2" }} />
          <StatBox title="Expected Arrival" value="24" sx={{ gridColumn: "span 2" }} />
          <StatBox title="Expected Departure" value="32" sx={{ gridColumn: "span 2" }} />
  
          {/* Revenue Chart */}
          <Box
            sx={{
              gridColumn: "1 / 9",  // Spans all columns under the stat boxes on large screens
              gridRow: "2",         // Ensure it's on the second row
              "@media (max-width: 600px)": {
                gridColumn: "1 / 3",  // Spans full width under stat boxes on small screens
                gridRow: "3",         // Changes to third row on small screens
              },
            }}
          >
            <Report revenueData={revenueData} sx={{ width: '100%', height: 'auto' }} />
          </Box>
  
          {/* Occupancy Chart */}
          <Box
            sx={{
              gridColumn: "9 / 13",  // Positioned to the right side across from the stat boxes and revenue chart on large screens
              gridRow: "1 / 3",      // Spans from the first to the second row, vertically aligned with stat and revenue boxes
              "@media (max-width: 600px)": {
                gridColumn: "1 / 3",  // Stacks under the revenue chart on small screens
                gridRow: "4",         // Positioned below revenue chart on small screens
              },
            }}
          >
            <Charts
              occupancyData={occupancyData}
              reservationsData={reservationsData}
              roomsData={roomsData}
              sx={{ width: '100%', height: 'auto' }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
  
};

export default Dashboard;
