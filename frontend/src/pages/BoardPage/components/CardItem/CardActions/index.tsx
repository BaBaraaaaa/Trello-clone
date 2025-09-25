import React, { useMemo, useState } from 'react';
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
  Label as LabelIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useMockDB } from '../../../../../contexts/MockDBContext';

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

  const CardActions: React.FC<CardActionsProps> = ({ cardId, cardTitle, onEdit, onCopy, onMove, onArchive, onDelete, size = 'small' }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [labelsDialogOpen, setLabelsDialogOpen] = useState(false);
    const { boardId } = useParams<{ boardId: string }>();
    const { getBoardLabels, toggleCardLabel, db } = useMockDB();

    const allLabels = useMemo(
      () => (boardId ? getBoardLabels(boardId) : []),
      [boardId, getBoardLabels]
    );

    const isLabelActive = (labelId: string) => db.cardLabels.some(cl => cl.cardId === cardId && cl.labelId === labelId);

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

    const handleOpenLabels = () => {
      handleMenuClose();
      setLabelsDialogOpen(true);
    };

    const toggleLabel = (labelId: string) => {
      toggleCardLabel(cardId, labelId);
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
          <MenuItem onClick={(e) => { e.stopPropagation(); handleOpenLabels(); }}>
            <LabelIcon sx={{ mr: 1, fontSize: '1rem' }} />
            Labels
          </MenuItem>
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

        <Dialog
          open={labelsDialogOpen}
          onClose={() => setLabelsDialogOpen(false)}
          onClick={(e) => e.stopPropagation()}
          PaperProps={{ sx: { borderRadius: 3, minWidth: 360 } }}
        >
          <DialogTitle>Card Labels</DialogTitle>
          <DialogContent dividers>
            {allLabels.length === 0 ? (
              <Typography color="text.secondary">No labels on this board.</Typography>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                {allLabels.map(l => {
                  const active = isLabelActive(l.id);
                  return (
                    <Button
                      key={l.id}
                      variant={active ? 'contained' : 'outlined'}
                      onClick={(e) => { e.stopPropagation(); toggleLabel(l.id); }}
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        borderRadius: 2,
                        ...(active
                          ? { bgcolor: l.color, color: '#fff', '&:hover': { bgcolor: l.color } }
                          : { borderColor: 'divider', color: 'text.primary' }),
                      }}
                    >
                      <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: l.color, mr: 1 }} />
                      {l.name}
                    </Button>
                  );
                })}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLabelsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };


export default CardActions;