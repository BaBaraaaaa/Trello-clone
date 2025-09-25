import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface AddCardButtonProps {
  onAddCard?: (title: string) => void;
  disabled?: boolean;
}

const AddCardButton: React.FC<AddCardButtonProps> = ({
  onAddCard,
  disabled = false,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const textFieldRef = useRef<HTMLInputElement>(null);

  const handleStartAdd = () => {
    setIsAdding(true);
    // Focus after state update
    setTimeout(() => {
      textFieldRef.current?.focus();
    }, 100);
  };

  const handleSave = () => {
    const title = cardTitle.trim();
    if (title && onAddCard) {
      onAddCard(title);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setIsAdding(false);
    setCardTitle('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSave();
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  if (isAdding) {
    return (
      <Card
        sx={{
          mb: 1.5,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <TextField
            ref={textFieldRef}
            fullWidth
            placeholder="Enter a title for this card..."
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            variant="outlined"
            size="small"
            multiline
            minRows={2}
            maxRows={4}
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                fontSize: '0.875rem',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: '1px solid',
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<CheckIcon />}
              onClick={handleSave}
              disabled={!cardTitle.trim()}
              sx={{
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.8125rem',
              }}
            >
              Add card
            </Button>
            
            <IconButton
              size="small"
              onClick={handleCancel}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      fullWidth
      variant="text"
      startIcon={<AddIcon />}
      onClick={handleStartAdd}
      disabled={disabled}
      sx={{
        justifyContent: 'flex-start',
        color: 'text.secondary',
        background: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(4px)',
        border: '1px dashed rgba(255, 255, 255, 0.4)',
        borderRadius: 2,
        py: 1,
        px: 1.5,
        fontSize: '0.8125rem',
        textTransform: 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.6)',
          borderColor: 'rgba(255, 255, 255, 0.8)',
          color: 'text.primary',
          transform: 'translateY(-1px)',
        },
        '&:disabled': {
          opacity: 0.5,
        },
      }}
    >
      Add a card
    </Button>
  );
};

export default AddCardButton;