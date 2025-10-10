import React, { useState } from "react";
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
  DialogTitle,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import type {
  CardItemData,
  CardMemberData,
  ComponentCardLabel as CardLabel,
  ChecklistItem,
} from "../../../../types";
import {
  useGetChecklistsQuery,
  useAddChecklistItemMutation,
  useUpdateChecklistItemMutation,
  useDeleteChecklistItemMutation,
  useGetCardLabelsQuery,
  useAddCardLabelMutation,
  useDeleteCardLabelMutation,
} from '../../../../services/api/apiSlice';
import {
  useAddLabelMutation,
  useUpdateLabelMutation,
  useDeleteLabelMutation,
} from "../../../../services/api/apiSlice";

interface CardDetailDialogProps {
  open: boolean;
  card: CardItemData | null;
  boardMembers: CardMemberData[];
  availableLabels: CardLabel[];
  boardId: string;
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

const CardDetailDialog: React.FC<CardDetailDialogProps> = ({
  open,
  card,
  boardMembers,
  availableLabels,
  boardId,
  onClose,
  onSave,
  onDelete,
}) => {
  const [editedCard, setEditedCard] = useState<CardItemData | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { data: checklistItems = [] } = useGetChecklistsQuery(card?.id ?? "", { skip: !card });
  const { data: cardLabels = [], isLoading: loadingCardLabels } = useGetCardLabelsQuery(card?.id ?? '', { skip: !card });
  const [assignLabel] = useAddCardLabelMutation();
  const [unassignLabel] = useDeleteCardLabelMutation();
  // New Label Dialog state
  const [createLabelDialogOpen, setCreateLabelDialogOpen] = useState(false);
  const [newLabelNameDialog, setNewLabelNameDialog] = useState('');
  const [newLabelColorDialog, setNewLabelColorDialog] = useState('#000000');
  const [createBoardLabel] = useAddLabelMutation();
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [addChecklistItem] = useAddChecklistItemMutation();
  // Card labels API
  const [deleteChecklistItem] = useDeleteChecklistItemMutation();
  const [comments] = useState<Comment[]>([]);
  // Label manager dialog state
  const [labelDialogOpen, setLabelDialogOpen] = useState(false);
  const [labelsList, setLabelsList] = useState<CardLabel[]>(availableLabels);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#000000");
  const [createLabel] = useAddLabelMutation();
  const [updateLabel] = useUpdateLabelMutation();
  const [removeLabel] = useDeleteLabelMutation();

  React.useEffect(() => {
    if (card) setEditedCard({ ...card });
    console.log(card);
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
      console.log("Add comment:", newComment);
      setNewComment("");
    }
  };

  const handleChecklistItemToggle = (item: ChecklistItem) => {
    console.log(item);
    try {
      updateChecklistItem({
        id: item.id,
        data: { completed: !item.completed },
      });
    } catch (error) {
      console.error("Update checklist item failed", error);
    }
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      addChecklistItem({
        cardId: card!.id,
        text: newChecklistItem.trim(),
        position: checklistItems.length,
      });
      setNewChecklistItem("");
    }
  };


  const handleAddMember = () => {
    if (!boardMembers.length || !editedCard) return;
    const names = boardMembers.map((m) => m.name).join(", ");
    const name = window.prompt(`Enter member name (${names}):`);
    const selected = boardMembers.find((m) => m.name === name);
    if (selected)
      setEditedCard({
        ...editedCard,
        members: [...(editedCard.members || []), selected],
      });
  };

