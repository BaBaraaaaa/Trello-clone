import React from 'react';
import { Box, Typography } from '@mui/material';
import BoardTitle from './BoardTitle';
import MemberAvatars from './MemberAvatars';
import BoardActions from './BoardActions';
import type { BoardMember } from './MemberAvatars';
import type { FilterOptions } from './BoardActions';

export interface BoardHeaderProps {
  title: string;
  description?: string;
  members: BoardMember[];
  isStarred: boolean;
  onTitleChange: (newTitle: string) => void;
  onToggleStar: () => void;
  onAddMember?: (email: string) => void;
  onRemoveMember?: (memberId: string) => void;
  onInvite?: () => void;
  onFilter?: (filters: FilterOptions) => void;
  onBoardAction?: (action: 'settings' | 'copy' | 'archive' | 'background') => void;
  currentFilters?: FilterOptions;
  availableLabels?: { id: string; name: string; color: string }[];
  editable?: boolean;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({
  title,
  description,
  members,
  isStarred,
  onTitleChange,
  onToggleStar,
  onAddMember,
  onRemoveMember,
  onInvite,
  onFilter,
  onBoardAction,
  currentFilters,
  availableLabels,
  editable = true,
}) => {
  // Convert members to available members for filter
  const availableMembers = members.map(member => ({
    id: member.id,
    name: member.name,
  }));

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        px: { xs: 2, sm: 3, md: 4 },
        py: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* Left side - Title and Description */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
          <BoardTitle
            title={title}
            onTitleChange={onTitleChange}
            editable={editable}
          />
          
          {description && (
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: 600,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {description}
            </Typography>
          )}
        </Box>

        {/* Right side - Members and Actions */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flexShrink: 0,
          }}
        >
          <MemberAvatars
            members={members}
            onAddMember={onAddMember}
            onRemoveMember={onRemoveMember}
            editable={editable}
          />

          <BoardActions
            isStarred={isStarred}
            onToggleStar={onToggleStar}
            onInvite={onInvite}
            onFilter={onFilter}
            onBoardAction={onBoardAction}
            currentFilters={currentFilters}
            availableLabels={availableLabels}
            availableMembers={availableMembers}
          />
        </Box>
      </Box>

      {/* Mobile Description */}
      {description && (
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            mt: 1,
            display: { xs: 'block', sm: 'none' },
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default BoardHeader;