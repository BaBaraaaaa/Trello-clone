import { createSlice } from '@reduxjs/toolkit';
import { mockDatabase } from '../../../mock-database';
import type {
  Board as DbBoard,
  Column as DbColumn,
  Card as DbCard,
  Label as DbLabel,
  CardLabel as DbCardLabel,
} from '../types/database';

interface MockDataState {
  version: number;
}

const initialState: MockDataState = {
  version: 0,
};

const mockDataSlice = createSlice({
  name: 'mockData',
  initialState,
  reducers: {
    bump(state) {
      state.version += 1;
    },
  },
});

// Expose selectors that always read from mockDatabase
export const selectVersion = (state: { mockData: MockDataState }) => state.mockData.version;
export const selectBoards = (): DbBoard[] => mockDatabase.boards;
export const selectBoardById = (boardId: string): DbBoard | undefined => mockDatabase.boards.find(b => b.id === boardId);
export const selectColumns = (boardId: string): DbColumn[] => mockDatabase.columns.filter(c => c.boardId === boardId);
export const selectCards = (columnId: string): DbCard[] => mockDatabase.cards.filter(c => c.columnId === columnId);
export const selectLabels = (boardId: string): DbLabel[] => mockDatabase.labels.filter(l => l.boardId === boardId);
export const selectCardLabels = (cardId: string): DbCardLabel[] => mockDatabase.cardLabels.filter(cl => cl.cardId === cardId);

// Re-export mockDatabase methods and dispatch bump action
export const { bump } = mockDataSlice.actions;
export const mockApi = {
  getBoardById: (boardId: string) => {
    const board = selectBoardById(boardId);
    return board;
  },
  getBoardLabels: (boardId: string) => selectLabels(boardId),
  getColumnsWithCards: (boardId: string) => {
    return selectColumns(boardId).map(col => ({
      ...col,
      cards: selectCards(col.id),
    }));
  },
  updateBoardTitle: (boardId: string, title: string) => {
    const board = mockDatabase.boards.find(b => b.id === boardId);
    if (board) {
      board.title = title;
      board.updatedAt = new Date();
      mockDataSlice.caseReducers.bump(initialState);
    }
  },
  // ...add other methods similarly
};

export default mockDataSlice.reducer;