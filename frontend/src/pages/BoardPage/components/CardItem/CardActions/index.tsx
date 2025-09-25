import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import {
  MoreHoriz as MoreHorizIcon,
  Edit as EditIcon,
  ContentCopy as ContentCopyIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  ArrowForward as MoveIcon,
} from '@mui/icons-material';

export interface CardActionsProps {
  cardId: string;
  cardTitle: string;
  onEdit?: () => void;
  onCopy?: () => void;
  onMove?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  size?: 'small' | 'medium';
}

const CardActions: React.FC<CardActionsProps> = ({
  cardTitle,
  onEdit,
  onCopy,
  onMove,
  onArchive,
  onDelete,
  size = 'small',
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent card click
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: 'edit' | 'copy' | 'move' | 'archive' | 'delete') => {
    handleMenuClose();
    
    switch (action) {
      case 'edit':
        if (onEdit) onEdit();
        break;
      case 'copy':
        if (onCopy) onCopy();
        break;
      case 'move':
        if (onMove) onMove();
        break;
      case 'archive':
        if (onArchive) onArchive();
        break;
      case 'delete':
        setDeleteDialogOpen(true);
        break;
    }
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          opacity: 0,
          transition: 'opacity 0.2s ease',
          '.card-container:hover &': {
            opacity: 1,
          },
        }}
      >
        <IconButton
          size={size}
          onClick={handleMenuOpen}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: 'text.secondary',
            width: size === 'small' ? 24 : 32,
            height: size === 'small' ? 24 : 32,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              color: 'text.primary',
            },
          }}
        >
          <MoreHorizIcon fontSize={size} />
        </IconButton>
      </Box>

      {/* Card Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 160,
            borderRadius: 2,
          }
        }}
      >
        <MenuItem onClick={() => handleAction('edit')}>
          <EditIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Edit Card
        </MenuItem>
        
        <MenuItem onClick={() => handleAction('copy')}>
          <ContentCopyIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Copy Card
        </MenuItem>
        
        <MenuItem onClick={() => handleAction('move')}>
          <MoveIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Move Card
        </MenuItem>
        
        <MenuItem onClick={() => handleAction('archive')}>
          <ArchiveIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Archive Card
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleAction('delete')}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Delete Card
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>Delete Card?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{cardTitle}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CardActions;