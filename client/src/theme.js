import { createTheme } from "@mui/material/styles";

// Color design tokens
export const tokens = {
  light: {
    primary: "#38B6FF",
    secondary: "#E5E4E2",
    grey: "#e2e2e2",
    background: "#D3D3D3",
    textPrimary: "#292929",
    textSecondary: "#808080",
    accentColors: {
      orange: "#d67000",
      red: "#c04132",
      lightblue: "#2c7d9c",
      yellow: "#d1a000",
      darkred: "#8c0f16",
    },
  },
  dark: {
    primary: "#16638F",
    secondary: "#1c2a38",
    grey: "#1b262d",
    background: "#15202B",
    textPrimary: "#ffffff",
    textSecondary: "#b0b0b0",
    accentColors: {
      orange: "#ff9425",
      red: "#e56a54",
      lightblue: "#bbdde6",
      yellow: "#fdd26e",
      darkred: "#af272f",
    },
  },
};

// Function to get the light/dark theme settings
export const themeSettings = (mode) => {
  const colors = tokens[mode]; // Use tokens based on mode (light/dark)

  return createTheme({
    palette: {
      mode: mode,
      primary: {
        main: colors.primary, // Primary color (blue)
      },
      secondary: {
        main: colors.secondary, // Secondary color (background color)
        grey: colors.grey, // Grey color (background)
      },
      background: {
        default: colors.background, // Main background
      },
      text: {
        primary: colors.textPrimary, // Main text color
        secondary: colors.textSecondary, // Sidebar or secondary text color
      },
      accent: colors.accentColors,
    },
    breakpoints: {
      values: {
        xs: 0,   // Mobile screens
        sm: 600, // Small screens
        md: 960, // Medium screens
        lg: 1280,// Large screens
        xl: 1920,// Extra-large screens
      },
    },
    typography: {
      fontFamily: ["Lato", "Manrope", "sans-serif"].join(","), // Fonts from your provided CSS
      fontSize: 14,
      h1: {
        fontSize: 32,
        fontWeight: 700,
      },
      h2: {
        fontSize: 28,
        fontWeight: 600,
      },
      h3: {
        fontSize: 24,
        fontWeight: 500,
      },
      button: {
        textTransform: "none", // Disable text uppercase transformation for buttons
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: colors.accent, // Set accent color for buttons
            color: colors.textPrimary, // Text color on buttons
            "&:hover": {
              backgroundColor: colors.primary, // Hover effect with primary color
            },
          },
        },
      },
    },
  });
};

