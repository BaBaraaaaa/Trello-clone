// 📦 Type Exports for Trello Clone

// Database Types
export type {
  User,
  Workspace,
  Board,
  Column,
  Card,
  Label,
  BoardMember,
  CardMember,
  CardLabel,
  Checklist,
  ChecklistItem,
  Comment,
  Attachment,
  Activity,
  Notification,
  WorkspaceMember,
  BoardStats,
  UserStats,
} from './database';

// Component Types
export type {
  CardItemData,
  CardLabel as ComponentCardLabel,
  CardMemberData,
  BoardHeaderProps,
  BoardLabel,
  FilterOptions,
  ColumnData,
  CardData,
  CardActionsProps,
  DashboardBoard,
  DashboardBoardMember,
} from './component';

// Re-export commonly used types with aliases for convenience
export type {
  User as DatabaseUser,
  Board as DatabaseBoard,
  Card as DatabaseCard,
  Label as DatabaseLabel,
  BoardMember as DatabaseBoardMember,
  CardMember as DatabaseCardMember,
  CardLabel as DatabaseCardLabel,
} from './database';