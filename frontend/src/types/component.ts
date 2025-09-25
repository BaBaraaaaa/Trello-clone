// 🎨 Component Types for Trello Clone

// Card Components
export interface CardItemData {
  id: string;
  title: string;
  description?: string;
  labels?: CardLabel[];
  members?: CardMemberData[];
  dueDate?: string;
  attachments?: number;
  checklist?: { completed: number; total: number };
  comments?: number;
}

export interface CardLabel {
  id?: string;
  color: string;
  text: string;
}

export interface CardMemberData {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
}

// Board Components
export interface BoardHeaderProps {
  title: string;
  description?: string;
  members: CardMemberData[];
  isStarred: boolean;
  onTitleChange: (newTitle: string) => void;
  onToggleStar: () => void;
  onAddMember: (email: string) => void;
  onRemoveMember: (memberId: string) => void;
  onFilter: (filters: FilterOptions) => void;
  onBoardAction: (action: string) => void;
  availableLabels?: BoardLabel[];
}

export interface BoardLabel {
  id: string;
  name: string;
  color: string;
}

export interface FilterOptions {
  labels?: string[];
  members?: string[];
  dueDate?: 'overdue' | 'due-soon' | 'no-date';
  completed?: boolean;
}

// Column Components
export interface ColumnData {
  id: string;
  title: string;
  cards: CardData[];
}

export interface CardData {
  id: string;
  title: string;
  description?: string;
  labels?: CardLabel[];
  members?: CardMemberData[];
  dueDate?: string;
  attachments?: number;
  checklist?: { completed: number; total: number };
  comments?: number;
}

// Board Member Components
export interface BoardMember {
  id: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'observer';
  isStarred: boolean;
  joinedAt: Date;
  user?: {
    id: string;
    fullName: string;
    avatarUrl?: string;
    initials: string;
  };
}

// Card Actions
export interface CardActionsProps {
  cardId: string;
  cardTitle: string;
  onEdit?: (card: CardItemData) => void;
  onCopy?: (card: CardItemData) => void;
  onMove?: (card: CardItemData) => void;
  onArchive?: (card: CardItemData) => void;
  onDelete?: (card: CardItemData) => void;
}

// Dashboard Components
export interface DashboardBoard {
  id: string;
  title: string;
  description?: string;
  backgroundType: 'color' | 'gradient' | 'image';
  backgroundValue: string;
  visibility: 'private' | 'workspace' | 'public';
  isClosed: boolean;
  createdBy: string;
  workspaceId?: string;
  createdAt: Date;
  updatedAt: Date;
  members?: DashboardBoardMember[];
  lastActivity?: Date;
}

export interface DashboardBoardMember {
  id: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'observer';
  user?: {
    id: string;
    fullName: string;
    avatarUrl?: string;
    initials: string;
  };
}