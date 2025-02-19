import { createTheme } from "@mui/material/styles";

// Light Theme
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    primary: {
      main: "#1c9ee4",
    },
    secondary: {
      main: "#00A896",
    },
    text: {
      primary: "#1090d8",
      secondary: "#555555",
    },
    divider: "#DDDDDD",
    action: {
      active: "#1c9ee4",
      hover: "rgba(28,158,228,0.53)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          textTransform: "none",
          padding: "8px 16px",
          boxShadow: "0.2px 2px 5px 1px #063651",
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
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
