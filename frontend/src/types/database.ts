// 🗄️ Database Types for Trello Clone
// Based on the database schema designed in database-models.md

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
  avatarUrl?: string;
  initials: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  type: 'personal' | 'team' | 'enterprise';
  visibility: 'private' | 'public';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  background: {
    type: 'color' | 'gradient' | 'image';
    value: string;
  };
  visibility: 'private' | 'workspace' | 'public';
  isClosed: boolean;
  createdBy: string;
  workspaceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  boardId: string;
  title: string;
  position: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Card {
  id: string;
  columnId: string;
  boardId: string;
  title: string;
  description?: string;
  position: number;
  dueDate?: Date;
  isCompleted: boolean;
  isArchived: boolean;
  coverColor?: string;
  coverAttachmentId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Label {
  id: string;
  boardId: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface BoardMember {
  id: string;
  boardId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'observer';
  isStarred: boolean;
  joinedAt: Date;
}

export interface CardMember {
  id: string;
  cardId: string;
  userId: string;
  assignedAt: Date;
  assignedBy?: string;
}

export interface CardLabel {
  id: string;
  cardId: string;
  labelId: string;
  createdAt: Date;
}

export interface Checklist {
  id: string;
  cardId: string;
  title: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistItem {
  id: string;
  checklistId: string;
  content: string;
  isCompleted: boolean;
  position: number;
  dueDate?: Date;
  assignedTo?: string;
  completedAt?: Date;
  completedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  cardId: string;
  userId: string;
  content: string;
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  cardId: string;
  filename: string;
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
  thumbnailUrl?: string;
  isCover: boolean;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Activity {
  id: string;
  boardId?: string;
  cardId?: string;
  userId: string;
  actionType: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message?: string;
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
}

// 📊 Statistics Types
export interface BoardStats {
  totalColumns: number;
  totalCards: number;
  completedCards: number;
  overdueCards: number;
  totalMembers: number;
  totalLabels: number;
}

export interface UserStats {
  totalBoards: number;
  starredBoards: number;
  totalCards: number;
  completedCards: number;
  overdueCards: number;
  unreadNotifications: number;
}