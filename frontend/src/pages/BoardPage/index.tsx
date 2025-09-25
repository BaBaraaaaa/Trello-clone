import React, { useState } from 'react';
import { Box } from '@mui/material';
import {
  BoardHeader,
  BoardColumns,
  Column,
  CardDetailDialog,
} from './components';
import type { 
  CardItemData,
  CardLabel,
  CardMemberData,
} from './components';

// Mock data với types mới
const mockBoard = {
  id: '1',
  title: 'Website Redesign',
  description: 'Complete website redesign project with modern UI/UX',
  isStarred: true,
  background: 'linear-gradient(135deg, #026AA7 0%, #4A90C2 50%, #5AAC44 100%)',
};

const mockMembers: CardMemberData[] = [
  { id: '1', name: 'John Doe', avatar: '', initials: 'JD' },
  { id: '2', name: 'Jane Smith', avatar: '', initials: 'JS' },
  { id: '3', name: 'Mike Johnson', avatar: '', initials: 'MJ' },
];

const mockLabelsForBoard = [
  { id: '1', name: 'High Priority', color: '#eb5a46' },
  { id: '2', name: 'Design', color: '#f2d600' },
  { id: '3', name: 'Frontend', color: '#0079bf' },
  { id: '4', name: 'Review', color: '#61bd4f' },
  { id: '5', name: 'Setup', color: '#026AA7' },
];

const mockLabelsForCards: CardLabel[] = [
  { id: '1', color: '#eb5a46', text: 'High Priority' },
  { id: '2', color: '#f2d600', text: 'Design' },
  { id: '3', color: '#0079bf', text: 'Frontend' },
  { id: '4', color: '#61bd4f', text: 'Review' },
  { id: '5', color: '#026AA7', text: 'Setup' },
];

const mockColumns = [
  {
    id: 'col-1',
    title: 'To Do',
    cards: [
      {
        id: 'card-1',
        title: 'Research user needs',
        description: 'Conduct user interviews and surveys',
        labels: [{ color: '#eb5a46', text: 'High Priority' }],
        members: [mockMembers[0], mockMembers[1]],
        dueDate: '2025-10-01',
      },
      {
        id: 'card-2',
        title: 'Create wireframes',
        description: 'Design basic layout wireframes',
        labels: [{ color: '#f2d600', text: 'Design' }],
        members: [mockMembers[1]],
        dueDate: '2025-10-05',
      },
    ] as CardItemData[],
  },
  {
    id: 'col-2',
    title: 'In Progress',
    cards: [
      {
        id: 'card-3',
        title: 'Login page design',
        description: 'Create modern login page with animations',
        labels: [
          { color: '#0079bf', text: 'Frontend' },
          { color: '#f2d600', text: 'Design' }
        ],
        members: [mockMembers[0]],
        dueDate: '2025-09-30',
      },
    ] as CardItemData[],
  },
  {
    id: 'col-3',
    title: 'Review',
    cards: [
      {
        id: 'card-4',
        title: 'Homepage mockup',
        description: 'Review and approve homepage design',
        labels: [{ color: '#61bd4f', text: 'Review' }],
        members: [mockMembers[2]],
        dueDate: '2025-09-28',
      },
    ] as CardItemData[],
  },
  {
    id: 'col-4',
    title: 'Done',
    cards: [
      {
        id: 'card-5',
        title: 'Project setup',
        description: 'Initialize project repository and structure',
        labels: [{ color: '#026AA7', text: 'Setup' }],
        members: [mockMembers[0], mockMembers[2]],
        dueDate: '2025-09-20',
      },
    ] as CardItemData[],
  },
];

const BoardPage: React.FC = () => {
  const [board] = useState(mockBoard);
  const [columns, setColumns] = useState(mockColumns);
  const [isStarred, setIsStarred] = useState(board.isStarred);
  const [selectedCard, setSelectedCard] = useState<CardItemData | null>(null);
  const [isCardDetailOpen, setIsCardDetailOpen] = useState(false);

  // Board Header Handlers
  const handleTitleChange = (newTitle: string) => {
    console.log('Board title changed:', newTitle);
  };

  const handleToggleStar = () => {
    setIsStarred(!isStarred);
  };

  const handleAddMember = (email: string) => {
    console.log('Add member:', email);
  };

  const handleRemoveMember = (memberId: string) => {
    console.log('Remove member:', memberId);
  };

  const handleFilter = (filters: unknown) => {
    console.log('Apply filters:', filters);
  };

  const handleBoardAction = (action: string) => {
    console.log('Board action:', action);
  };

  // Column Handlers
  const handleAddColumn = () => {
    console.log('Add new column');
  };

  const handleColumnTitleChange = (columnId: string, newTitle: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, title: newTitle } : col
    ));
  };

  // Card Handlers
  const handleCardClick = (card: CardItemData) => {
    setSelectedCard(card);
    setIsCardDetailOpen(true);
  };

  const handleCardSave = (updatedCard: CardItemData) => {
    setColumns(prev => prev.map(col => ({
      ...col,
      cards: col.cards.map(card => 
        card.id === updatedCard.id ? updatedCard : card
      )
    })));
  };

  const handleCardDelete = (cardId: string) => {
    setColumns(prev => prev.map(col => ({
      ...col,
      cards: col.cards.filter(card => card.id !== cardId)
    })));
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #026AA7 0%, #4A90C2 30%, #5AAC44 70%, #7BC15A 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Board Header */}
      <BoardHeader
        title={board.title}
        description={board.description}
        members={mockMembers}
        isStarred={isStarred}
        onTitleChange={handleTitleChange}
        onToggleStar={handleToggleStar}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
        onFilter={handleFilter}
        onBoardAction={handleBoardAction}
        availableLabels={mockLabelsForBoard}
      />

      {/* Board Columns */}
      <BoardColumns onAddColumn={handleAddColumn}>
        {columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            cards={column.cards}
            onAddCard={() => console.log(`Add card to ${column.id}`)}
            onCardClick={handleCardClick}
            onTitleChange={handleColumnTitleChange}
          />
        ))}
      </BoardColumns>

      {/* Card Detail Dialog */}
      <CardDetailDialog
        open={isCardDetailOpen}
        card={selectedCard}
        boardMembers={mockMembers}
        availableLabels={mockLabelsForCards}
        onClose={() => setIsCardDetailOpen(false)}
        onSave={handleCardSave}
        onDelete={handleCardDelete}
      />
    </Box>
  );
};

export default BoardPage;