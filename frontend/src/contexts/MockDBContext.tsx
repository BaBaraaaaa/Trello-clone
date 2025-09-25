/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo } from 'react';
import { mockDatabase } from '../../../mock-database';
import type { Board as DbBoard } from '../types';

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
  // Basic selectors
  getBoardById: (boardId: string) => DbBoard | undefined;
  getBoardMembers: (boardId: string) => UiCardMember[];
  getBoardLabels: (boardId: string) => UiBoardHeaderLabel[];
  getColumnsWithCards: (boardId: string) => UiColumn[];
}

const MockDBContext = createContext<MockDBApi | null>(null);

export const MockDBProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const api = useMemo<MockDBApi>(() => ({
    db: mockDatabase,
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
      const columns = mockDatabase.columns.filter(c => c.boardId === boardId);
      return columns.map(col => ({
        id: col.id,
        title: col.title,
        cards: mockDatabase.cards
          .filter(card => card.columnId === col.id)
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
  }), []);

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
  const { db, getBoardMembers } = useMockDB();
  return useMemo(() => {
    const board = db.boards.find(b => b.id === boardId);
    if (!board) return null;
    const members = getBoardMembers(boardId);
    const columns = db.columns.filter(c => c.boardId === boardId).map(col => ({
      id: col.id,
      title: col.title,
      cards: db.cards.filter(card => card.columnId === col.id).map(card => {
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
  }, [db, boardId, getBoardMembers]);
};
