import React, { useState } from 'react';
import {
  AvatarGroup,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Box,
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

export interface BoardMember {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  initials: string;
  role?: 'admin' | 'member' | 'observer';
}

interface MemberAvatarsProps {
  members: BoardMember[];
  onAddMember?: (email: string) => void;
  onRemoveMember?: (memberId: string) => void;
  maxVisible?: number;
  editable?: boolean;
}

const MemberAvatars: React.FC<MemberAvatarsProps> = ({
  members,
  onAddMember,
  onRemoveMember,
  maxVisible = 4,
  editable = true,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = () => {
    if (inviteEmail.trim() && onAddMember) {
      onAddMember(inviteEmail.trim());
      setInviteEmail('');
      setIsDialogOpen(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    if (onRemoveMember) {
      onRemoveMember(memberId);
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'member':
        return 'primary';
      case 'observer':
        return 'default';
      default:
        return 'primary';
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AvatarGroup
          max={maxVisible}
          sx={{
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              fontSize: '0.75rem',
              border: '2px solid white',
              cursor: 'pointer',
            },
          }}
          onClick={() => setIsDialogOpen(true)}
        >
          {members.map((member) => (
            <Avatar
              key={member.id}
              src={member.avatar}
              alt={member.name}
              sx={{ bgcolor: 'primary.main' }}
              title={`${member.name}${member.role ? ` (${member.role})` : ''}`}
            >
              {member.initials}
            </Avatar>
          ))}
        </AvatarGroup>

        {editable && (
          <IconButton
            size="small"
            onClick={() => setIsDialogOpen(true)}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '2px dashed rgba(255, 255, 255, 0.3)',
              width: 32,
              height: 32,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Members Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          Board Members ({members.length})
        </DialogTitle>
        <DialogContent>
          {/* Add Member Section */}
          {editable && (
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Invite by email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInvite()}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                startIcon={<PersonIcon />}
                onClick={handleInvite}
                disabled={!inviteEmail.trim()}
                fullWidth
              >
                Send Invitation
              </Button>
            </Box>
          )}

          {/* Members List */}
          <List>
            {members.map((member) => (
              <ListItem
                key={member.id}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: 'action.hover',
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{ bgcolor: 'primary.main' }}
                  >
                    {member.initials}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={member.name}
                  secondary={member.email || 'No email provided'}
                />
                {member.role && (
                  <Chip
                    label={member.role}
                    size="small"
                    color={getRoleColor(member.role)}
                    sx={{ mr: 1 }}
                  />
                )}
                {editable && member.role !== 'admin' && (
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveMember(member.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MemberAvatars;