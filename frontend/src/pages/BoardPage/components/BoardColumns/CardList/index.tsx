import React from 'react';
import { Box } from '@mui/material';
import CardItem from '../../CardItem';
import type { CardItemData } from '../../../../../types';


interface CardListProps {
  cards: CardItemData[];
  onCardClick?: (card: CardItemData) => void;
  onCardEdit?: (card: CardItemData) => void;
  onCardCopy?: (card: CardItemData) => void;
  onCardMove?: (card: CardItemData) => void;
  onCardArchive?: (card: CardItemData) => void;
  onCardDelete?: (card: CardItemData) => void;
}

const CardList: React.FC<CardListProps> = ({
  cards,
  onCardClick,
  onCardEdit,
  onCardCopy,
  onCardMove,
  onCardArchive,
  onCardDelete,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        maxHeight: { xs: '400px', sm: '500px', md: '600px' },
        overflow: 'auto',
        pr: 0.5,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.24)' : 'rgba(0,0,0,0.2)',
          borderRadius: '3px',
          '&:hover': {
            background: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)',
          },
        },
      }}
    >
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          onClick={onCardClick}
          onEdit={onCardEdit}
          onCopy={onCardCopy}
          onMove={onCardMove}
          onArchive={onCardArchive}
          onDelete={onCardDelete}
          draggable={true}
        />
      ))}
    </Box>
  );
};

export default CardList;
