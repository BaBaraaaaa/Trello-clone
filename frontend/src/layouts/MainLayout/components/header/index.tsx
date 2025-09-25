import { Brightness4, Person, Logout, Brightness7 } from "@mui/icons-material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../contexts";
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
        display: "flex",
        gap: { xs: 1, sm: 1.5 },
        alignItems: "center",
      }}
    >
      {/* Theme Toggle Button */}
      <IconButton
        onClick={toggleDarkMode}
        color="primary"
        sx={{
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 },
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            transform: "scale(1.05)",
          },
        }}
      >
        {darkMode ? (
          <Brightness7 sx={{ fontSize: { xs: 18, sm: 20 } }} />
        ) : (
          <Brightness4 sx={{ fontSize: { xs: 18, sm: 20 } }} />
        )}
      </IconButton>

      {/* User Menu */}
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 },
          padding: 0,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "secondary.main",
            transform: "scale(1.05)",
          },
        }}
      >
        <Avatar
          src={user?.avatar}
          alt={user?.name}
          sx={{
            width: { xs: 28, sm: 32 },
            height: { xs: 28, sm: 32 },
            fontSize: { xs: "12px", sm: "14px" },
            fontWeight: 600,
            bgcolor: "secondary.main",
          }}
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
          sx: {
            mt: 1.5,
            minWidth: 280,
            borderRadius: "12px",
            backgroundColor: darkMode ? "#22272b" : "#ffffff",
            border: darkMode
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: darkMode
              ? "0 12px 48px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)"
              : "0 12px 48px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        {/* User Info */}
        <Box
          sx={{
            p: 3,
            background: darkMode
              ? "linear-gradient(135deg, rgba(2, 106, 167, 0.2) 0%, rgba(90, 172, 68, 0.2) 100%)"
              : "linear-gradient(135deg, rgba(2, 106, 167, 0.1) 0%, rgba(90, 172, 68, 0.1) 100%)",
            borderRadius: "12px 12px 0 0",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={user?.avatar}
              alt={user?.name}
              sx={{
                width: 48,
                height: 48,
                border: "3px solid",
                borderColor: "primary.main",
                fontSize: "18px",
                fontWeight: 700,
                boxShadow: darkMode
                  ? "0 4px 12px rgba(2, 106, 167, 0.3)"
                  : "0 4px 12px rgba(2, 106, 167, 0.2)",
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  mb: 0.5,
                }}
                noWrap
              >
                {user?.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  opacity: 0.8,
                }}
                noWrap
              >
                {user?.email}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ opacity: darkMode ? 0.1 : 0.05 }} />

        {/* Menu Items */}
        <MenuItem
          component={Link}
          to="/profile"
          onClick={handleMenuClose}
          sx={{
            py: 1.5,
            px: 3,
            mx: 1,
            my: 0.5,
            borderRadius: "8px",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: darkMode
                ? "rgba(2, 106, 167, 0.15)"
                : "rgba(2, 106, 167, 0.08)",
              transform: "translateX(4px)",
            },
          }}
        >
          <Person
            sx={{
              mr: 2,
              color: "primary.main",
              fontSize: 20,
            }}
          />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Hồ sơ cá nhân
          </Typography>
        </MenuItem>

        <Divider sx={{ opacity: darkMode ? 0.1 : 0.05, mx: 1 }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 3,
            mx: 1,
            my: 0.5,
            borderRadius: "8px",
            color: "error.main",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: darkMode
                ? "rgba(235, 90, 70, 0.15)"
                : "rgba(235, 90, 70, 0.08)",
              transform: "translateX(4px)",
            },
          }}
        >
          <Logout
            sx={{
              mr: 2,
              fontSize: 20,
            }}
          />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Đăng xuất
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Header;
