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
            '& .MuiInput-input': {
              color: 'white',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            },
            '& .MuiInput-underline:before': {
              borderBottomColor: 'rgba(255, 255, 255, 0.5)',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: 'white',
            },
          }}
        />
        <IconButton
          size="small"
          onClick={handleSave}
          sx={{ color: 'white', ml: 0.5 }}
        >
          <CheckIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleCancel}
          sx={{ color: 'white' }}
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
          color: 'white',
          fontWeight: 700,
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          '&:hover': editable ? {
            opacity: 0.8,
          } : {},
        }}
      >
        {title}
      </Typography>
      {editable && (
        <IconButton
          size="small"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            opacity: 0.6,
            '&:hover': {
              opacity: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
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