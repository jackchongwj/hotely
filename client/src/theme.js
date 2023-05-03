// color design tokens export
export const tokensDark = {
  grey: {
    0: "#ffffff", // manually adjusted
    10: "#f6f6f6", // manually adjusted
    50: "#f0f0f0", // manually adjusted
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#C4C4C4",
    500: "#8C8C8C",
    600: "#535353",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
    1000: "#000000", // manually adjusted
  },
  primary: {
    // blue
    100: "#1D77A5",
    200: "#2495d3",
    300: "#2db4ff",
    400: "#16638F",
    500: "#114a6a",
    600: "#0c354E", // manually adjusted
    700: "#141937",
    800: "#052136",
  },
  secondary: {
    100: "#f7fcff",
    200: "#eef9ff",
    300: "#e6f5ff",
    400: "#ddf2ff",
    500: "#d5efff",
    600: "#aabfcc",
    700: "#808f99",
    800: "#556066",
    900: "#2b3033",
  }
}

// function that reverses the color palette
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
