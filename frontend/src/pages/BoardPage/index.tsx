import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  BoardHeader,
  BoardColumns,
  Column,
  CardDetailDialog,
} from "./components";
import type { CardItemData } from "../../types";
// Type for board members API response (populated userId)
type MemberResponse = {
  id: string;
  userId: { fullName: string; avatarUrl?: string; initials: string };
};
import { useGetBoardQuery,
  useGetColumnsQuery,
  useGetLabelsQuery,
  useGetCardsQuery,
  useGetBoardMembersQuery,
  useAddBoardMemberMutation,
  useDeleteBoardMemberMutation
} from "../../services/api/apiSlice";


const BoardPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const bid = boardId!;

  // RTK Query hooks
  const { data: board, isLoading: loadingBoard, error: boardError } = useGetBoardQuery(bid);
  const { data: columns = [], isLoading: loadingCols, error: colsError } = useGetColumnsQuery(bid);
  const { data: labels = [] } = useGetLabelsQuery(bid);
  // Board members
  const boardMembersQuery = useGetBoardMembersQuery(bid);
  const members: MemberResponse[] = boardMembersQuery.data ?? [];
  const [addMember] = useAddBoardMemberMutation();
  const [removeMember] = useDeleteBoardMemberMutation();

  const [selectedCard, setSelectedCard] = useState<CardItemData | null>(null);
  const [isCardDetailOpen, setIsCardDetailOpen] = useState(false);

  // Column component that fetches cards via RTK Query
  const ColumnWithCards: React.FC<{ col: typeof columns[number] }> = ({ col }) => {
    const { data: rawCards = [], isLoading: loadingCards, error: cardsError } = useGetCardsQuery(col.id);
    const cards = rawCards.map(card => ({
      id: card.id,
      title: card.title,
      description: card.description,
      labels: [],
      members: [],
      dueDate: card.dueDate?.toString(),
    }));
    if (loadingCards) return <Typography>Loading cards...</Typography>;
    if (cardsError) return <Typography>Error loading cards</Typography>;
    return (
      <Column
        id={col.id}
        title={col.title}
        cards={cards}
        onAddCard={() => console.log("Add card to", col.id)}
        onCardClick={(card) => { setSelectedCard(card); setIsCardDetailOpen(true); }}
        onCardEdit={(card) => console.log("Edit card", card)}
        onCardCopy={(card) => console.log("Copy card", card)}
        onCardMove={(card) => console.log("Move card", card)}
        onCardArchive={(card) => console.log("Archive card", card)}
        onCardDelete={(card) => console.log("Delete card", card)}
        onTitleChange={(id, title) => console.log("Column title change", id, title)}
      />
    );
  };

  if (loadingBoard || loadingCols) return <Typography>Loading...</Typography>;
  if (boardError || colsError || !board) return <Typography>Error loading board</Typography>;

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
        description={board.description || ""}
        members={members.map((m: MemberResponse) => ({
          id: m.id,
          name: m.userId.fullName,
          avatar: m.userId.avatarUrl,
          initials: m.userId.initials,
        }))}
        isStarred={false}
        onTitleChange={(newTitle) => console.log("Title change", newTitle)}
        onToggleStar={() => console.log("Toggle star")}
        onAddMember={(userId) => addMember({ boardId: bid, userId })}
        onRemoveMember={(id) => removeMember(id)}
        onFilter={(filters) => console.log("Filter", filters)}
        onBoardAction={(action) => console.log("Board action", action)}
        availableLabels={labels.map((l) => ({ id: l.id, name: l.name, color: l.color }))}
      />

      {/* Board Columns */}
      <BoardColumns onAddColumn={() => console.log("Add column")}>   
        {columns.map(col => (
          <ColumnWithCards key={col.id} col={col} />
        ))}
      </BoardColumns>

      {/* Card Detail Dialog */}
      <CardDetailDialog
        open={isCardDetailOpen}
        card={selectedCard}
        onClose={() => setIsCardDetailOpen(false)}
        onSave={(card) => console.log("Save card", card)}
        boardMembers={[]} // To implement
        availableLabels={labels.map((l) => ({ id: l.id, name: l.name, color: l.color }))}
      />
    </Box>
  );
};

export default BoardPage;
