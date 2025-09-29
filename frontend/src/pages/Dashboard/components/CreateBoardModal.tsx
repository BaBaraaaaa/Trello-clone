import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';

interface CreateBoardModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ open, onClose, onCreate }) => {
  const [title, setTitle] = useState('');

  // Clear title when reopened
  useEffect(() => {
    if (open) setTitle('');
  }, [open]);

  const handleSave = () => {
    if (title.trim()) {
      onCreate(title.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Create New Board</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Board title"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={!title.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBoardModal;
