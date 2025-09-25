import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  MoreHoriz as MoreHorizIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Archive as ArchiveIcon,
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface ColumnHeaderProps {
  title: string;
  cardCount: number;
  onTitleChange?: (newTitle: string) => void;
  onAddCard?: () => void;
  onCopyColumn?: () => void;
  onArchiveColumn?: () => void;
  onDeleteColumn?: () => void;
  editable?: boolean;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  title,
  cardCount,
  onTitleChange,
  onAddCard,
  onCopyColumn,
  onArchiveColumn,
  onDeleteColumn,
  editable = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation(); // Prevent column drag
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStartEdit = () => {
    if (editable) {
      setIsEditing(true);
      handleMenuClose();
    }
  };

  const handleSave = () => {
    if (editValue.trim() !== title && onTitleChange) {
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

  const handleAction = (action: 'add' | 'copy' | 'archive' | 'delete') => {
    handleMenuClose();
    
    switch (action) {
      case 'add':
        if (onAddCard) onAddCard();
        break;
      case 'copy':
        if (onCopyColumn) onCopyColumn();
        break;
      case 'archive':
        if (onArchiveColumn) onArchiveColumn();
        break;
      case 'delete':
        setDeleteDialogOpen(true);
        break;
    }
  };

  const confirmDelete = () => {
    if (onDeleteColumn) {
      onDeleteColumn();
    }
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1.5,
          px: 1,
        }}
      >
        {isEditing ? (
          <TextField
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            autoFocus
            variant="standard"
            sx={{
              flex: 1,
              '& .MuiInput-input': {
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'text.primary',
              },
            }}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flex: 1,
              cursor: editable ? 'pointer' : 'default',
            }}
            onClick={handleStartEdit}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'text.primary',
                flex: 1,
                '&:hover': editable ? { opacity: 0.7 } : {},
              }}
            >
              {title}
            </Typography>
            
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                backgroundColor: 'action.hover',
                borderRadius: 1,
                px: 0.75,
                py: 0.25,
                fontSize: '0.75rem',
                minWidth: '20px',
                textAlign: 'center',
              }}
            >
              {cardCount}
            </Typography>
          </Box>
        )}

        {!isEditing && (
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
                backgroundColor: 'action.hover',
              },
            }}
          >
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Column Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 180,
            borderRadius: 2,
          }
        }}
      >
        <MenuItem onClick={() => handleAction('add')}>
          <AddIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
          Add Card
        </MenuItem>
        
        {editable && (
          <MenuItem onClick={handleStartEdit}>
            <EditIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
            Edit Title
          </MenuItem>
        )}
        
        <MenuItem onClick={() => handleAction('copy')}>
          <ContentCopyIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
          Copy List
        </MenuItem>
        
        <MenuItem onClick={() => handleAction('archive')}>
          <ArchiveIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
          Archive List
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleAction('delete')}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
          Delete List
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
        <DialogTitle>Delete List?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{title}"? This action cannot be undone.
            {cardCount > 0 && ` This will also delete ${cardCount} card${cardCount === 1 ? '' : 's'}.`}
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

export default ColumnHeader;