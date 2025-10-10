import React from 'react';
import { Box } from '@mui/material';
// Add import for CreateColumns
import CreateColumns from '../../../../components/createColumns';

interface BoardColumnsProps {
  onAddColumn: (title: string) => void;
  children?: React.ReactNode;
}

const BoardColumns: React.FC<BoardColumnsProps> = ({
  onAddColumn,
  children,
}) => {

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
        bgcolor: 'transparent',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.24)' : 'rgba(0,0,0,0.18)',
          borderRadius: '4px',
          '&:hover': {
            background: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.28)',
          },
        },
      }}
    >
      {/* Render Columns */}
      {children}

      {/* Create Columns Input */}
      <CreateColumns onCreate={onAddColumn} />
    </Box>
  );
};

export default BoardColumns;