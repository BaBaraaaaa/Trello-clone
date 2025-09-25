import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Box,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface BoardTitleProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  editable?: boolean;
}

const BoardTitle: React.FC<BoardTitleProps> = ({
  title,
  onTitleChange,
  editable = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  useEffect(() => {
    setEditValue(title);
  }, [title]);

  const handleStartEdit = () => {
    if (editable) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (editValue.trim() !== title) {
      onTitleChange(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(title);
    setIsEditing(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleSave}
          autoFocus
          variant="standard"
          sx={{
            '& .MuiInput-input': (theme) => ({
              color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              fontWeight: 700,
              textShadow: theme.palette.mode === 'dark'
                ? '0 2px 4px rgba(0, 0, 0, 0.3)'
                : '0 1px 2px rgba(0, 0, 0, 0.15)',
            }),
            '& .MuiInput-underline:before': (theme) => ({
              borderBottomColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)',
            }),
            '& .MuiInput-underline:after': (theme) => ({
              borderBottomColor: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
            }),
          }}
        />
        <IconButton
          size="small"
          onClick={handleSave}
          sx={{
            ml: 0.5,
            color: (theme) => theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
          }}
        >
          <CheckIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleCancel}
          sx={{
            color: (theme) => theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        cursor: editable ? 'pointer' : 'default',
      }}
      onClick={handleStartEdit}
    >
      <Typography
        variant="h5"
        sx={{
          color: (theme) => theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
          fontWeight: 700,
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          textShadow: (theme) => theme.palette.mode === 'dark'
            ? '0 2px 4px rgba(0, 0, 0, 0.3)'
            : '0 1px 2px rgba(0, 0, 0, 0.15)',
          '&:hover': editable ? {
            opacity: 0.9,
          } : {},
        }}
      >
        {title}
      </Typography>
      {editable && (
        <IconButton
          size="small"
          sx={{
            color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)',
            opacity: 0.9,
            '&:hover': {
              opacity: 1,
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
            },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default BoardTitle;