import React from "react";
import { Box, useTheme } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import FlexBetween from "./FlexBetween";

const Report = ({ revenueData }) => {
  const theme = useTheme();

  return (
    <Box
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
      boxShadow={theme.shadows[1]}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="2rem"
      padding="2rem"
    >
      <FlexBetween>
        <Box>
          <h2 style={{ margin: 0 }}>Revenue Report</h2>
        </Box>
      </FlexBetween>

      <LineChart width={600} height={300} data={revenueData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={theme.palette.primary.main}
          strokeWidth={2}
        />
      </LineChart>
    </Box>
  );
};

export default Report;