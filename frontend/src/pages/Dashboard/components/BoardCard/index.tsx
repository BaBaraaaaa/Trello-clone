import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  useTheme,
  alpha,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Star as StarIcon,
  Group as GroupIcon,
} from '@mui/icons-material';

export interface BoardMember {
  id: string;
  name: string;
  avatar: string;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  background: string;
  isStarred: boolean;
  members: BoardMember[];
  progress: number;
  totalTasks: number;
  completedTasks: number;
  lastUpdated: string;
}

interface BoardCardProps {
  board: Board;
  onClick: (boardId: string) => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>, boardId: string) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ board, onClick, onMenuClick }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        cursor: 'pointer',
        borderRadius: 3,
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
        transition: 'all 0.3s ease',
      }}
      onClick={() => onClick(board.id)}
    >
      <Box
        sx={{
          height: { xs: 100, sm: 120 },
          background: board.background,
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            lineHeight: 1.2,
          }}
        >
          {board.title}
        </Typography>
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            '&:hover': {
              backgroundColor: alpha('#fff', 0.2),
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick(e, board.id);
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>
      
      <CardContent>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {board.description}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {board.completedTasks}/{board.totalTasks}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={board.progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Box sx={{ display: 'flex', ml: 1 }}>
              {board.members.slice(0, 3).map((member, index) => (
                <Avatar
                  key={member.id}
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: '0.7rem',
                    ml: index > 0 ? -0.5 : 0,
                    border: `2px solid ${theme.palette.background.paper}`,
                    bgcolor: theme.palette.primary.main,
                  }}
                >
                  {member.avatar}
                </Avatar>
              ))}
              {board.members.length > 3 && (
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: '0.7rem',
                    ml: -0.5,
                    border: `2px solid ${theme.palette.background.paper}`,
                    bgcolor: theme.palette.text.secondary,
                  }}
                >
                  +{board.members.length - 3}
                </Avatar>
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {board.isStarred && (
              <StarIcon sx={{ fontSize: 16, color: '#ffd700' }} />
            )}
            <Typography variant="caption" color="text.secondary">
              {board.lastUpdated}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BoardCard;