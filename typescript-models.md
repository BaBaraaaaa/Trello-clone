# 🎯 TypeScript Models & Interfaces

## 📋 **Core Domain Types**

### **User Types**
```typescript
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  initials: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  avatarUrl?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
}
```

### **Workspace Types**
```typescript
export enum WorkspaceType {
  PERSONAL = 'personal',
  TEAM = 'team',
  ENTERPRISE = 'enterprise'
}

export enum WorkspaceVisibility {
  PRIVATE = 'private',
  PUBLIC = 'public'
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  type: WorkspaceType;
  visibility: WorkspaceVisibility;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
  user?: User; // Populated in joins
}
```

### **Board Types**
```typescript
export enum BoardVisibility {
  PRIVATE = 'private',
  WORKSPACE = 'workspace',
  PUBLIC = 'public'
}

export enum BackgroundType {
  COLOR = 'color',
  GRADIENT = 'gradient',
  IMAGE = 'image'
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  backgroundType: BackgroundType;
  backgroundValue: string;
  visibility: BoardVisibility;
  isClosed: boolean;
  createdBy: string; // User ID
  workspaceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardSummary extends Board {
  createdByName: string;
  columnCount: number;
  cardCount: number;
  memberCount: number;
}

export enum BoardMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  OBSERVER = 'observer'
}

export interface BoardMember {
  id: string;
  boardId: string;
  userId: string;
  role: BoardMemberRole;
  isStarred: boolean;
  joinedAt: Date;
  user?: User; // Populated in joins
}

export interface CreateBoardRequest {
  title: string;
  description?: string;
  backgroundType?: BackgroundType;
  backgroundValue?: string;
  visibility?: BoardVisibility;
  workspaceId?: string;
}

export interface UpdateBoardRequest {
  title?: string;
  description?: string;
  backgroundType?: BackgroundType;
  backgroundValue?: string;
  visibility?: BoardVisibility;
  isClosed?: boolean;
}
```

### **Column Types**
```typescript
export interface Column {
  id: string;
  boardId: string;
  title: string;
  position: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ColumnWithCards extends Column {
  cards: Card[];
}

export interface CreateColumnRequest {
  title: string;
  position?: number; // Auto-calculated if not provided
}

export interface UpdateColumnRequest {
  title?: string;
  position?: number;
  isArchived?: boolean;
}

export interface ReorderColumnsRequest {
  columnOrders: Array<{
    id: string;
    position: number;
  }>;
}
```

### **Card Types**
```typescript
export interface Card {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  position: number;
  dueDate?: Date;
  isCompleted: boolean;
  isArchived: boolean;
  coverColor?: string;
  coverAttachmentId?: string;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

export interface CardStats extends Card {
  columnTitle: string;
  boardId: string;
  labelCount: number;
  memberCount: number;
  attachmentCount: number;
  commentCount: number;
  totalChecklistItems: number;
  completedChecklistItems: number;
}

export interface CardWithDetails extends Card {
  labels: Label[];
  members: User[];
  attachments: Attachment[];
  comments: Comment[];
  checklists: ChecklistWithItems[];
  activities: Activity[];
}

export interface CreateCardRequest {
  title: string;
  description?: string;
  position?: number; // Auto-calculated if not provided
  dueDate?: Date;
  coverColor?: string;
}

export interface UpdateCardRequest {
  title?: string;
  description?: string;
  position?: number;
  dueDate?: Date;
  isCompleted?: boolean;
  isArchived?: boolean;
  coverColor?: string;
  coverAttachmentId?: string;
}

export interface MoveCardRequest {
  targetColumnId: string;
  position: number;
}

export interface ReorderCardsRequest {
  cardOrders: Array<{
    id: string;
    position: number;
  }>;
}
```

### **Label Types**
```typescript
export interface Label {
  id: string;
  boardId: string;
  name: string;
  color: string; // Hex color
  createdAt: Date;
}

export interface CardLabel {
  id: string;
  cardId: string;
  labelId: string;
  createdAt: Date;
  label?: Label; // Populated in joins
}

export interface CreateLabelRequest {
  name: string;
  color: string;
}

export interface UpdateLabelRequest {
  name?: string;
  color?: string;
}

// Predefined label colors
export const LABEL_COLORS = [
  '#61bd4f', // Green
  '#f2d600', // Yellow
  '#ff9f1a', // Orange
  '#eb5a46', // Red
  '#c377e0', // Purple
  '#0079bf', // Blue
  '#00c2e0', // Sky
  '#51e898', // Lime
  '#ff78cb', // Pink
  '#355263'  // Black
] as const;

export type LabelColor = typeof LABEL_COLORS[number];
```

