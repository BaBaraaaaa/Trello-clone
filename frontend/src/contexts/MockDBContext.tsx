/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { mockDatabase } from '../../../mock-database';
import type { Board as DbBoard, Card as DbCard } from '../types';

// UI DTOs
export interface UiCardLabel { id: string; text: string; color: string }
export interface UiCardMember { id: string; name: string; avatar?: string; initials: string }
export interface UiCardItem {
  id: string;
  title: string;
  description?: string;
  labels?: UiCardLabel[];
  members?: UiCardMember[];
  dueDate?: string;
}
export interface UiColumn { id: string; title: string; cards: UiCardItem[] }
export interface UiBoardHeaderLabel { id: string; name: string; color: string }

interface MockDBApi {
  db: typeof mockDatabase;
  version: number; // increases on every mutation to trigger consumers to recompute
  // Basic selectors
  getBoardById: (boardId: string) => DbBoard | undefined;
  getBoardMembers: (boardId: string) => UiCardMember[];
  getBoardLabels: (boardId: string) => UiBoardHeaderLabel[];
  getColumnsWithCards: (boardId: string) => UiColumn[];
  // Mutations (minimal for BoardPage actions)
  updateBoardTitle: (boardId: string, title: string) => void;
  addColumn: (boardId: string, title: string) => string; // returns new column id
  updateColumnTitle: (columnId: string, title: string) => void;
  addCard: (columnId: string, data: { title: string; description?: string; dueDate?: string }) => string; // returns new card id
  updateCard: (cardId: string, data: { title?: string; description?: string; dueDate?: string }) => void;
  deleteCard: (cardId: string) => void;
  archiveCard: (cardId: string) => void;
  copyCard: (cardId: string, targetColumnId?: string) => string | null;
  moveCard: (cardId: string, targetColumnId: string, targetPosition?: number) => void;
  // Labels on card
  addLabelToCard: (cardId: string, labelId: string) => void;
  removeLabelFromCard: (cardId: string, labelId: string) => void;
  toggleCardLabel: (cardId: string, labelId: string) => void;
}

const MockDBContext = createContext<MockDBApi | null>(null);

