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
// Removed mock DB, using props callbacks

export interface CardActionsProps {
    cardTitle: string;
    onEdit?: () => void;
    onCopy?: () => void;
    onMove?: () => void;
    onArchive?: () => void;
    onDelete?: () => void;
    size?: 'small' | 'medium';
  }

const CardActions: React.FC<CardActionsProps> = ({ cardTitle, onEdit, onCopy, onMove, onArchive, onDelete, size = 'small' }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    // Props: onEdit, onCopy, onMove, onArchive, onDelete

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    const handleAction = (action: 'edit' | 'copy' | 'move' | 'archive' | 'delete') => {
      handleMenuClose();
      switch (action) {
        case 'edit':
          onEdit?.();
          break;
        case 'copy':
          onCopy?.();
          break;
        case 'move':
          onMove?.();
          break;
        case 'archive':
          onArchive?.();
          break;
        case 'delete':
          setDeleteDialogOpen(true);
          break;
      }
    };


    return (
      <>
        <Box
          onMouseDown={(e) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            opacity: 0,
            transition: 'opacity 0.2s ease',
            '.card-container:hover &': { opacity: 1 },
            zIndex: 3,
            pointerEvents: 'auto',
          }}
        >
          <IconButton
            size={size}
            onClick={handleMenuOpen}
            onMouseDown={(e) => e.stopPropagation()}
            sx={{
              pointerEvents: 'auto',
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.9)',
              color: (theme) => theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.secondary,
              width: size === 'small' ? 24 : 32,
              height: size === 'small' ? 24 : 32,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,1)',
                color: (theme) => theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
              },
            }}
          >
            <MoreHorizIcon fontSize={size} />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
          PaperProps={{ sx: { mt: 0.5, minWidth: 180, borderRadius: 2 } }}
        >
          <MenuItem onClick={(e) => { e.stopPropagation(); handleAction('edit'); }}>
            <EditIcon sx={{ mr: 1, fontSize: '1rem' }} />
            Edit Card
          </MenuItem>
          <MenuItem onClick={(e) => { e.stopPropagation(); handleAction('copy'); }}>
            <ContentCopyIcon sx={{ mr: 1, fontSize: '1rem' }} />
            Copy Card
          </MenuItem>
          {/* Removed labels menu */}
          <MenuItem onClick={(e) => { e.stopPropagation(); handleAction('move'); }}>
            <MoveIcon sx={{ mr: 1, fontSize: '1rem' }} />
            Move Card
          </MenuItem>
          <MenuItem onClick={(e) => { e.stopPropagation(); handleAction('archive'); }}>
            <ArchiveIcon sx={{ mr: 1, fontSize: '1rem' }} />
            Archive Card
          </MenuItem>
          <MenuItem onClick={(e) => { e.stopPropagation(); handleAction('delete'); }} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1, fontSize: '1rem' }} />
            Delete Card
          </MenuItem>
        </Menu>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onClick={(e) => e.stopPropagation()}
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle>Delete Card?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{cardTitle}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => { onDelete?.(); setDeleteDialogOpen(false); }} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

      </>
    );
  };


export default CardActions;