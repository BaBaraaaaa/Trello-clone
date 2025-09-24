import { createTheme, type ThemeOptions } from "@mui/material/styles";

// Màu sắc chung cho cả light và dark theme
const common = {
  primary: {
    main: "#026AA7", // xanh Trello chính
    light: "#4A90C2",
    dark: "#014F7B",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#5AAC44", // xanh lá của nút "Add card"
    light: "#7BC15A",
    dark: "#42833A",
    contrastText: "#ffffff",
  },
  info: {
    main: "#0079bf",
    light: "#4A9FDF",
    dark: "#005A8F",
    contrastText: "#ffffff",
  },
  success: {
    main: "#61bd4f",
    light: "#7FD46F",
    dark: "#4A8F3B",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#f2d600",
    light: "#F5E133",
    dark: "#BFA600",
    contrastText: "#172B4D",
  },
  error: {
    main: "#eb5a46",
    light: "#F07B6B",
    dark: "#B43E2F",
    contrastText: "#ffffff",
  },
};

// Màu sắc cho labels/tags
export const labelColors = {
  green: "#61bd4f",
  yellow: "#f2d600",
  orange: "#ff9f1a",
  red: "#eb5a46",
  purple: "#c377e0",
  blue: "#0079bf",
  sky: "#00c2e0",
  lime: "#51e898",
  pink: "#ff78cb",
  black: "#355263",
};

// Màu sắc bổ sung cho UI
export const uiColors = {
  border: {
    light: "#dfe1e6",
    dark: "#3c4043",
  },
  hover: {
    light: "#091e4208",
    dark: "#a6c5e229",
  },
  selected: {
    light: "#e4f0f6",
    dark: "#1c2b41",
  },
};

// Base theme options chung
const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, "Droid Sans", "Helvetica Neue", sans-serif',
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
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
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
          borderRadius: "8px",
          padding: "8px 16px",
          fontSize: "0.875rem",
          fontWeight: 500,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          fontSize: "0.75rem",
          height: "24px",
        },
      },
    },
  },
};

// Light Theme
export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: "light",
    ...common,
    background: {
      default: "#f4f5f7", // nền board chính
      paper: "#ffffff", // nền card, modal
    },
    text: {
      primary: "#172B4D", // text chính
      secondary: "#5E6C84", // text phụ
      disabled: "#A5ADBA", // text disabled
    },
    divider: uiColors.border.light,
    action: {
      hover: uiColors.hover.light,
      selected: uiColors.selected.light,
      disabled: "#F4F5F7",
      disabledBackground: "#F4F5F7",
    },
    grey: {
      50: "#f4f5f7",
      100: "#ebecf0",
      200: "#dfe1e6",
      300: "#c1c7d0",
      400: "#a5adba",
      500: "#8993a4",
      600: "#6b778c",
      700: "#5e6c84",
      800: "#42526e",
      900: "#253858",
    },
  },
  components: {
    ...baseThemeOptions.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#026AA7",
          color: "#ffffff",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          borderRight: `1px solid ${uiColors.border.light}`,
        },
      },
    },
  },
});

// Dark Theme
export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: "dark",
    ...common,
    background: {
      default: "#1d2125", // nền board tối
      paper: "#22272b", // nền card, modal tối
    },
    text: {
      primary: "#ffffff", // text chính trắng
      secondary: "#B6C2CF", // text phụ xám nhạt
      disabled: "#6B778C", // text disabled
    },
    divider: uiColors.border.dark,
    action: {
      hover: uiColors.hover.dark,
      selected: uiColors.selected.dark,
      disabled: "#3C4043",
      disabledBackground: "#3C4043",
    },
    grey: {
      50: "#42526e",
      100: "#3c4043",
      200: "#353c40",
      300: "#2c3336",
      400: "#22272b",
      500: "#1d2125",
      600: "#172b4d",
      700: "#091e42",
      800: "#0c1116",
      900: "#000000",
    },
  },
  components: {
    ...baseThemeOptions.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1d2125",
          color: "#ffffff",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#22272b",
          borderRight: `1px solid ${uiColors.border.dark}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#22272b",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)",
          },
        },
      },
    },
  },
});
