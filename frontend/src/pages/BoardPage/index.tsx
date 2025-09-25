import React, { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import {
  BoardHeader,
  BoardColumns,
  Column,
  CardDetailDialog,
} from './components';
import type { CardItemData } from '../../types';
import { mockDatabase } from '../../../../mock-database';

// Note: Card labels for UI are derived from board labels below; no local mock needed.

const BoardPage: React.FC = () => {
  // Get data from mock database
  const boardData = useMemo(() => {
    const board = mockDatabase.boards[0]; // Use first board for demo
    const boardMembers = mockDatabase.getBoardMembers(board.id);
    const columns = mockDatabase.getBoardColumns(board.id);

    return {
      board,
      members: boardMembers.map(bm => ({
        id: bm.user!.id,
        name: bm.user!.fullName,
        avatar: bm.user!.avatarUrl || '',
        initials: bm.user!.initials,
      })),
      columns: columns.map(col => ({
        id: col.id,
        title: col.title,
        cards: mockDatabase.getColumnCards(col.id).map(card => {
          const labels = mockDatabase.cardLabels
            .filter(cl => cl.cardId === card.id)
            .map(cl => mockDatabase.labels.find(l => l.id === cl.labelId))
            .filter(Boolean)
            .map(label => ({
              id: label!.id,
              color: label!.color,
              text: label!.name,
            }));

          const members = mockDatabase.cardMembers
            .filter(cm => cm.cardId === card.id)
            .map(cm => mockDatabase.users.find(u => u.id === cm.userId))
            .filter(Boolean)
            .map(user => ({
              id: user!.id,
              name: user!.fullName,
              avatar: user!.avatarUrl || '',
              initials: user!.initials,
            }));

          return {
            id: card.id,
            title: card.title,
            description: card.description || '',
            labels,
            members,
            dueDate: card.dueDate?.toISOString().split('T')[0] || '',
          };
        }),
      })),
      labels: mockDatabase.getBoardLabels(board.id).map(label => ({
        id: label.id,
        text: label.name,
        color: label.color,
      })),
    };
  }, []);

  const [board] = useState({
    id: boardData.board.id,
    title: boardData.board.title,
    description: boardData.board.description || '',
    isStarred: false, // Mock starred status
    background: boardData.board.backgroundValue,
  });

  const [columns, setColumns] = useState<{
    id: string;
    title: string;
    cards: CardItemData[];
  }[]>(boardData.columns);
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
        members={boardData.members}
        isStarred={isStarred}
        onTitleChange={handleTitleChange}
        onToggleStar={handleToggleStar}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
        onFilter={handleFilter}
        onBoardAction={handleBoardAction}
        availableLabels={boardData.labels.map(l => ({ id: l.id, name: l.text, color: l.color }))}
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
        boardMembers={boardData.members}
  availableLabels={boardData.labels}
        onClose={() => setIsCardDetailOpen(false)}
        onSave={handleCardSave}
        onDelete={handleCardDelete}
      />
    </Box>
  );
};

export default BoardPage;