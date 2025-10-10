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
import {
  useGetBoardQuery,
  useGetColumnsQuery,
  useGetLabelsQuery,
  useGetCardsQuery,
  useGetBoardMembersQuery,
  useAddBoardMemberMutation,
  useDeleteBoardMemberMutation,
  useAddColumnMutation,
  useUpdateColumnMutation,
  useAddCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
  useDeleteColumnMutation,
} from "../../services/api/apiSlice";

const BoardPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const bid = boardId!;

  // RTK Query hooks
  const {
    data: board,
    isLoading: loadingBoard,
    error: boardError,
  } = useGetBoardQuery(bid);
  const {
    data: columns = [],
    isLoading: loadingCols,
    error: colsError,
  } = useGetColumnsQuery(bid);
  const {
    data: labels = [],
    isLoading: loadingLabels,
    error: labelsError,
  } = useGetLabelsQuery(bid);
  // Board members
  const {
    data: members = [],
    isLoading: loadingMembers,
    error: membersError,
  } = useGetBoardMembersQuery(bid);

  const [addMember] = useAddBoardMemberMutation();
  const [removeMember] = useDeleteBoardMemberMutation();
  const [addColumn] = useAddColumnMutation();
  const [updateColumn] = useUpdateColumnMutation();
  const [addCard] = useAddCardMutation();
  const [updateCard] = useUpdateCardMutation();
  const [deleteCard] = useDeleteCardMutation();
  const [deleteColumn] = useDeleteColumnMutation();

  const [selectedCard, setSelectedCard] = useState<CardItemData | null>(null);
  const [isCardDetailOpen, setIsCardDetailOpen] = useState(false);

  // Column component that fetches cards via RTK Query
  const ColumnWithCards: React.FC<{ col: (typeof columns)[number] }> = ({
    col,
  }) => {
    const {
      data: rawCards = [],
      isLoading: loadingCards,
      error: cardsError,
    } = useGetCardsQuery(col.id);
    const cards = rawCards.map((card) => ({
      id: card.id,
      title: card.title,
      description: card.description,
      labels: [],
      members: [],
      dueDate: card.dueDate?.toString(),
    }));
    if (loadingCards) return <Typography>Loading cards...</Typography>;
    if (cardsError) return <Typography>Error loading cards</Typography>;
    const handleChangeTitle = (columnId: string, newTitle: string) => {
      if (!newTitle.trim()) {
        return console.warn("Column title cannot be empty.");
      }
      try {
        updateColumn({
          id: columnId,
          data: { title: newTitle.trim() },
        }).unwrap();
      } catch (error) {
        console.error("Update column failed", error);
      }
    };
    return (
      <Column
        id={col.id}
        title={col.title}
        cards={cards}
        // Card actions
        onAddCard={(columnId, title) =>
          addCard({ columnId, boardId: bid, title })
        }
        onCardClick={(card) => {
          setSelectedCard(card);
          setIsCardDetailOpen(true);
        }}
        onCardEdit={(card) => {
          const newTitle = window.prompt("Edit card title", card.title);
          if (newTitle && newTitle.trim())
            updateCard({
              id: card.id,
              data: { title: newTitle.trim(), description: card.description },
            });
        }}
        onCardCopy={(card) =>
          addCard({
            columnId: col.id,
            boardId: bid,
            title: card.title + " (Copy)",
          })
        }
        onCardMove={(card) => {
          const target = window.prompt("Enter target column ID to move card:");
          if (target) updateCard({ id: card.id, data: { columnId: target } });
        }}
        onCardArchive={(card) =>
          updateCard({ id: card.id, data: { isArchived: true } })
        }
        onCardDelete={(card) => deleteCard(card.id)}
        // Column actions
        onTitleChange={handleChangeTitle}
        onCopyColumn={() =>
          addColumn({ boardId: bid, title: col.title + " (Copy)" })
        }
        onArchiveColumn={() =>
          updateColumn({ id: col.id, data: { isArchived: true } })
        }
        onDeleteColumn={() => deleteColumn(col.id)}
      />
    );
  };

  if (loadingBoard || loadingCols || loadingLabels || loadingMembers)
    return <Typography>Loading board...</Typography>;
  if (boardError || colsError || labelsError || membersError || !board)
    return <Typography>Error loading board data</Typography>;
  const handleCardSave = (card: CardItemData) => {
    // To implement: Save card changes
    console.log(card);
    try{
    updateCard({ id: card.id, data: { title: card?.title, description: card?.description } });

    } catch (error) {
    console.error("Update card failed", error);
    }
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
        availableLabels={labels.map((l) => ({
          id: l.id,
          name: l.name,
          color: l.color,
        }))}
      />

      {/* Board Columns */}
      <BoardColumns
        onAddColumn={() => {
          const title = window.prompt("Enter new column title:");
          if (title) {
            addColumn({ boardId: bid, title });
          }
        }}
      >
        {columns.map((col) => (
          <ColumnWithCards key={col.id} col={col} />
        ))}
      </BoardColumns>

      {/* Card Detail Dialog */}
      <CardDetailDialog
        boardId={bid}
        open={isCardDetailOpen}
        card={selectedCard}
        onClose={() => setIsCardDetailOpen(false)}
        onSave={handleCardSave}
        boardMembers={[]} // To implement
        availableLabels={labels.map((l) => ({
          id: l.id,
          name: l.name,
          color: l.color,
        }))}
      />
    </Box>
  );
};

export default BoardPage;
