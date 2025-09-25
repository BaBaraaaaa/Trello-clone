import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Toolbar,
  ListItemButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  darkMode: boolean;
  drawerWidth: number;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  darkMode,
  drawerWidth,
  mobileOpen,
  onDrawerToggle,
}) => {
  const location = useLocation();

  // Navigation items with routes (3 main sections)
  const navigationItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/",
      description: "Tổng quan và thống kê",
    },
    {
      text: "Boards",
      icon: <ViewKanbanIcon />,
      path: "/board",
      description: "Quản lý dự án Kanban",
    },
    {
      text: "Hồ sơ",
      icon: <AccountCircleIcon />,
      path: "/profile",
      description: "Thông tin cá nhân",
    },
  ];

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(
                      item.path.split("/")[1]
                        ? `/${item.path.split("/")[1]}`
                        : item.path
                    )
              }
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                minHeight: 48,
                "&.Mui-selected": {
                  backgroundColor: darkMode
                    ? "rgba(2, 106, 167, 0.2)"
                    : "rgba(2, 106, 167, 0.1)",
                  "&:hover": {
                    backgroundColor: darkMode
                      ? "rgba(2, 106, 167, 0.3)"
                      : "rgba(2, 106, 167, 0.15)",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "primary.main",
                  },
                  "& .MuiListItemText-primary": {
                    color: "primary.main",
                    fontWeight: 600,
                  },
                },
                "&:hover": {
                  backgroundColor: darkMode
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                secondary={item.description}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  },
                  "& .MuiListItemText-secondary": {
                    fontSize: "0.75rem",
                    opacity: 0.7,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="navigation menu"
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          zIndex: (theme) => theme.zIndex.drawer,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            zIndex: (theme) => theme.zIndex.drawer,
            marginTop: "56px", // Height of AppBar on mobile
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "none",
            backgroundColor: "background.paper",
            borderRadius: "0 16px 16px 0",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 2px 8px",
            marginTop: "64px", // Height of AppBar
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;