import React from "react";
import { Box, useTheme } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import FlexBetween from "../Layout/FlexBetween";

const Report = ({ revenueData }) => {
  const theme = useTheme();

  return (
    <Box
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="2rem"
      padding="2rem"
    >
      <FlexBetween>
        <Box>
          <h2 style={{ margin: 0, color: theme.palette.grey.main }}>Revenue Report</h2>
        </Box>
      </FlexBetween>

      <LineChart width={600} height={300} data={revenueData}>
        <XAxis dataKey="month" axisLine={{ stroke: theme.palette.text.primary }} tick={{ fill: theme.palette.text.primary }} />
        <YAxis axisLine={{ stroke: theme.palette.text.primary }} tick={{ fill: theme.palette.text.primary }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={theme.palette.grey.main}
          strokeWidth={2}
        />
      </LineChart>
    </Box>
  );
};

export default Report;
