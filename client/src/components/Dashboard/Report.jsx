import React from "react";
import { Box, useTheme } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import FlexBetween from "../Layout/FlexBetween";

const Report = ({ revenueData }) => {
  const theme = useTheme();

  return (
    <Box
      backgroundColor={theme.palette.secondary.light}
      borderRadius="0.55rem"
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="2rem"
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)"
      border={`1px solid ${theme.palette.text.main}`}
    >
      <FlexBetween>
        <Box>
          <h2 style={{ margin: 0, color: theme.palette.grey.main }}>
            Revenue Report
          </h2>
        </Box>
      </FlexBetween>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart width={600} height={300} data={revenueData}>
          <XAxis
            dataKey="date"
            axisLine={{ stroke: theme.palette.text.primary }}
            tick={{ fill: theme.palette.text.primary }}
          />
          <YAxis
            axisLine={{ stroke: theme.palette.text.primary }}
            tick={{ fill: theme.palette.text.primary }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff",
              color: theme.palette.mode === "dark" ? "#fff" : "#000",
            }}
            itemStyle={{
              color: theme.palette.mode === "dark" ? "#fff" : "#000",
            }}
            labelFormatter={(label) =>
              `Date: ${new Date(label).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}`
            }
            formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={theme.palette.grey.main}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Report;