### **Checklist Types**
```typescript
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
  assignedTo?: string; // User ID
  completedAt?: Date;
  completedBy?: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistWithItems extends Checklist {
  items: ChecklistItem[];
}

export interface ChecklistStats {
  total: number;
  completed: number;
  percentage: number;
}

export interface CreateChecklistRequest {
  title: string;
  position?: number;
}

export interface UpdateChecklistRequest {
  title?: string;
  position?: number;
}

export interface CreateChecklistItemRequest {
  content: string;
  position?: number;
  dueDate?: Date;
  assignedTo?: string;
}

export interface UpdateChecklistItemRequest {
  content?: string;
  position?: number;
  isCompleted?: boolean;
  dueDate?: Date;
  assignedTo?: string;
}
```

### **Comment Types**
```typescript
export interface Comment {
  id: string;
  cardId: string;
  userId: string;
  content: string;
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: User; // Populated in joins
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}
```

### **Attachment Types**
```typescript
export interface Attachment {
  id: string;
  cardId: string;
  filename: string;
  originalFilename: string;
  fileSize: number; // in bytes
  mimeType: string;
  fileUrl: string;
  thumbnailUrl?: string;
  isCover: boolean;
  uploadedBy: string; // User ID
  uploadedAt: Date;
}

export interface CreateAttachmentRequest {
  file: File;
  isCover?: boolean;
}

export interface UpdateAttachmentRequest {
  filename?: string;
  isCover?: boolean;
}

// File type constraints
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
```

### **Activity Types**
```typescript
export enum ActivityType {
  // Board activities
  CREATE_BOARD = 'create_board',
  UPDATE_BOARD = 'update_board',
  ARCHIVE_BOARD = 'archive_board',
  
  // Column activities
  CREATE_COLUMN = 'create_column',
  UPDATE_COLUMN = 'update_column',
  MOVE_COLUMN = 'move_column',
  ARCHIVE_COLUMN = 'archive_column',
  
  // Card activities
  CREATE_CARD = 'create_card',
  UPDATE_CARD = 'update_card',
  MOVE_CARD = 'move_card',
  ARCHIVE_CARD = 'archive_card',
  ADD_CARD_MEMBER = 'add_card_member',
  REMOVE_CARD_MEMBER = 'remove_card_member',
  ADD_CARD_LABEL = 'add_card_label',
  REMOVE_CARD_LABEL = 'remove_card_label',
  
  // Comment activities
  ADD_COMMENT = 'add_comment',
  UPDATE_COMMENT = 'update_comment',
  DELETE_COMMENT = 'delete_comment',
  
  // Attachment activities
  ADD_ATTACHMENT = 'add_attachment',
  DELETE_ATTACHMENT = 'delete_attachment',
  
  // Checklist activities
  ADD_CHECKLIST = 'add_checklist',
  UPDATE_CHECKLIST = 'update_checklist',
  DELETE_CHECKLIST = 'delete_checklist',
  COMPLETE_CHECKLIST_ITEM = 'complete_checklist_item',
  
  // Member activities
  ADD_BOARD_MEMBER = 'add_board_member',
  REMOVE_BOARD_MEMBER = 'remove_board_member',
  UPDATE_MEMBER_ROLE = 'update_member_role'
}

export enum EntityType {
  BOARD = 'board',
  COLUMN = 'column',
  CARD = 'card',
  COMMENT = 'comment',
  ATTACHMENT = 'attachment',
  CHECKLIST = 'checklist',
  CHECKLIST_ITEM = 'checklist_item',
  MEMBER = 'member',
  LABEL = 'label'
}

export interface Activity {
  id: string;
  boardId?: string;
  cardId?: string;
  userId: string;
  actionType: ActivityType;
  entityType: EntityType;
  entityId?: string;
  details?: Record<string, any>; // JSON data
  createdAt: Date;
  user?: User; // Populated in joins
}

export interface CreateActivityRequest {
  boardId?: string;
  cardId?: string;
  actionType: ActivityType;
  entityType: EntityType;
  entityId?: string;
  details?: Record<string, any>;
}
```

### **Notification Types**
```typescript
export enum NotificationType {
  CARD_ASSIGNED = 'card_assigned',
  CARD_DUE_SOON = 'card_due_soon',
  CARD_OVERDUE = 'card_overdue',
  COMMENT_ADDED = 'comment_added',
  BOARD_INVITATION = 'board_invitation',
  CHECKLIST_COMPLETED = 'checklist_completed',
  ATTACHMENT_ADDED = 'attachment_added'
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  entityType?: EntityType;
  entityId?: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface CreateNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  entityType?: EntityType;
  entityId?: string;
}

export interface NotificationSettings {
  cardAssignments: boolean;
  dueDates: boolean;
  comments: boolean;
  boardInvitations: boolean;
  emailDigest: boolean;
  pushNotifications: boolean;
}
```

