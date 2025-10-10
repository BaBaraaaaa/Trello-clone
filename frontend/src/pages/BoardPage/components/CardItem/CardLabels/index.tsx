import React from 'react';
import { Box, Chip, Tooltip } from '@mui/material';

import type { ComponentCardLabel as CardLabel } from '../../../../../types';

interface CardLabelsProps {
  labels: CardLabel[];
  maxVisible?: number;
  size?: 'small' | 'medium';
}

const CardLabels: React.FC<CardLabelsProps> = ({
  labels,
  maxVisible = 3,
  size = 'small',
}) => {
  if (!labels || labels.length === 0) {
    return null;
  }

  const visibleLabels = labels.slice(0, maxVisible);
  const remainingCount = labels.length - maxVisible;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.5,
        mb: 1,
      }}
    >
      {visibleLabels.map((label, index) => (
        <Tooltip key={label.id || index} title={label.name} arrow>
          <Chip
            label={label.name}
            size={size}
            sx={{
              backgroundColor: label.color,
              color: (theme) => theme.palette.getContrastText(label.color),
              fontSize: size === 'small' ? '0.6875rem' : '0.75rem',
              height: size === 'small' ? 20 : 24,
              borderRadius: 1,
              maxWidth: '100px',
              '& .MuiChip-label': {
                px: 0.75,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            }}
          />
        </Tooltip>
      ))}
      
      {remainingCount > 0 && (
        <Tooltip 
          title={`+${remainingCount} more label${remainingCount === 1 ? '' : 's'}`} 
          arrow
        >
          <Chip
            label={`+${remainingCount}`}
            size={size}
            sx={{
              backgroundColor: 'action.disabled',
              color: 'text.secondary',
              fontSize: size === 'small' ? '0.6875rem' : '0.75rem',
              height: size === 'small' ? 20 : 24,
              borderRadius: 1,
              '& .MuiChip-label': {
                px: 0.75,
              },
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
};

export default CardLabels;