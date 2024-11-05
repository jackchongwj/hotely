import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "../Layout/FlexBetween";

// Shared Styles for StatBox
const statBoxStyles = (theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "1.25rem 2rem",
    flex: "1 1 100%",
    backgroundColor: theme.palette.secondary.light,
    borderRadius: "0.55rem",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    border: `1px solid ${theme.palette.text.main}`,
    height: "150px",
  },
  title: {
    color: theme.palette.secondary,
    fontSize: {
      xs: "14px",
      sm: "16px",
      md: "18px",
      lg: "20px",
    },
  },
  value: {
    color: theme.palette.secondary,
    fontWeight: 600,
    fontSize: {
      xs: "24px",
      sm: "28px",
      md: "32px",
      lg: "36px",
    },
  },
  unit: {
    color: theme.palette.secondary,
    fontStyle: "italic",
    fontSize: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
    },
  },
});

const StatBox = ({ title, value, unit }) => {
  const theme = useTheme();
  const styles = statBoxStyles(theme);

  return (
    <Box sx={styles.container}>
      <FlexBetween>
        <Typography variant="h6" sx={styles.title}>
          {title}
        </Typography>
      </FlexBetween>
      <Typography variant="h3" sx={styles.value}>
        {value}
      </Typography>
      <FlexBetween gap="1rem">
        <Typography variant="h5" sx={styles.unit}>
          {unit}
        </Typography>
      </FlexBetween>
    </Box>
  );
};

export default StatBox;