  const completedCount = checklistItems.filter((item) => item.completed).length;



  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
          bgcolor: "background.paper",
          backdropFilter: "blur(20px)",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.2)",
          border: "1px solid",
          borderColor: "divider",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 3,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.015) 100%)"
                : "linear-gradient(135deg, rgba(2, 106, 167, 0.05) 0%, rgba(90, 172, 68, 0.03) 100%)",
            pointerEvents: "none",
          },
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,0.7)"
              : "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            {/* Title */}
            {isEditingTitle ? (
              <TextField
                fullWidth
                value={editedCard.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditingTitle(false);
                  if (e.key === "Escape") {
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
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "action.hover",
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                  },
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
          {availableLabels.length === 0 ? (
            <Box sx={{ mb: 2 }}>
              <Button variant="outlined" size="small" onClick={() => setCreateLabelDialogOpen(true)}>
                Create Label
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {loadingCardLabels ? (
              <Typography variant="body2">Loading labels...</Typography>
            ) : (
              cardLabels.map(label => (
                <Chip
                  key={label.id}
                  label={label.name}
                  size="small"
                  onDelete={() => unassignLabel({ cardId: card.id, labelId: label.id })}
                  sx={{
                    backgroundColor: label.color,
                    color: theme => theme.palette.getContrastText(label.color),
                  }}
                />
              ))
            )}
            <Chip
              icon={<AddIcon />}
              label="Add Label"
              clickable
              onClick={async () => {
                const names = availableLabels.map(l => l.name).join(', ');
                const name = window.prompt(`Choose label (${names}):`);
                const sel = availableLabels.find(l => l.name === name);
                console.log(card.id, sel?.id);
                if (sel && sel.id) await assignLabel({ cardId: card.id, labelId: sel.id }).unwrap();
              }}
            />
            </Box>
          )}

          {/* Card Stats */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            {editedCard.dueDate && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <ScheduleIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Due {new Date(editedCard.dueDate).toLocaleDateString()}
                </Typography>
              </Box>
            )}

            {editedCard.members && editedCard.members.length > 0 ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon fontSize="small" color="action" />
                <AvatarGroup
                  max={3}
                  sx={{
                    "& .MuiAvatar-root": {
                      width: 24,
                      height: 24,
                      fontSize: "0.75rem",
                    },
                  }}
                >
                  {editedCard.members.map((member) => (
                    <Avatar
                      key={member.id}
                      src={member.avatar}
                      alt={member.name}
                      sx={{
                        bgcolor: "primary.main",
                        color: (theme) =>
                          theme.palette.getContrastText(
                            theme.palette.primary.main
                          ),
                      }}
                    >
                      {member.initials}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </Box>
            ) : (
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleAddMember}
                  startIcon={<PersonIcon fontSize="small" />}
                >
                  Add Member
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Content Area */}
        <Box sx={{ p: 3, maxHeight: "60vh", overflow: "auto" }}>
          {/* Description */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 1, fontSize: "1rem", fontWeight: 600 }}
            >
              Description
            </Typography>
            {isEditingDescription ? (
              <TextField
                fullWidth
                multiline
                minRows={3}
                maxRows={6}
                value={editedCard.description || ""}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                onBlur={() => setIsEditingDescription(false)}
                placeholder="Add a description..."
                autoFocus
              />
            ) : (
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: "action.hover",
                  cursor: "pointer",
                  minHeight: 60,
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => setIsEditingDescription(true)}
              >
                <Typography
                  variant="body2"
                  color={
                    editedCard.description ? "text.primary" : "text.secondary"
                  }
                >
                  {editedCard.description || "Add a description..."}
                </Typography>
              </Paper>
            )}
          </Box>

          {/* Checklist */}
          <Box sx={{ mb: 3 }}>
            {checklistItems.length > 0 ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "1rem", fontWeight: 600 }}
                  >
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
                            onChange={() => handleChecklistItemToggle(item)}
                          />
                        }
                        label={
                          <Typography
                            sx={{
                              textDecoration: item.completed
                                ? "line-through"
                                : "none",
                              color: item.completed
                                ? "text.secondary"
                                : "text.primary",
                            }}
                          >
                            {item.text}
                          </Typography>
                        }
                        sx={{ flex: 1 }}
                      />
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => deleteChecklistItem(item.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
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
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddChecklistItem();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleAddChecklistItem}
                        >
                          <AddIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const text = window.prompt("Enter checklist item:");
                  if (text)
                    addChecklistItem({ cardId: card!.id, text, position: 0 });
                }}
              >
                Add Checklist
              </Button>
            )}
          </Box>

          {/* Comments */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontSize: "1rem", fontWeight: 600 }}
            >
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
                  <ListItem
                    key={comment.id}
                    alignItems="flex-start"
                    sx={{ px: 0 }}
                  >
                    <Avatar
                      src={comment.author.avatar}
                      sx={{ mr: 2, width: 32, height: 32 }}
                    >
                      {comment.author.initials}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="body2" fontWeight={600}>
                            {comment.author.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {comment.content}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 2 }}
              >
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={() => handleDelete()}
          color="error"
          startIcon={<DeleteIcon />}
        >
          Delete Card
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>

      {/* Label Manager Dialog */}
      <Dialog
        open={labelDialogOpen}
        onClose={() => setLabelDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Manage Labels</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              label="Name"
              size="small"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
            />
            <TextField
              label="Color"
              size="small"
              value={newLabelColor}
              onChange={(e) => setNewLabelColor(e.target.value)}
            />
            <IconButton
              onClick={async () => {
                if (!newLabelName.trim()) return;
                try {
                  const lbl = await createLabel({
                      name: newLabelName.trim(),
                      color: newLabelColor,
                      boardId: boardId,
                    }).unwrap();
                  setLabelsList((prev) => [...prev, lbl]);
                  setNewLabelName("");
                  setNewLabelColor("#000000");
                } catch (error) {
                  console.error("Create label failed", error);
                }
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
          <List>
            {labelsList.map((lbl) => (
              <ListItem
                key={lbl.id}
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      onClick={async () => {
                        const name = prompt("New label name", lbl.name);
                        if (name && lbl.id) {
                          try {
                            const updated = await updateLabel({
                              id: lbl.id,
                              data: { name },
                            }).unwrap();
                            setLabelsList((prev) =>
                              prev.map((l) => (l.id === lbl.id ? updated : l))
                            );
                          } catch (error) {
                            console.error("Update label failed", error);
                          }
                        }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={async () => {
                        try {
                          if (!lbl.id) return;
                          await removeLabel(lbl.id).unwrap();
                          setLabelsList((prev) =>
                            prev.filter((l) => l.id !== lbl.id)
                          );
                        } catch (error) {
                          console.error("Create label failed", error);
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    bgcolor: lbl.color,
                    borderRadius: "50%",
                    mr: 1,
                  }}
                />
                <Typography>{lbl.name}</Typography>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLabelDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default CardDetailDialog;
