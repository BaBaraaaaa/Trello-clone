import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Attachment as AttachmentIcon,
  CheckBox as CheckBoxIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import CardLabels from './CardLabels';
import CardMembers from './CardMembers';
import CardActions from './CardActions';
import type { CardItemData } from '../../../../types';

interface CardItemProps {
  card: CardItemData;
  onClick?: (card: CardItemData) => void;
  onEdit?: (card: CardItemData) => void;
  onCopy?: (card: CardItemData) => void;
  onMove?: (card: CardItemData) => void;
  onArchive?: (card: CardItemData) => void;
  onDelete?: (card: CardItemData) => void;
  draggable?: boolean;
  isDragging?: boolean;
}

const CardItem: React.FC<CardItemProps> = ({
  card,
  onClick,
  onEdit,
  onCopy,
  onMove,
  onArchive,
  onDelete,
  draggable = false,
  isDragging = false,
}) => {
  const handleCardClick = (event: React.MouseEvent) => {
    // Don't trigger if clicking on interactive elements
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]')) {
      return;
    }
    
    if (onClick) {
      onClick(card);
    }
  };

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();
  const isDueToday = card.dueDate && new Date(card.dueDate).toDateString() === new Date().toDateString();
  console.log(card.title);
  return (
    <Card
      className="card-container"
      onClick={handleCardClick}
      sx={{
        mb: 1.5,
        cursor: 'pointer',
        position: 'relative',
        bgcolor: 'background.paper',
        borderRadius: 2.5,
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(8px)',
        border: '1px solid',
        borderColor: 'divider',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(5deg)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 2.5,
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        },
        '& .MuiCardContent-root': {
          position: 'relative',
          zIndex: 2,
        },
        '&:hover': {
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
          transform: isDragging ? 'rotate(5deg)' : 'translateY(-2px) scale(1.02)',
          bgcolor: 'background.paper',
        },
      }}
      draggable={draggable}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        {/* Labels */}
        {card.labels && card.labels.length > 0 && (
          <CardLabels labels={card.labels} />
        )}

        {/* Title */}
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'text.primary',
            lineHeight: 1.4,
            mb: card.description || card.dueDate || card.attachments || card.checklist || card.comments ? 1 : 0,
          }}
        >
          {card.title}
        </Typography>

        {/* Description Preview */}
        {card.description && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.3,
              mb: 1,
            }}
          >
            {card.description}
          </Typography>
        )}

        {/* Card Badges */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mb: card.members ? 1 : 0 }}>
          {/* Due Date */}
          {card.dueDate && (
            <Chip
              icon={<ScheduleIcon />}
              label={new Date(card.dueDate).toLocaleDateString()}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                backgroundColor: isOverdue ? 'error.light' : isDueToday ? 'warning.light' : 'action.hover',
                color: (theme) => {
                  if (isOverdue) return theme.palette.getContrastText(theme.palette.error.light);
                  if (isDueToday) return theme.palette.getContrastText(theme.palette.warning.light);
                  return theme.palette.text.secondary;
                },
                '& .MuiChip-icon': {
                  fontSize: '0.75rem',
                  color: 'inherit',
                },
              }}
            />
          )}

          {/* Attachments */}
          {card.attachments && card.attachments > 0 && (
            <Chip
              icon={<AttachmentIcon />}
              label={card.attachments}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                backgroundColor: 'action.hover',
                color: 'text.secondary',
                '& .MuiChip-icon': {
                  fontSize: '0.75rem',
                },
              }}
            />
          )}

          {/* Checklist */}
          {card.checklist && card.checklist.total > 0 && (
            <Chip
              icon={<CheckBoxIcon />}
              label={`${card.checklist.completed}/${card.checklist.total}`}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                backgroundColor: card.checklist.completed === card.checklist.total ? 'success.light' : 'action.hover',
                color: (theme) => (
                  card.checklist!.completed === card.checklist!.total
                    ? theme.palette.getContrastText(theme.palette.success.light)
                    : theme.palette.text.secondary
                ),
                '& .MuiChip-icon': {
                  fontSize: '0.75rem',
                  color: 'inherit',
                },
              }}
            />
          )}

          {/* Comments */}
          {card.comments && card.comments > 0 && (
            <Chip
              icon={<CommentIcon />}
              label={card.comments}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                backgroundColor: 'action.hover',
                color: 'text.secondary',
                '& .MuiChip-icon': {
                  fontSize: '0.75rem',
                },
              }}
            />
          )}
        </Box>

        {/* Members */}
        {card.members && card.members.length > 0 && (
          <CardMembers members={card.members} />
        )}
      </CardContent>

      {/* Card Actions */}
      <CardActions
        cardTitle={card.title}
        onEdit={() => onEdit?.(card)}
        onCopy={() => onCopy?.(card)}
        onMove={() => onMove?.(card)}
        onArchive={() => onArchive?.(card)}
        onDelete={() => onDelete?.(card)}
      />
    </Card>
  );
};

export default CardItem;