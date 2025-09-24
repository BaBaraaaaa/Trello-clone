import {
  Brightness4,
  Person,
  Logout,
  Brightness7,
} from "@mui/icons-material";
import React, { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { useTheme } from "../../../../hooks/useTheme";
import {
  Box,
  IconButton,
  Avatar,
  Stack,
  Typography,
  Divider,
  MenuItem,
  Menu,
} from "@mui/material";


const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };
  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1300,
        display: "flex",
        gap: 1,
      }}
    >
        {/* Theme Toggle Button */}
        <IconButton
          onClick={toggleDarkMode}
          color="primary"
          sx={{
            backgroundColor: "background.paper",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "background.paper",
              boxShadow: 4,
            },
          }}
        >
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        {/* User Menu */}
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            backgroundColor: "background.paper",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "background.paper",
              boxShadow: 4,
            },
          }}
        >
          <Avatar
            src={user?.avatar}
            alt={user?.name}
            sx={{ width: 32, height: 32 }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        {/* User Menu Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: { mt: 1, minWidth: 200 },
          }}
        >
          {/* User Info */}
          <Box sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={user?.avatar} alt={user?.name}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" noWrap>
                  {user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {user?.email}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Menu Items */}
          <MenuItem onClick={handleMenuClose}>
            <Person sx={{ mr: 2 }} />
            Hồ sơ
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <Logout sx={{ mr: 2 }} />
            Đăng xuất
          </MenuItem>
        </Menu>
      </Box>
  );
};

export default Header;
