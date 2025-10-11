import { createTheme } from "@mui/material/styles";

// Vietnamese color palette inspired by Vietnamese culture
const vietnameseColors = {
  red: "#DA020E", // Vietnamese flag red
  gold: "#FFCD00", // Vietnamese flag gold
  green: "#228B22", // Vietnamese nature green
  blue: "#0066CC", // Vietnamese sky blue
  brown: "#8B4513", // Vietnamese earth brown
};

// Create main theme
const createMIATheme = (isDarkMode = false) => {
  const baseTheme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#1976d2",
        light: "#42a5f5",
        dark: "#1565c0",
        contrastText: "#ffffff",
      },
      secondary: {
        main: vietnameseColors.gold,
        light: "#fff350",
        dark: "#c9b037",
        contrastText: "#000000",
      },
      error: {
        main: vietnameseColors.red,
        light: "#ff5983",
        dark: "#a7001a",
      },
      warning: {
        main: "#ff9800",
        light: "#ffb74d",
        dark: "#f57c00",
      },
      info: {
        main: vietnameseColors.blue,
        light: "#4fc3f7",
        dark: "#0277bd",
      },
      success: {
        main: vietnameseColors.green,
        light: "#81c784",
        dark: "#388e3c",
      },
      background: {
        default: isDarkMode ? "#121212" : "#f5f5f5",
        paper: isDarkMode ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: isDarkMode ? "#ffffff" : "#212121",
        secondary: isDarkMode ? "#aaaaaa" : "#757575",
      },
      divider: isDarkMode ? "#333333" : "#e0e0e0",
      // Custom colors for logistics
      logistics: {
        transport: "#2196f3",
        warehouse: "#4caf50",
        staff: "#ff9800",
        partner: "#9c27b0",
        urgent: vietnameseColors.red,
        completed: vietnameseColors.green,
        pending: "#ffc107",
        cancelled: "#757575",
      },
    },
    typography: {
      fontFamily: [
        "Roboto",
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),
      h1: {
        fontSize: "2.5rem",
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 500,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 500,
        lineHeight: 1.6,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.5,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.43,
      },
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
      caption: {
        fontSize: "0.75rem",
        lineHeight: 1.66,
      },
      overline: {
        fontSize: "0.75rem",
        fontWeight: 400,
        letterSpacing: "0.08333em",
        lineHeight: 2.66,
        textTransform: "uppercase",
      },
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 500,
            padding: "8px 16px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
            },
          },
          containedPrimary: {
            background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isDarkMode
              ? "0 4px 8px rgba(0,0,0,0.3)"
              : "0 2px 8px rgba(0,0,0,0.1)",
            border: isDarkMode ? "1px solid #333" : "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
          elevation1: {
            boxShadow: isDarkMode
              ? "0 2px 4px rgba(0,0,0,0.3)"
              : "0 1px 3px rgba(0,0,0,0.12)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: isDarkMode ? "1px solid #333" : "1px solid #e0e0e0",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: isDarkMode
              ? "0 2px 4px rgba(0,0,0,0.3)"
              : "0 1px 3px rgba(0,0,0,0.12)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            fontWeight: 500,
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: "none",
            borderRadius: 8,
            "& .MuiDataGrid-cell": {
              borderColor: isDarkMode ? "#333" : "#e0e0e0",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: isDarkMode ? "#333" : "#f5f5f5",
              borderColor: isDarkMode ? "#333" : "#e0e0e0",
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 48,
          },
          indicator: {
            height: 3,
            borderRadius: "3px 3px 0 0",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            minHeight: 48,
          },
        },
      },
    },
  });

  // Add custom breakpoints for responsive design
  baseTheme.breakpoints.values = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  };

  return baseTheme;
};

export default createMIATheme;
