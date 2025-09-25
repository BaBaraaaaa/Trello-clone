import React, { useState } from "react";
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
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Folder as FolderIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts";
import { mockBoards } from "../../mock/board";
import { BoardCard, StatCard } from "./components";

// Mock data cho recent activity
const recentActivities = [
  {
    id: "1",
    user: "John Doe",
    action: "completed",
    item: "Login page design",
    board: "Website Redesign",
    time: "10 minutes ago",
    avatar: "JD",
  },
  {
    id: "2",
    user: "Jane Smith",
    action: "added",
    item: "API integration task",
    board: "Mobile App Development",
    time: "1 hour ago",
    avatar: "JS",
  },
  {
    id: "3",
    user: "Emily Davis",
    action: "commented on",
    item: "Social media strategy",
    board: "Marketing Campaign",
    time: "2 hours ago",
    avatar: "ED",
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [boards, setBoards] = useState(mockBoards);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    boardId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedBoard(boardId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBoard(null);
  };

  const toggleStar = (boardId: string) => {
    setBoards(
      boards.map((board) =>
        board.id === boardId ? { ...board, isStarred: !board.isStarred } : board
      )
    );
    handleMenuClose();
  };

  const handleBoardClick = (boardId: string) => {
    navigate(`/board/${boardId}`);
  };

  const createNewBoard = () => {
    // TODO: Implement create board modal
    console.log("Create new board");
  };

  // Statistics calculations
  const totalBoards = boards.length;
  const totalTasks = boards.reduce((sum, board) => sum + board.totalTasks, 0);
  const completedTasks = boards.reduce(
    (sum, board) => sum + board.completedTasks,
    0
  );
  const overallProgress =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      }}
    >
      {/* Header Section - Fixed */}
      <Box 
        sx={{ 
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(15, 23, 42, 0.95)'
              : 'rgba(248, 250, 252, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
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
              theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, #60a5fa 0%, #34d399 50%, #f472b6 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography 
          variant="body1" 
          sx={{
            color: 'text.secondary',
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
          overflow: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
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
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onClick={handleBoardClick}
                onMenuClick={handleMenuOpen}
              />
            ))}
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
                {recentActivities.map((activity, index) => (
                  <Box key={activity.id}>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
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
                        <Typography variant="caption" color="text.secondary">
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
        <MenuItem onClick={() => selectedBoard && toggleStar(selectedBoard)}>
          {boards.find((b) => b.id === selectedBoard)?.isStarred ? (
            <>
              <StarBorderIcon sx={{ mr: 1 }} />
              Remove from Starred
            </>
          ) : (
            <>
              <StarIcon sx={{ mr: 1 }} />
              Add to Starred
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <AssignmentIcon sx={{ mr: 1 }} />
          Board Settings
        </MenuItem>
      </Menu>
      </Box>
    </Box>
  );
};

export default Dashboard;
