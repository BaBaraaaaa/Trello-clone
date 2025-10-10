/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import type {
  Board,
  Column,
  Card,
  Label,
  CardLabel,
  ChecklistItem,
} from "../../types/database";

// Type for board member API response with populated user info
interface BoardMemberResponse {
  id: string;
  boardId: string;
  userId: {
    fullName: string;
    avatarUrl?: string;
    initials: string;
  };
  role: "owner" | "admin" | "member" | "observer";
  isStarred: boolean;
  joinedAt: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "Board",
    "Column",
    "Card",
    "Label",
    "CardLabel",
    "BoardMember",
    "ChecklistItem",
  ],
  endpoints: (build) => ({
    // Boards endpoints
    getBoards: build.query<Board[], void>({
      query: () => ({ url: "/boards", method: "GET" }),
      transformResponse: (response: unknown): Board[] => {
        if (Array.isArray(response)) {
          // Map backend `_id` to `id`
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (response as any[]).map((b: any) => ({ ...b, id: b._id }));
        }
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Board" as const, id })),
              { type: "Board", id: "LIST" },
            ]
          : [{ type: "Board", id: "LIST" }],
    }),
    getBoard: build.query<Board, string>({
      query: (id) => ({ url: `/boards/${id}`, method: "GET" }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any): Board => ({
        ...response,
        id: response._id,
      }),
      providesTags: (_result, _error, id) => [{ type: "Board", id }],
    }),
    addBoard: build.mutation<Board, Partial<Board>>({
      query: (data) => ({ url: "/boards", method: "POST", data }),
      invalidatesTags: [{ type: "Board", id: "LIST" }],
    }),
    updateBoard: build.mutation<Board, { id: string; data: Partial<Board> }>({
      query: ({ id, data }) => ({ url: `/boards/${id}`, method: "PUT", data }),
      invalidatesTags: (result, error, { id }) => [{ type: "Board", id }],
    }),
    deleteBoard: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/boards/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [{ type: "Board", id }],
    }),

    // Columns endpoints
    getColumns: build.query<Column[], string>({
      query: (boardId) => ({ url: `/columns/board/${boardId}`, method: "GET" }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any[]): Column[] =>
        response.map((col) => ({ ...col, id: col._id })),
      providesTags: (result, _error, boardId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Column" as const, id })),
              { type: "Column", id: `BOARD_${boardId}` },
            ]
          : [{ type: "Column", id: `BOARD_${boardId}` }],
    }),
    addColumn: build.mutation<Column, Partial<Column>>({
      query: (data) => ({ url: "/columns", method: "POST", data }),
      invalidatesTags: (result) =>
        result
          ? [{ type: "Column", id: `BOARD_${String(result.boardId)}` }]
          : [],
    }),
    updateColumn: build.mutation<Column, { id: string; data: Partial<Column> }>(
      {
        query: ({ id, data }) => ({
          url: `/columns/${id}`,
          method: "PUT",
          data,
        }),
        invalidatesTags: (result) =>
          result ? [{ type: "Column", id: result.id }] : [],
      }
    ),
    deleteColumn: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/columns/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [{ type: "Column", id }],
    }),

    // Cards endpoints
    getCards: build.query<Card[], string>({
      query: (columnId) => ({
        url: `/cards/column/${columnId}`,
        method: "GET",
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any[]): Card[] =>
        response.map((card) => ({ ...card, id: card._id })),
      providesTags: (result, _error, columnId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Card" as const, id })),
              { type: "Card", id: `COLUMN_${columnId}` },
            ]
          : [{ type: "Card", id: `COLUMN_${columnId}` }],
    }),
    addCard: build.mutation<Card, Partial<Card>>({
      query: (data) => ({ url: "/cards", method: "POST", data }),
      invalidatesTags: (result) =>
        result
          ? [{ type: "Card", id: `COLUMN_${String(result.columnId)}` }]
          : [],
    }),
    updateCard: build.mutation<Card, { id: string; data: Partial<Card> }>({
      query: ({ id, data }) => ({ url: `/cards/${id}`, method: "PUT", data }),
      invalidatesTags: (result) =>
        result ? [{ type: "Card", id: result.id }] : [],
    }),
    deleteCard: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/cards/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [{ type: "Card", id }],
    }),

    // Labels endpoints
    getLabels: build.query<Label[], string>({
      query: (boardId) => ({ url: `/labels/board/${boardId}`, method: "GET" }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any[]): Label[] =>
        response.map((label) => ({ ...label, id: label._id })),
      providesTags: (result, _error, boardId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Label" as const, id })),
              { type: "Label", id: `BOARD_${boardId}` },
            ]
          : [{ type: "Label", id: `BOARD_${boardId}` }],
    }),
    addLabel: build.mutation<Label, Partial<Label>>({
      query: (data) => ({ url: "/labels", method: "POST", data }),
      invalidatesTags: (result) =>
        result
          ? [{ type: "Label", id: `BOARD_${String(result.boardId)}` }]
          : [],
    }),
    updateLabel: build.mutation<Label, { id: string; data: Partial<Label> }>({
      query: ({ id, data }) => ({ url: `/labels/${id}`, method: "PUT", data }),
      invalidatesTags: (result) =>
        result ? [{ type: "Label", id: result.id }] : [],
    }),
    deleteLabel: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/labels/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [{ type: "Label", id }],
    }),

    // CardLabels endpoints (labels assigned to a card)
    getCardLabels: build.query<{ id: string; name: string; color: string }[], string>({
      query: (cardId) => ({ url: `/card-labels/card/${cardId}`, method: 'GET' }),
      transformResponse: (response: any[]): { id: string; name: string; color: string }[] =>
        response.map(l => ({ id: l.id, name: l.name, color: l.color })),
      providesTags: (labels, _error, cardId) =>
        labels
          ? [
              ...labels.map(({ id }) => ({ type: 'CardLabel' as const, id })),
              { type: 'CardLabel', id: `CARD_${cardId}` },
            ]
          : [{ type: 'CardLabel', id: `CARD_${cardId}` }],
    }),
    addCardLabel: build.mutation<
      CardLabel,
      { cardId: string; labelId: string }
    >({
      query: (data) => ({ url: "/card-labels", method: "POST", data }),
      invalidatesTags: (result) =>
        result
          ? [{ type: "CardLabel", id: `CARD_${String(result.cardId)}` }]
          : [],
    }),
    deleteCardLabel: build.mutation<{ message: string }, { cardId: string; labelId: string }>({
      query: ({ cardId, labelId }) => ({ url: `/card-labels/card/${cardId}/label/${labelId}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, { cardId }) => [{ type: 'CardLabel', id: `CARD_${cardId}` }],
    }),
    // BoardMembers endpoints
    getBoardMembers: build.query<BoardMemberResponse[], string>({
      query: (boardId) => ({
        url: `/board-members/board/${boardId}`,
        method: "GET",
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any[]): BoardMemberResponse[] =>
        response.map((m) => ({ ...m, id: m._id })),
      providesTags: (result, _error, boardId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "BoardMember" as const, id })),
              { type: "BoardMember", id: `BOARD_${boardId}` },
            ]
          : [{ type: "BoardMember", id: `BOARD_${boardId}` }],
    }),
    addBoardMember: build.mutation<
      BoardMemberResponse,
      { boardId: string; userId: string }
    >({
      query: ({ boardId, userId }) => ({
        url: "/board-members",
        method: "POST",
        data: { boardId, userId },
      }),
      invalidatesTags: (result) =>
        result
          ? [{ type: "BoardMember", id: `BOARD_${String(result.boardId)}` }]
          : [],
    }),
    deleteBoardMember: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/board-members/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [{ type: "BoardMember", id }],
    }),
    // Checklist endpoints
    getChecklists: build.query<ChecklistItem[], string>({
      query: (cardId) => ({ url: `/checklists/card/${cardId}`, method: "GET" }),
      transformResponse: (response: any): ChecklistItem[] => response.map((item: any) => ({ ...item, id: item._id })),
      providesTags: (result, _error, cardId) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "ChecklistItem" as const,
                id,
              })),
              { type: "ChecklistItem", id: `CARD_${cardId}` },
            ]
          : [{ type: "ChecklistItem", id: `CARD_${cardId}` }],
    }),
    addChecklistItem: build.mutation<ChecklistItem, Partial<ChecklistItem>>({
      query: (data) => ({ url: "/checklists", method: "POST", data }),
      invalidatesTags: (result) =>
        result
          ? [{ type: "ChecklistItem", id: `CARD_${String(result.cardId)}` }]
          : [],
    }),
    updateChecklistItem: build.mutation<
      ChecklistItem,
      { id: string; data: Partial<ChecklistItem> }
    >({
      query: ({ id, data }) => ({
        url: `/checklists/${id}`,
        method: "PUT",
        data,
      }),
      transformResponse: (response: any): ChecklistItem => ({
        ...response,
        id: response._id,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "ChecklistItem", id: result.id }] : [],
    }),
    deleteChecklistItem: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/checklists/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [{ type: "ChecklistItem", id }],
    }),
  }),
});

export const {
  useGetBoardsQuery,
  useGetBoardQuery,
  useAddBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,

  useGetColumnsQuery,
  useAddColumnMutation,
  useUpdateColumnMutation,
  useDeleteColumnMutation,

  useGetCardsQuery,
  useAddCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,

  useGetLabelsQuery,
  useAddLabelMutation,
  useUpdateLabelMutation,
  useDeleteLabelMutation,

  useGetCardLabelsQuery,
  useAddCardLabelMutation,
  useDeleteCardLabelMutation,
  // BoardMembers hooks
  useGetBoardMembersQuery,
  useAddBoardMemberMutation,
  useDeleteBoardMemberMutation,
  // Checklist hooks
  useGetChecklistsQuery,
  useAddChecklistItemMutation,
  useUpdateChecklistItemMutation,
  useDeleteChecklistItemMutation,
} = api;
