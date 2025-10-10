import React, { useState } from 'react';
import { Box, Button, TextField, IconButton } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

interface CreateColumnsProps {
  onCreate: (title: string) => void;
}

const CreateColumns: React.FC<CreateColumnsProps> = ({ onCreate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setTitle('');
  };
  const handleAdd = () => {
    const trimmed = title.trim();
    if (trimmed) {
      onCreate(trimmed);
      handleClose();
    }
  };

  if (!isOpen) {
    return (
      <Box
        sx={{
          minWidth: { xs: 260, sm: 280 },
          width: { xs: 260, sm: 280 },
          display: 'flex',
          alignItems: 'flex-start',
          flexShrink: 0,
        }}
      >
        <Button
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{
            width: '100%',
            minHeight: { xs: 44, sm: 48 },
            justifyContent: 'flex-start',
            color: (theme) => theme.palette.text.primary,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.04)',
            backdropFilter: 'blur(6px)',
            border: (theme) => `1px dashed ${theme.palette.divider}`,
            borderRadius: 3,
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1.25, sm: 1.5 },
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.12)'
                  : 'rgba(0,0,0,0.06)',
              borderColor: (theme) => theme.palette.text.secondary,
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          Add another list
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minWidth: { xs: 260, sm: 280 },
        width: { xs: 260, sm: 280 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        flexShrink: 0,
        p: 1,
      }}
    >
      <TextField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter list title..."
        variant="outlined"
        size="small"
        fullWidth
      />
      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button variant="contained" size="small" onClick={handleAdd}>
          Add list
        </Button>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CreateColumns;
