// color design tokens export
export const tokensDark = {
  grey: {
    0: "#fafafa", // light accent for dark mode
    100: "#e0e0e0",
    200: "#ced4da",
    300: "#adb5bd",
    400: "#6c757d",
    500: "#495057",
    600: "#343a40",
    700: "#22272B", // dark sidebar color
  },
  primary: {
    100: "#a9e3ff",
    200: "#86c1f3",
    300: "#64a0d0",
    400: "#4181af",
    500: "#16638F", // dark mode main background
    600: "#004973",
    700: "#003e66", // deeper blue
  },
  secondary: {
    100: "#f7fcff",
    300: "#e6f5ff",
    500: "#FAFAFA", // accent color for dark mode (white)
    600: "#aabfcc",
    700: "#808f99",
    800: "#556066",
  },
};

function reverseTokens(tokensDark) {
  const reversedTokens = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}
export const tokensLight = reverseTokens(tokensDark);

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[400],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[300],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.primary[600],
              alt: tokensDark.primary[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.grey[50],
              light: tokensDark.grey[100],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[700],
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[0],
              alt: tokensDark.grey[50],
            },
          }),
    },
    typography: {
      fontFamily: ["Barlow", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Barlow", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Barlow", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Barlow", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Barlow", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Barlow", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Barlow", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
