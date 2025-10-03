/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useGetBoardsQuery } from "../../services/api/apiSlice";
import BoardCard from "./components/BoardCard";
import CreateBoardModal from "./components/CreateBoardModal";
import StatCard from "./components/StatCard";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Folder as FolderIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: boards = [], isLoading, isError } = useGetBoardsQuery();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const handleCloseCreateModal = useCallback(
    () => setIsCreateModalOpen(false),
    []
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recentActivities: any[] = [];

  const handleCreateBoard = useCallback((title: string) => {
    // TODO: replace with real create logic
    console.log("Create new board:", title);
    setIsCreateModalOpen(false);
  }, []);

  const handleBoardClick = useCallback((boardId: string) => {
    console.log("Board clicked:", boardId);
    navigate(`/board/${boardId}`);
  }, [navigate]);
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBoard(null);
  };

  // Statistics
  const totalBoards = boards.length;

  const totalTasks = 0; // Placeholder
  const completedTasks = 0; // Placeholder
  const overallProgress = totalBoards ? 0 : 0;
  const createNewBoard = () => setIsCreateModalOpen(true);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
      }}
    >
      {/* Header Section - Fixed */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(15, 23, 42, 0.95)"
              : "rgba(248, 250, 252, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: "divider",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={1}
          sx={{
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #60a5fa 0%, #34d399 50%, #f472b6 100%)"
                : "linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome back, {user?.fullName}! 👋
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            opacity: 0.8,
          }}
        >
          Here's what's happening with your projects today.
        </Typography>
      </Box>

      {/* Content Scrollable Area */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
          "&::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {/* Statistics Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: { xs: 2, sm: 3 },
            mb: { xs: 3, sm: 4 },
          }}
        >
          <StatCard
            title="Active Boards"
            value={totalBoards}
            icon={<FolderIcon />}
            color="primary"
          />
          <StatCard
            title="Total Tasks"
            value={totalTasks}
            icon={<AssignmentIcon />}
            color="secondary"
          />
          <StatCard
            title="Completed"
            value={completedTasks}
            icon={<CheckCircleIcon />}
            color="success"
          />
          <StatCard
            title="Progress"
            value={`${Math.round(overallProgress)}%`}
            icon={<TrendingUpIcon />}
            color="info"
          />
        </Box>
        {/* Main Content Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: { xs: 3, sm: 4 },
            alignItems: "start",
          }}
        >
          {/* Boards Section */}
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: { xs: 2, sm: 3 },
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
              >
                Your Boards
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={createNewBoard}
                sx={{
                  borderRadius: 2,
                  fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                  py: { xs: 1, sm: 1.5 },
                  px: { xs: 2, sm: 3 },
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Create Board
              </Button>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: { xs: 2, sm: 3 },
              }}
            >
              {boards.map((b, idx) => (
                <BoardCard
                  key={idx}
                  board={{
                    _id: b.id,
                    title: b.title,
                    description: b.description ?? "",
                    background: b.background.value,
                    isStarred: false,
                    members: [],
                    progress: 0,
                    totalTasks: 0,
                    completedTasks: 0,
                    lastUpdated: new Date(b.updatedAt)
                      .toISOString()
                      .split("T")[0],
                  }}
                  onClick={handleBoardClick}
                  onMenuClick={() => {}}
                />
              ))}
              {isLoading && <Typography>Loading boards...</Typography>}
              {isError && (
                <Typography color="error">
                  Error loading boards. Please try again.
                </Typography>
              )}
              {!isLoading && boards.length === 0 && (
                <Typography>
                  No boards found. Create your first board!
                </Typography>
              )}
            </Box>
          </Box>

          {/* Sidebar */}
          <Box>
            {/* Recent Activity */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Recent Activity
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {recentActivities.length > 0 &&
                    recentActivities.map((activity, index) => (
                      <Box key={activity.id}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: "0.8rem",
                              bgcolor: "primary.main",
                            }}
                          >
                            {activity.avatar}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2">
                              <strong>{activity.user}</strong> {activity.action}{" "}
                              <em>{activity.item}</em> in{" "}
                              <strong>{activity.board}</strong>
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {activity.time}
                            </Typography>
                          </Box>
                        </Box>
                        {index < recentActivities.length - 1 && (
                          <Divider sx={{ my: 2 }} />
                        )}
                      </Box>
                    ))}
                </Box>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    fullWidth
                    onClick={createNewBoard}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Create New Board
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<GroupIcon />}
                    fullWidth
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Invite Team Members
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ScheduleIcon />}
                    fullWidth
                    sx={{ justifyContent: "flex-start" }}
                  >
                    View Calendar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Menu for board actions */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <AssignmentIcon sx={{ mr: 1 }} />
            Board Settings
          </MenuItem>
        </Menu>
        <CreateBoardModal
          open={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onCreate={handleCreateBoard}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
