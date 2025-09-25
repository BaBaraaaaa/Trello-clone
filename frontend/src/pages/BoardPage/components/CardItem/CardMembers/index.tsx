import React from 'react';
import { Box, Avatar, AvatarGroup, Tooltip } from '@mui/material';

import type { CardMemberData } from '../../../../../types';

interface CardMembersProps {
  members: CardMemberData[];
  maxVisible?: number;
  size?: 'small' | 'medium';
}

const CardMembers: React.FC<CardMembersProps> = ({
  members,
  maxVisible = 3,
  size = 'small',
}) => {
  if (!members || members.length === 0) {
    return null;
  }

  const avatarSize = size === 'small' ? 24 : 32;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
      <AvatarGroup
        max={maxVisible}
        sx={{
          '& .MuiAvatar-root': (theme) => ({
            width: avatarSize,
            height: avatarSize,
            fontSize: size === 'small' ? '0.625rem' : '0.75rem',
            border: '2px solid',
            borderColor: theme.palette.background.paper,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.getContrastText(theme.palette.primary.main),
          }),
          '& .MuiAvatarGroup-avatar': {
            fontSize: size === 'small' ? '0.5rem' : '0.625rem',
            backgroundColor: 'text.secondary',
            color: 'background.paper',
          },
        }}
      >
        {members.map((member) => (
          <Tooltip key={member.id} title={member.name} arrow>
            <Avatar
              src={member.avatar}
              alt={member.name}
            >
              {member.initials}
            </Avatar>
          </Tooltip>
        ))}
      </AvatarGroup>
    </Box>
  );
};

export default CardMembers;