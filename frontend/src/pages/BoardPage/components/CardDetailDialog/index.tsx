import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  Divider,
  Chip,
  Avatar,
  AvatarGroup,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { CardItemData } from '../CardItem';
import type { CardMemberData } from '../CardItem/CardMembers';
import type { CardLabel } from '../CardItem/CardLabels';

interface CardDetailDialogProps {
  open: boolean;
  card: CardItemData | null;
  boardMembers: CardMemberData[];
  availableLabels: CardLabel[];
  onClose: () => void;
  onSave?: (updatedCard: CardItemData) => void;
  onDelete?: (cardId: string) => void;
}

interface Comment {
  id: string;
  author: CardMemberData;
  content: string;
  createdAt: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

const CardDetailDialog: React.FC<CardDetailDialogProps> = ({
  open,
  card,
  onClose,
  onSave,
  onDelete,
}) => {
  const [editedCard, setEditedCard] = useState<CardItemData | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [comments] = useState<Comment[]>([]);

  React.useEffect(() => {
    if (card) {
      setEditedCard({ ...card });
      // Initialize checklist items (mock data)
      setChecklistItems([
        { id: '1', text: 'Research competitors', completed: true },
        { id: '2', text: 'Create wireframes', completed: false },
        { id: '3', text: 'Design mockups', completed: false },
      ]);
    }
  }, [card]);

  if (!card || !editedCard) {
    return null;
  }

  const handleSave = () => {
    if (onSave && editedCard) {
      onSave(editedCard);
    }
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(card.id);
    }
    onClose();
  };

  const handleTitleChange = (newTitle: string) => {
    if (editedCard) {
      setEditedCard({ ...editedCard, title: newTitle });
    }
  };

  const handleDescriptionChange = (newDescription: string) => {
    if (editedCard) {
      setEditedCard({ ...editedCard, description: newDescription });
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Mock adding comment
      console.log('Add comment:', newComment);
      setNewComment('');
    }
  };

  const handleChecklistItemToggle = (itemId: string) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newChecklistItem.trim(),
        completed: false,
      };
      setChecklistItems(prev => [...prev, newItem]);
      setNewChecklistItem('');
    }
  };

  const completedCount = checklistItems.filter(item => item.completed).length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(2, 106, 167, 0.05) 0%, rgba(90, 172, 68, 0.03) 100%)',
            pointerEvents: 'none',
          },
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            {/* Title */}
            {isEditingTitle ? (
              <TextField
                fullWidth
                value={editedCard.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingTitle(false);
                  if (e.key === 'Escape') {
                    setEditedCard({ ...editedCard, title: card.title });
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                variant="outlined"
                sx={{ mr: 2 }}
              />
            ) : (
              <Typography
                variant="h6"
                sx={{
                  flex: 1,
                  mr: 2,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover', borderRadius: 1, px: 1, py: 0.5 }
                }}
                onClick={() => setIsEditingTitle(true)}
              >
                {editedCard.title}
              </Typography>
            )}

            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Labels */}
          {editedCard.labels && editedCard.labels.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {editedCard.labels.map((label, index) => (
                <Chip
                  key={index}
                  label={label.text}
                  size="small"
                  sx={{
                    backgroundColor: label.color,
                    color: 'white',
                  }}
                />
              ))}
            </Box>
          )}

          {/* Card Stats */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            {editedCard.dueDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ScheduleIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Due {new Date(editedCard.dueDate).toLocaleDateString()}
                </Typography>
              </Box>
            )}
            
            {editedCard.members && editedCard.members.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon fontSize="small" color="action" />
                <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                  {editedCard.members.map((member) => (
                    <Avatar key={member.id} src={member.avatar} alt={member.name}>
                      {member.initials}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </Box>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Content Area */}
        <Box sx={{ p: 3, maxHeight: '60vh', overflow: 'auto' }}>
          {/* Description */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, fontSize: '1rem', fontWeight: 600 }}>
              Description
            </Typography>
            {isEditingDescription ? (
              <TextField
                fullWidth
                multiline
                minRows={3}
                maxRows={6}
                value={editedCard.description || ''}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                onBlur={() => setIsEditingDescription(false)}
                placeholder="Add a description..."
                autoFocus
              />
            ) : (
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: 'action.hover',
                  cursor: 'pointer',
                  minHeight: 60,
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() => setIsEditingDescription(true)}
              >
                <Typography variant="body2" color={editedCard.description ? 'text.primary' : 'text.secondary'}>
                  {editedCard.description || 'Add a description...'}
                </Typography>
              </Paper>
            )}
          </Box>

          {/* Checklist */}
          {checklistItems.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                  Checklist
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {completedCount}/{checklistItems.length} completed
                </Typography>
              </Box>
              
              <List dense>
                {checklistItems.map((item) => (
                  <ListItem key={item.id} sx={{ px: 0 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.completed}
                          onChange={() => handleChecklistItemToggle(item.id)}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            textDecoration: item.completed ? 'line-through' : 'none',
                            color: item.completed ? 'text.secondary' : 'text.primary',
                          }}
                        >
                          {item.text}
                        </Typography>
                      }
                      sx={{ flex: 1 }}
                    />
                  </ListItem>
                ))}
              </List>

              <TextField
                fullWidth
                size="small"
                placeholder="Add an item"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleAddChecklistItem}>
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          {/* Comments */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem', fontWeight: 600 }}>
              Comments
            </Typography>
            
            {/* Add Comment */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Add Comment
              </Button>
            </Box>

            {/* Comments List */}
            {comments.length > 0 ? (
              <List>
                {comments.map((comment) => (
                  <ListItem key={comment.id} alignItems="flex-start" sx={{ px: 0 }}>
                    <Avatar src={comment.author.avatar} sx={{ mr: 2, width: 32, height: 32 }}>
                      {comment.author.initials}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {comment.author.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {comment.content}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={() => handleDelete()} color="error" startIcon={<DeleteIcon />}>
          Delete Card
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CardDetailDialog;