import React from 'react';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface BoardColumnsProps {
  onAddColumn?: () => void;
  children?: React.ReactNode;
}

const BoardColumns: React.FC<BoardColumnsProps> = ({
  onAddColumn,
  children,
}) => {
  const handleAddColumn = () => {
    if (onAddColumn) {
      onAddColumn();
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        gap: { xs: 1.5, sm: 2 },
        p: { xs: 1.5, sm: 2, md: 3 },
        overflow: 'auto',
        alignItems: 'flex-start',
        minHeight: 0, // Allow flex shrinking
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.5)',
          },
        },
      }}
    >
      {/* Render Columns */}
      {children}

      {/* Add Column Button */}
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
          onClick={handleAddColumn}
          sx={{
            width: '100%',
            minHeight: { xs: 44, sm: 48 },
            justifyContent: 'flex-start',
            color: 'white',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px dashed rgba(255, 255, 255, 0.4)',
            borderRadius: 3,
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1.25, sm: 1.5 },
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.25)',
              borderColor: 'rgba(255, 255, 255, 0.6)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          Add another list
        </Button>
      </Box>
    </Box>
  );
};

export default BoardColumns;