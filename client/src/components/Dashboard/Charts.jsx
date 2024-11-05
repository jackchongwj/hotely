import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import FlexBetween from "../Layout/FlexBetween";

const Charts = ({ occupancyData, reservationsData, roomsData }) => {
  const theme = useTheme();

  // Colors to use for the pie charts
  const colors = [
    theme.palette.accent.orange,
    theme.palette.accent.red,
    theme.palette.accent.lightblue,
    theme.palette.accent.yellow,
    theme.palette.accent.darkred,
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      borderRadius="0.55rem"
      backgroundColor={theme.palette.secondary.light}
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)"
      border={`1px solid ${theme.palette.text.main}`}
    >
      <Typography
        variant="h2"
        sx={{ gridColumn: "span 4", marginTop: 3, marginBottom: 3 }}
      >
        {new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </Typography>

      <FlexBetween sx={{ width: "100%", marginLeft: 8 }}>
        <Typography variant="h3">Occupancies</Typography>
      </FlexBetween>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart width={300} height={300}>
          <Pie
            data={occupancyData}
            dataKey="count"
            nameKey="channel"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
          >
            {occupancyData.map((entry, index) => (
              <Cell key={entry.channel} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ marginBottom: "20px" }} />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <FlexBetween sx={{ width: "100%", marginLeft: 8 }}>
        <Typography variant="h3">Reservations</Typography>
      </FlexBetween>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart width={300} height={300}>
          <Pie
            data={reservationsData}
            dataKey="count"
            nameKey="roomType"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
          >
            {reservationsData.map((entry, index) => (
              <Cell key={entry.roomType} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ marginBottom: "20px" }} />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <FlexBetween sx={{ width: "100%", marginLeft: 8 }}>
        <Typography variant="h3">Rooms</Typography>
      </FlexBetween>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart width={300} height={300}>
          <Pie
            data={roomsData}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
          >
            {roomsData.map((entry, index) => (
              <Cell key={entry.status} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ marginBottom: "20px" }} />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Charts;
