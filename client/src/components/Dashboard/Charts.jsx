import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";
import FlexBetween from "../Layout/FlexBetween";

const Charts = ({ occupancyData, reservationsData, roomsData }) => {
  const theme = useTheme();

  // Colors to use for the pie charts
const colors = ["red", "green", "blue", "yellow", "grey"];

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      borderRadius="0.55rem"
      backgroundColor={theme.palette.background.alt}
    >
      <Typography variant="h2" sx={{ gridColumn: "span 4", marginTop: 3, marginBottom: 3 }}>
        {new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </Typography>

      <FlexBetween sx={{ width: "100%", marginLeft: 8 }}>
        <Typography variant="h3">
          Occupancies
        </Typography>
      </FlexBetween>
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
        <Legend verticalAlign="bottom" iconType="circle" />
        <Tooltip />
      </PieChart>

      <FlexBetween sx={{ width: "100%", marginLeft: 8 }}>
        <Typography variant="h3">
          Reservations
        </Typography>
      </FlexBetween>
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
        <Legend verticalAlign="bottom" iconType="circle" />
        <Tooltip />
      </PieChart>

      <FlexBetween sx={{ width: "100%", marginLeft: 8 }}>
        <Typography variant="h3">
          Rooms
        </Typography>
      </FlexBetween>
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
        <Legend verticalAlign="bottom" iconType="circle" />
        <Tooltip />
      </PieChart>
    </Box>
  );
};

export default Charts;