## 🔧 **Utility Types**

### **API Response Types**
```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  labels?: string[];
  members?: string[];
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  isCompleted?: boolean;
  isArchived?: boolean;
}
```

### **Form Validation Types**
```typescript
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Validation schemas (using zod-like structure)
export interface BoardValidation {
  title: {
    required: true;
    minLength: 1;
    maxLength: 255;
  };
  description: {
    maxLength: 1000;
  };
}

export interface CardValidation {
  title: {
    required: true;
    minLength: 1;
    maxLength: 500;
  };
  description: {
    maxLength: 5000;
  };
}
```

### **State Management Types**
```typescript
// Redux/Zustand store types
export interface AppState {
  auth: AuthState;
  boards: BoardState;
  ui: UIState;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface BoardState {
  currentBoard: BoardWithDetails | null;
  boards: Board[];
  isLoading: boolean;
  error: string | null;
}

export interface BoardWithDetails extends Board {
  columns: ColumnWithCards[];
  members: BoardMember[];
  labels: Label[];
  activities: Activity[];
}

export interface UIState {
  sidebarOpen: boolean;
  selectedCard: Card | null;
  cardDetailOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}
```

### **Hook Types**
```typescript
// Custom hook return types
export interface UseBoardReturn {
  board: BoardWithDetails | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  updateBoard: (updates: UpdateBoardRequest) => Promise<void>;
  deleteBoard: () => Promise<void>;
}

export interface UseCardsReturn {
  cards: Card[];
  isLoading: boolean;
  error: string | null;
  createCard: (data: CreateCardRequest) => Promise<Card>;
  updateCard: (id: string, data: UpdateCardRequest) => Promise<Card>;
  moveCard: (id: string, data: MoveCardRequest) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
}

// Drag and drop types
export interface DragItem {
  id: string;
  type: 'card' | 'column';
  sourceId: string; // column ID for cards, board ID for columns
  index: number;
}

export interface DropResult {
  dragId: string;
  targetId: string;
  position: number;
}
```

## 📱 **Component Props Types**

### **Board Component Props**
```typescript
export interface BoardHeaderProps {
  board: Board;
  members: BoardMember[];
  isStarred: boolean;
  onTitleChange: (title: string) => void;
  onToggleStar: () => void;
  onAddMember: (email: string) => void;
  onRemoveMember: (memberId: string) => void;
  onFilter: (filters: FilterParams) => void;
  onBoardAction: (action: string) => void;
}

export interface ColumnProps {
  column: ColumnWithCards;
  onTitleChange: (columnId: string, title: string) => void;
  onAddCard: (columnId: string, title: string) => void;
  onCardClick: (card: Card) => void;
  onCardMove: (cardId: string, targetColumnId: string, position: number) => void;
}

export interface CardProps {
  card: CardStats;
  isDragging?: boolean;
  onClick: (card: Card) => void;
  onEdit: (card: Card) => void;
  onArchive: (cardId: string) => void;
  onDelete: (cardId: string) => void;
}
```

### **Dialog Component Props**
```typescript
export interface CardDetailDialogProps {
  open: boolean;
  card: CardWithDetails | null;
  onClose: () => void;
  onSave: (card: UpdateCardRequest) => void;
  onDelete: (cardId: string) => void;
}

export interface MemberInviteDialogProps {
  open: boolean;
  boardId: string;
  onClose: () => void;
  onInvite: (email: string, role: BoardMemberRole) => void;
}

export interface LabelManagerDialogProps {
  open: boolean;
  boardId: string;
  selectedLabels: string[];
  onClose: () => void;
  onChange: (labelIds: string[]) => void;
}
```

## 🎨 **Theme & Styling Types**
```typescript
export interface ThemeColors {
  primary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  background: {
    default: string;
    paper: string;
    glassmorphism: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
}

export interface BoardBackground {
  type: BackgroundType;
  value: string;
  preview: string;
}

export const BOARD_BACKGROUNDS: BoardBackground[] = [
  {
    type: BackgroundType.GRADIENT,
    value: 'linear-gradient(135deg, #026AA7 0%, #4A90C2 30%, #5AAC44 70%, #7BC15A 100%)',
    preview: 'gradient-blue-green'
  },
  // ... more backgrounds
];
```

Đây là hệ thống types TypeScript hoàn chỉnh cho ứng dụng Trello clone! 🎯