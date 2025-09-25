import React from 'react';
import { Box } from '@mui/material';
import ColumnHeader from './ColumnHeader';
import CardList from './CardList';
import AddCardButton from './AddCardButton';
import type { CardItemData } from '../CardItem';

interface ColumnProps {
  id: string;
  title: string;
  cards: CardItemData[];
  onAddCard?: (columnId: string) => void;
  onCardClick?: (card: CardItemData) => void;
  onCardEdit?: (card: CardItemData) => void;
  onCardCopy?: (card: CardItemData) => void;
  onCardMove?: (card: CardItemData) => void;
  onCardArchive?: (card: CardItemData) => void;
  onCardDelete?: (card: CardItemData) => void;
  onTitleChange?: (columnId: string, newTitle: string) => void;
  onCopyColumn?: (columnId: string) => void;
  onArchiveColumn?: (columnId: string) => void;
  onDeleteColumn?: (columnId: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  id,
  title,
  cards,
  onAddCard,
  onCardClick,
  onCardEdit,
  onCardCopy,
  onCardMove,
  onCardArchive,
  onCardDelete,
  onTitleChange,
  onCopyColumn,
  onArchiveColumn,
  onDeleteColumn,
}) => {
  const handleAddCard = (cardTitle: string) => {
    if (onAddCard) {
      console.log(`Adding card "${cardTitle}" to column ${id}`);
      // TODO: Implement actual card creation
    }
  };

  return (
    <Box
      sx={{
        minWidth: { xs: 260, sm: 280 },
        maxWidth: { xs: 260, sm: 280 },
        width: { xs: 260, sm: 280 },
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: { 
          xs: 'calc(100vh - 180px)', 
          sm: 'calc(100vh - 200px)',
          md: 'calc(100vh - 220px)'
        },
        flexShrink: 0,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          pointerEvents: 'none',
        },
        '&:hover': {
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-2px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Column Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
        <ColumnHeader
          title={title}
          cardCount={cards.length}
          onTitleChange={(newTitle) => onTitleChange?.(id, newTitle)}
          onAddCard={() => onAddCard?.(id)}
          onCopyColumn={() => onCopyColumn?.(id)}
          onArchiveColumn={() => onArchiveColumn?.(id)}
          onDeleteColumn={() => onDeleteColumn?.(id)}
        />
      </Box>

      {/* Cards List */}
      <Box sx={{ flex: 1, p: 1 }}>
        <CardList
          cards={cards}
          onCardClick={onCardClick}
          onCardEdit={onCardEdit}
          onCardCopy={onCardCopy}
          onCardMove={onCardMove}
          onCardArchive={onCardArchive}
          onCardDelete={onCardDelete}
        />
      </Box>

      {/* Add Card Button */}
      <Box sx={{ p: 1 }}>
        <AddCardButton
          onAddCard={handleAddCard}
        />
      </Box>
    </Box>
  );
};

export default Column;