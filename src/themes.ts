import { createTheme } from "@mui/material/styles";

// Light Theme
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f5f7fb",
      paper: "#ffffff",
    },
    primary: {
      main: "rgb(31,172,220)",
    },
    secondary: {
      main: "#2196f3",
    },
    text: {
      primary: "rgba(8,73,108,0.73)",
      secondary: "#757575",
    },
    divider: "#E0E0E0",
    action: {
      active: "rgba(39,134,175,0.86)",
      hover: "rgba(156, 39, 176, 0.1)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
          padding: "10px 20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "rgba(26,132,179,0.94)",
          color: "#fff",
          "&:hover": {
            backgroundColor: "rgba(31,97,162,0.87)",
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          padding: "10px 12px",
          backgroundColor: "#fff",
          border: "1px solid #E0E0E0",
          "&:focus": {
            borderColor: "rgba(39,119,176,0.81)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px", // Rounded corners for cards
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)", // Subtle shadow for cards
          backgroundColor: "#ffffff", // Clean white background for card content
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontWeight: 600,
          color: "#063149", // Dark text for headings (ensures legibility)
        },
        h2: {
          fontWeight: 500,
          color: "rgba(13,110,166,0.78)", // Slightly lighter but still dark text for h2
        },
        h3: {
          fontWeight: 400,
          color: "#701313", // Neutral dark color for h3
        },
        body1: {
          fontSize: "1rem",
          color: "#032c43", // Standard dark text for body
        },
      },
    },
  },
});

// Dark Theme
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#010e19",
      paper: "#010e19",
    },
    primary: {
      main: "#dfaa15",
    },
    secondary: {
      main: "#500f0f",
    },
    text: {
      primary: "#e4c780",
      secondary: "#B0BEC5",
    },
    divider: "#e8a708",
    action: {
      active: "#e8a708",
      hover: "#977108",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          textTransform: "none",
          padding: "8px 16px",
          boxShadow: "0.2px 2px 5px 1px #715307",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          textTransform: "none",
          padding: "5px",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "input:-webkit-autofill": {
          "-webkit-box-shadow": "0 0 0 100px #ffffff inset",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontWeight: 600,
        },
        h2: {
          fontWeight: 500,
        },
        h3: {
          fontWeight: 400,
        },
        body1: {
          fontSize: "1rem",
        },
      },
    },
  },
});