export const MockDBProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [version, setVersion] = useState(0);

  const bump = useCallback(() => setVersion(v => v + 1), []);

  const updateBoardTitle = useCallback((boardId: string, title: string) => {
    const board = mockDatabase.boards.find(b => b.id === boardId);
    if (board) {
      board.title = title;
      board.updatedAt = new Date();
      bump();
    }
  }, [bump]);

  const addColumn = useCallback((boardId: string, title: string) => {
    const position = Math.max(-1, ...mockDatabase.columns.filter(c => c.boardId === boardId).map(c => c.position)) + 1;
    const id = `column-${Date.now()}`;
    mockDatabase.columns.push({
      id,
      boardId,
      title,
      position,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    bump();
    return id;
  }, [bump]);

  const updateColumnTitle = useCallback((columnId: string, title: string) => {
    const col = mockDatabase.columns.find(c => c.id === columnId);
    if (col) {
      col.title = title;
      col.updatedAt = new Date();
      bump();
    }
  }, [bump]);

  const addCard = useCallback((columnId: string, data: { title: string; description?: string; dueDate?: string }) => {
    const position = Math.max(-1, ...mockDatabase.cards.filter(c => c.columnId === columnId).map(c => c.position)) + 1;
    const id = `card-${Date.now()}`;
    const newCard: DbCard = {
      id,
      columnId,
      title: data.title,
      description: data.description,
      position,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      isCompleted: false,
      isArchived: false,
      createdBy: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as DbCard;
    mockDatabase.cards.push(newCard);
    bump();
    return id;
  }, [bump]);

  const updateCard = useCallback((cardId: string, data: { title?: string; description?: string; dueDate?: string }) => {
    const card = mockDatabase.cards.find(c => c.id === cardId);
    if (card) {
      if (data.title !== undefined) card.title = data.title;
      if (data.description !== undefined) card.description = data.description;
      if (data.dueDate !== undefined) card.dueDate = data.dueDate ? new Date(data.dueDate) : undefined;
      card.updatedAt = new Date();
      bump();
    }
  }, [bump]);

  const deleteCard = useCallback((cardId: string) => {
    const idx = mockDatabase.cards.findIndex(c => c.id === cardId);
    if (idx !== -1) {
      mockDatabase.cards.splice(idx, 1);
      // Clean related joins
      mockDatabase.cardMembers = mockDatabase.cardMembers.filter(cm => cm.cardId !== cardId);
      mockDatabase.cardLabels = mockDatabase.cardLabels.filter(cl => cl.cardId !== cardId);
      mockDatabase.comments = mockDatabase.comments.filter(c => c.cardId !== cardId);
      mockDatabase.attachments = mockDatabase.attachments.filter(a => a.cardId !== cardId);
      mockDatabase.checklists = mockDatabase.checklists.filter(ch => ch.cardId !== cardId);
      bump();
    }
  }, [bump]);

  const archiveCard = useCallback((cardId: string) => {
    const card = mockDatabase.cards.find(c => c.id === cardId);
    if (card) {
      card.isArchived = true;
      card.updatedAt = new Date();
      bump();
    }
  }, [bump]);

  const copyCard = useCallback((cardId: string, targetColumnId?: string) => {
    const source = mockDatabase.cards.find(c => c.id === cardId);
    if (!source) return null;
    const columnId = targetColumnId ?? source.columnId;
    const position = Math.max(-1, ...mockDatabase.cards.filter(c => c.columnId === columnId).map(c => c.position)) + 1;
    const id = `card-${Date.now()}-copy`;
    const clone: DbCard = {
      ...source,
      id,
      columnId,
      position,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as DbCard;
    mockDatabase.cards.push(clone);
    // duplicate joins
    const labelLinks = mockDatabase.cardLabels.filter(cl => cl.cardId === cardId);
    labelLinks.forEach(cl => mockDatabase.cardLabels.push({ ...cl, id: `cl-${id}-${cl.labelId}`, cardId: id, createdAt: new Date() }));
    const memberLinks = mockDatabase.cardMembers.filter(cm => cm.cardId === cardId);
    memberLinks.forEach(cm => mockDatabase.cardMembers.push({ ...cm, id: `cm-${id}-${cm.userId}`, cardId: id, assignedAt: new Date() }));
    bump();
    return id;
  }, [bump]);

  const moveCard = useCallback((cardId: string, targetColumnId: string, targetPosition?: number) => {
    const card = mockDatabase.cards.find(c => c.id === cardId);
    if (!card) return;
    card.columnId = targetColumnId;
    const siblings = mockDatabase.cards.filter(c => c.columnId === targetColumnId && c.id !== cardId);
    const pos = targetPosition !== undefined ? targetPosition : (Math.max(-1, ...siblings.map(c => c.position)) + 1);
    card.position = pos;
    card.updatedAt = new Date();
    bump();
  }, [bump]);

  // Labels on card
  const addLabelToCard = useCallback((cardId: string, labelId: string) => {
    const exists = mockDatabase.cardLabels.some(cl => cl.cardId === cardId && cl.labelId === labelId);
    if (exists) return;
    const id = `cl-${cardId}-${labelId}`;
    mockDatabase.cardLabels.push({ id, cardId, labelId, createdAt: new Date() });
    bump();
  }, [bump]);

  const removeLabelFromCard = useCallback((cardId: string, labelId: string) => {
    const before = mockDatabase.cardLabels.length;
    mockDatabase.cardLabels = mockDatabase.cardLabels.filter(cl => !(cl.cardId === cardId && cl.labelId === labelId));
    if (mockDatabase.cardLabels.length !== before) bump();
  }, [bump]);

  const toggleCardLabel = useCallback((cardId: string, labelId: string) => {
    const exists = mockDatabase.cardLabels.some(cl => cl.cardId === cardId && cl.labelId === labelId);
    if (exists) {
      mockDatabase.cardLabels = mockDatabase.cardLabels.filter(cl => !(cl.cardId === cardId && cl.labelId === labelId));
      bump();
    } else {
      const id = `cl-${cardId}-${labelId}`;
      mockDatabase.cardLabels.push({ id, cardId, labelId, createdAt: new Date() });
      bump();
    }
  }, [bump]);

  const api = useMemo<MockDBApi>(() => ({
    db: mockDatabase,
    version,
    getBoardById: (boardId: string) => mockDatabase.boards.find(b => b.id === boardId),
    getBoardMembers: (boardId: string) => {
      const members = mockDatabase.boardMembers.filter(bm => bm.boardId === boardId);
      return members.map(bm => {
        const user = mockDatabase.users.find(u => u.id === bm.userId)!;
        return { id: user.id, name: user.fullName, avatar: user.avatarUrl, initials: user.initials };
      });
    },
    getBoardLabels: (boardId: string) => {
      return mockDatabase.labels
        .filter(l => l.boardId === boardId)
        .map(l => ({ id: l.id, name: l.name, color: l.color }));
    },
    getColumnsWithCards: (boardId: string) => {
      const columns = mockDatabase.columns
        .filter(c => c.boardId === boardId && !c.isArchived)
        .sort((a, b) => a.position - b.position);
      return columns.map(col => ({
        id: col.id,
        title: col.title,
        cards: mockDatabase.cards
          .filter(card => card.columnId === col.id && !card.isArchived)
          .sort((a, b) => a.position - b.position)
          .map(card => {
            const labels = mockDatabase.cardLabels
              .filter(cl => cl.cardId === card.id)
              .map(cl => mockDatabase.labels.find(l => l.id === cl.labelId)!)
              .filter(Boolean)
              .map(l => ({ id: l.id, text: l.name, color: l.color }));
            const members = mockDatabase.cardMembers
              .filter(cm => cm.cardId === card.id)
              .map(cm => mockDatabase.users.find(u => u.id === cm.userId)!)
              .filter(Boolean)
              .map(u => ({ id: u.id, name: u.fullName, avatar: u.avatarUrl, initials: u.initials }));
            return {
              id: card.id,
              title: card.title,
              description: card.description,
              labels,
              members,
              dueDate: card.dueDate ? card.dueDate.toISOString().split('T')[0] : undefined,
            } as UiCardItem;
          })
      }));
    },
    updateBoardTitle,
    addColumn,
    updateColumnTitle,
    addCard,
    updateCard,
    deleteCard,
    archiveCard,
    copyCard,
    moveCard,
    addLabelToCard,
    removeLabelFromCard,
    toggleCardLabel,
  }), [version, updateBoardTitle, addColumn, updateColumnTitle, addCard, updateCard, deleteCard, archiveCard, copyCard, moveCard]);

  return (
    <MockDBContext.Provider value={api}>{children}</MockDBContext.Provider>
  );
};

export const useMockDB = () => {
  const ctx = useContext(MockDBContext);
  if (!ctx) throw new Error('useMockDB must be used within MockDBProvider');
  return ctx;
};

export const useBoardData = (boardId: string) => {
  const { db, getBoardMembers, version } = useMockDB();
  return useMemo(() => {
    const board = db.boards.find(b => b.id === boardId);
    if (!board) return null;
    const members = getBoardMembers(boardId);
    const columns = db.columns
      .filter(c => c.boardId === boardId && !c.isArchived)
      .sort((a, b) => a.position - b.position)
      .map(col => ({
      id: col.id,
      title: col.title,
      cards: db.cards
        .filter(card => card.columnId === col.id && !card.isArchived)
        .sort((a, b) => a.position - b.position)
        .map(card => {
        const labels = db.cardLabels
          .filter(cl => cl.cardId === card.id)
          .map(cl => db.labels.find(l => l.id === cl.labelId)!)
          .filter(Boolean)
          .map(l => ({ id: l.id, text: l.name, color: l.color }));
        const members = db.cardMembers
          .filter(cm => cm.cardId === card.id)
          .map(cm => db.users.find(u => u.id === cm.userId)!)
          .filter(Boolean)
          .map(u => ({ id: u.id, name: u.fullName, avatar: u.avatarUrl, initials: u.initials }));
        return {
          id: card.id,
          title: card.title,
          description: card.description,
          labels,
          members,
          dueDate: card.dueDate ? card.dueDate.toISOString().split('T')[0] : undefined,
        } as UiCardItem;
      })
    }));
    const labels = db.labels.filter(l => l.boardId === boardId).map(l => ({ id: l.id, text: l.name, color: l.color }));
    return { board, members, columns, labels };
  }, [db, boardId, getBoardMembers, version]);
};
