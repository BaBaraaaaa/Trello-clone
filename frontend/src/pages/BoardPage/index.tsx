import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  BoardHeader,
  BoardColumns,
  Column,
  CardDetailDialog,
} from "./components";
import type { CardItemData } from "../../types";
import { useBoardData, useMockDB } from "../../contexts/MockDBContext";

// Note: Card labels for UI are derived from board labels below; no local mock needed.

const BoardPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const boardData = useBoardData(boardId || "");
  const {
    updateBoardTitle,
    addColumn,
    updateColumnTitle,
    addCard,
    updateCard,
    deleteCard,
    archiveCard,
    copyCard,
    moveCard,
  } = useMockDB();

  const [board, setBoard] = useState({
    id: "",
    title: "",
    description: "",
    isStarred: false,
    background: "",
  });

  const [columns, setColumns] = useState<
    {
      id: string;
      title: string;
      cards: CardItemData[];
    }[]
  >([]);

  // Sync local state when route or data changes
  useEffect(() => {
    if (!boardData) return;
    setBoard({
      id: boardData.board.id,
      title: boardData.board.title,
      description: boardData.board.description || "",
      isStarred: false,
      background: boardData.board.backgroundValue,
    });
    setColumns(boardData.columns);
  }, [boardId, boardData]);
  const [isStarred, setIsStarred] = useState(board.isStarred);
  const [selectedCard, setSelectedCard] = useState<CardItemData | null>(null);
  const [isCardDetailOpen, setIsCardDetailOpen] = useState(false);

  // Board Header Handlers
  const handleTitleChange = (newTitle: string) => {
    if (board.id) {
      updateBoardTitle(board.id, newTitle);
      setBoard((prev) => ({ ...prev, title: newTitle }));
    }
  };

  const handleToggleStar = () => {
    setIsStarred(!isStarred);
  };

  const handleAddMember = (email: string) => {
    console.log("Add member:", email);
  };

  const handleRemoveMember = (memberId: string) => {
    console.log("Remove member:", memberId);
  };

  const handleFilter = (filters: unknown) => {
    console.log("Apply filters:", filters);
  };

  const handleBoardAction = (action: string) => {
    console.log("Board action:", action);
  };

  // Column Handlers
  const handleAddColumn = () => {
    if (!board.id) return;
    const index = (columns?.length || 0) + 1;
    const title = `List ${index}`;
    addColumn(board.id, title);
  };

  const handleColumnTitleChange = (columnId: string, newTitle: string) => {
    updateColumnTitle(columnId, newTitle);
  };

  // Card Handlers
  const handleCardClick = (card: CardItemData) => {
    setSelectedCard(card);
    setIsCardDetailOpen(true);
  };

  const handleCardSave = (updatedCard: CardItemData) => {
    updateCard(updatedCard.id, {
      title: updatedCard.title,
      description: updatedCard.description,
      dueDate: updatedCard.dueDate,
    });
  };

  const handleCardDelete = (cardId: string) => {
    deleteCard(cardId);
  };

  const handleCardCopy = (card: CardItemData) => {
    copyCard(card.id);
    console.log("Card copied:", card.id);
  };

  const handleCardArchive = (card: CardItemData) => {
    archiveCard(card.id);
  };

  const handleCardMove = (card: CardItemData) => {
    // Simple heuristic: move to the next column, or wrap to first
    if (!boardData) return;
    const cols = boardData.columns;
    const currentIdx = cols.findIndex(c => c.cards.some(cd => cd.id === card.id));
    if (currentIdx === -1) return;
    const targetIdx = (currentIdx + 1) % cols.length;
    const targetColumnId = cols[targetIdx].id;
    moveCard(card.id, targetColumnId);
  };

  if (!boardData) {
    return (
      <Box sx={{ p: 3, bgcolor: "background.default", color: "text.primary" }}>
        Board not found
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
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
        availableLabels={boardData.labels.map((l) => ({
          id: l.id,
          name: l.text,
          color: l.color,
        }))}
      />

      {/* Board Columns */}
      <BoardColumns onAddColumn={handleAddColumn}>
        {columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            cards={column.cards}
            onAddCard={(colId, title) => addCard(colId, { title })}
            onCardClick={handleCardClick}
            onCardEdit={handleCardClick}
            onCardCopy={handleCardCopy}
            onCardMove={handleCardMove}
            onCardArchive={handleCardArchive}
            onCardDelete={(c) => handleCardDelete(c.id)}
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
