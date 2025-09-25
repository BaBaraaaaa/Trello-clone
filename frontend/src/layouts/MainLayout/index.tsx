import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Header, Sidebar } from "./components";
import { useTheme } from "../../hooks/useTheme";
import { lightTheme, darkTheme } from "../../theme";

const drawerWidth = 240;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { darkMode } = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />

        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            width: "100%",
            backgroundColor: "background.paper",
            color: "text.primary",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { sm: "none" },
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 600,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
              }}
            >
              Trello Clone
            </Typography>

            {/* Header controls */}
            <Header />
          </Toolbar>
        </AppBar>
        <Sidebar
          darkMode={darkMode}
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          onDrawerToggle={handleDrawerToggle}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
            mt: { xs: "56px", sm: "64px" },
            minHeight: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
            backgroundColor: "background.default",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Full Screen Content */}
          <Box
            sx={{
              flex: 1,
              width: "100%",
              height: "100%",
              position: "relative",
              overflowY: "auto",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;
