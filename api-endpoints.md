# 🚀 API Endpoints Specification

## 🏗️ **Base API Structure**

### **API Configuration**
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const API_VERSION = 'v1';

// Headers
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`,
};

// Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    pagination?: PaginationMeta;
    filters?: FilterMeta;
  };
}
```

## 🔐 **Authentication Endpoints**

### **POST /api/v1/auth/register**
```typescript
// Request
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

// Response
interface RegisterResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

// Example
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com", 
  "password": "securePassword123",
  "fullName": "John Doe"
}
```

### **POST /api/v1/auth/login**
```typescript
// Request
interface LoginRequest {
  email: string;
  password: string;
}

// Response
interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

// Example
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### **POST /api/v1/auth/refresh**
```typescript
// Request
interface RefreshTokenRequest {
  refreshToken: string;
}

// Response
interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

### **POST /api/v1/auth/logout**
```typescript
// Request
interface LogoutRequest {
  refreshToken: string;
}

// Response: 204 No Content
```

## 👤 **User Endpoints**

### **GET /api/v1/users/me**
```typescript
// Response
interface GetCurrentUserResponse {
  user: User;
}

// Example
GET /api/v1/users/me
Authorization: Bearer {access_token}
```

### **PUT /api/v1/users/me**
```typescript
// Request
interface UpdateUserRequest {
  username?: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
}

// Response
interface UpdateUserResponse {
  user: User;
}

// Example
PUT /api/v1/users/me
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "fullName": "John Smith",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

### **GET /api/v1/users/search**
```typescript
// Query Parameters
interface UserSearchParams {
  q: string; // search query
  limit?: number; // default 10
  exclude?: string[]; // user IDs to exclude
}

// Response
interface UserSearchResponse {
  users: User[];
}

// Example
GET /api/v1/users/search?q=john&limit=5&exclude=123,456
Authorization: Bearer {access_token}
```

## 🏢 **Workspace Endpoints**

### **GET /api/v1/workspaces**
```typescript
// Response
interface GetWorkspacesResponse {
  workspaces: Workspace[];
}

// Example
GET /api/v1/workspaces
Authorization: Bearer {access_token}
```

### **POST /api/v1/workspaces**
```typescript
// Request
interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  type: WorkspaceType;
  visibility: WorkspaceVisibility;
}

// Response
interface CreateWorkspaceResponse {
  workspace: Workspace;
}
```

### **GET /api/v1/workspaces/:id**
```typescript
// Response
interface GetWorkspaceResponse {
  workspace: Workspace;
  members: WorkspaceMember[];
  boards: Board[];
}
```

### **PUT /api/v1/workspaces/:id**
```typescript
// Request
interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  visibility?: WorkspaceVisibility;
}

// Response
interface UpdateWorkspaceResponse {
  workspace: Workspace;
}
```

### **DELETE /api/v1/workspaces/:id**
```typescript
// Response: 204 No Content
```

## 📋 **Board Endpoints**

### **GET /api/v1/boards**
```typescript
// Query Parameters
interface GetBoardsParams {
  workspaceId?: string;
  starred?: boolean;
  page?: number;
  limit?: number;
  sort?: 'created_at' | 'updated_at' | 'title';
  order?: 'asc' | 'desc';
}

// Response
interface GetBoardsResponse {
  boards: BoardSummary[];
  pagination: PaginationMeta;
}

// Example
GET /api/v1/boards?starred=true&limit=20&sort=updated_at&order=desc
Authorization: Bearer {access_token}
```

### **POST /api/v1/boards**
```typescript
// Request
interface CreateBoardRequest {
  title: string;
  description?: string;
  backgroundType?: BackgroundType;
  backgroundValue?: string;
  visibility?: BoardVisibility;
  workspaceId?: string;
}

// Response
interface CreateBoardResponse {
  board: Board;
}

// Example
POST /api/v1/boards
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Website Redesign",
  "description": "Complete website redesign project",
  "backgroundType": "gradient",
  "backgroundValue": "linear-gradient(135deg, #026AA7 0%, #5AAC44 100%)",
  "visibility": "private"
}
```

### **GET /api/v1/boards/:id**
```typescript
// Response
interface GetBoardResponse {
  board: Board;
  columns: ColumnWithCards[];
  members: BoardMember[];
  labels: Label[];
  activities: Activity[];
}

// Example
GET /api/v1/boards/board-uuid-123
Authorization: Bearer {access_token}
```

### **PUT /api/v1/boards/:id**
```typescript
// Request
interface UpdateBoardRequest {
  title?: string;
  description?: string;
  backgroundType?: BackgroundType;
  backgroundValue?: string;
  visibility?: BoardVisibility;
  isClosed?: boolean;
}

// Response
interface UpdateBoardResponse {
  board: Board;
}
```

### **DELETE /api/v1/boards/:id**
```typescript
// Response: 204 No Content
```

### **POST /api/v1/boards/:id/star**
```typescript
// Response
interface StarBoardResponse {
  isStarred: boolean;
}
```

### **DELETE /api/v1/boards/:id/star**
```typescript
// Response
interface UnstarBoardResponse {
  isStarred: boolean;
}
```

## 👥 **Board Members Endpoints**

### **GET /api/v1/boards/:boardId/members**
```typescript
// Response
interface GetBoardMembersResponse {
  members: BoardMember[];
}
```

### **POST /api/v1/boards/:boardId/members**
```typescript
// Request
interface AddBoardMemberRequest {
  email: string;
  role: BoardMemberRole;
}

// Response
interface AddBoardMemberResponse {
  member: BoardMember;
}

// Example
POST /api/v1/boards/board-123/members
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "email": "jane@example.com",
  "role": "member"
}
```

### **PUT /api/v1/boards/:boardId/members/:userId**
```typescript
// Request
interface UpdateBoardMemberRequest {
  role: BoardMemberRole;
}

// Response
interface UpdateBoardMemberResponse {
  member: BoardMember;
}
```

### **DELETE /api/v1/boards/:boardId/members/:userId**
```typescript
// Response: 204 No Content
```

## 📝 **Column Endpoints**

### **GET /api/v1/boards/:boardId/columns**
```typescript
// Response
interface GetColumnsResponse {
  columns: ColumnWithCards[];
}
```

### **POST /api/v1/boards/:boardId/columns**
```typescript
// Request
interface CreateColumnRequest {
  title: string;
  position?: number;
}

// Response
interface CreateColumnResponse {
  column: Column;
}

// Example
POST /api/v1/boards/board-123/columns
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "To Do",
  "position": 0
}
```

### **PUT /api/v1/columns/:id**
```typescript
// Request
interface UpdateColumnRequest {
  title?: string;
  position?: number;
  isArchived?: boolean;
}

// Response
interface UpdateColumnResponse {
  column: Column;
}
```

### **DELETE /api/v1/columns/:id**
```typescript
// Response: 204 No Content
```

### **PUT /api/v1/boards/:boardId/columns/reorder**
```typescript
// Request
interface ReorderColumnsRequest {
  columnOrders: Array<{
    id: string;
    position: number;
  }>;
}

// Response
interface ReorderColumnsResponse {
  columns: Column[];
}

// Example
PUT /api/v1/boards/board-123/columns/reorder
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "columnOrders": [
    { "id": "col-1", "position": 0 },
    { "id": "col-2", "position": 1 },
    { "id": "col-3", "position": 2 }
  ]
}
```

## 🎴 **Card Endpoints**

### **GET /api/v1/columns/:columnId/cards**
```typescript
// Query Parameters
interface GetCardsParams {
  includeArchived?: boolean;
  labels?: string[];
  members?: string[];
  dueDateFrom?: string;
  dueDateTo?: string;
}

// Response
interface GetCardsResponse {
  cards: CardStats[];
}
```

### **POST /api/v1/columns/:columnId/cards**
```typescript
// Request
interface CreateCardRequest {
  title: string;
  description?: string;
  position?: number;
  dueDate?: string; // ISO date string
  coverColor?: string;
}

// Response
interface CreateCardResponse {
  card: Card;
}

// Example
POST /api/v1/columns/col-123/cards
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Research user needs",
  "description": "Conduct user interviews and surveys",
  "dueDate": "2025-10-01T00:00:00Z",
  "position": 0
}
```

### **GET /api/v1/cards/:id**
```typescript
// Response
interface GetCardResponse {
  card: CardWithDetails;
}
```

### **PUT /api/v1/cards/:id**
```typescript
// Request
interface UpdateCardRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  isCompleted?: boolean;
  isArchived?: boolean;
  coverColor?: string;
}

// Response
interface UpdateCardResponse {
  card: Card;
}
```

### **DELETE /api/v1/cards/:id**
```typescript
// Response: 204 No Content
```

### **PUT /api/v1/cards/:id/move**
```typescript
// Request
interface MoveCardRequest {
  targetColumnId: string;
  position: number;
}

// Response
interface MoveCardResponse {
  card: Card;
}

// Example
PUT /api/v1/cards/card-123/move
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "targetColumnId": "col-456",
  "position": 2
}
```

### **PUT /api/v1/columns/:columnId/cards/reorder**
```typescript
// Request
interface ReorderCardsRequest {
  cardOrders: Array<{
    id: string;
    position: number;
  }>;
}

// Response
interface ReorderCardsResponse {
  cards: Card[];
}
```

## 🏷️ **Label Endpoints**

### **GET /api/v1/boards/:boardId/labels**
```typescript
// Response
interface GetLabelsResponse {
  labels: Label[];
}
```

### **POST /api/v1/boards/:boardId/labels**
```typescript
// Request
interface CreateLabelRequest {
  name: string;
  color: string;
}

// Response
interface CreateLabelResponse {
  label: Label;
}

// Example
POST /api/v1/boards/board-123/labels
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "High Priority",
  "color": "#eb5a46"
}
```

### **PUT /api/v1/labels/:id**
```typescript
// Request
interface UpdateLabelRequest {
  name?: string;
  color?: string;
}

// Response
interface UpdateLabelResponse {
  label: Label;
}
```

### **DELETE /api/v1/labels/:id**
```typescript
// Response: 204 No Content
```

### **POST /api/v1/cards/:cardId/labels/:labelId**
```typescript
// Response
interface AddCardLabelResponse {
  cardLabel: CardLabel;
}
```

### **DELETE /api/v1/cards/:cardId/labels/:labelId**
```typescript
// Response: 204 No Content
```

## 👥 **Card Member Endpoints**

### **POST /api/v1/cards/:cardId/members/:userId**
```typescript
// Response
interface AssignCardMemberResponse {
  cardMember: {
    id: string;
    cardId: string;
    userId: string;
    assignedAt: Date;
  };
}
```

### **DELETE /api/v1/cards/:cardId/members/:userId**
```typescript
// Response: 204 No Content
```

## ✅ **Checklist Endpoints**

### **GET /api/v1/cards/:cardId/checklists**
```typescript
// Response
interface GetChecklistsResponse {
  checklists: ChecklistWithItems[];
}
```

### **POST /api/v1/cards/:cardId/checklists**
```typescript
// Request
interface CreateChecklistRequest {
  title: string;
  position?: number;
}

// Response
interface CreateChecklistResponse {
  checklist: Checklist;
}

// Example
POST /api/v1/cards/card-123/checklists
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Design Tasks",
  "position": 0
}
```

### **PUT /api/v1/checklists/:id**
```typescript
// Request
interface UpdateChecklistRequest {
  title?: string;
  position?: number;
}

// Response
interface UpdateChecklistResponse {
  checklist: Checklist;
}
```

### **DELETE /api/v1/checklists/:id**
```typescript
// Response: 204 No Content
```

### **POST /api/v1/checklists/:checklistId/items**
```typescript
// Request
interface CreateChecklistItemRequest {
  content: string;
  position?: number;
  dueDate?: string;
  assignedTo?: string;
}

// Response
interface CreateChecklistItemResponse {
  item: ChecklistItem;
}

// Example
POST /api/v1/checklists/checklist-123/items
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "content": "Research competitors",
  "position": 0,
  "assignedTo": "user-456"
}
```

### **PUT /api/v1/checklist-items/:id**
```typescript
// Request
interface UpdateChecklistItemRequest {
  content?: string;
  isCompleted?: boolean;
  position?: number;
  dueDate?: string;
  assignedTo?: string;
}

// Response
interface UpdateChecklistItemResponse {
  item: ChecklistItem;
}
```

### **DELETE /api/v1/checklist-items/:id**
```typescript
// Response: 204 No Content
```

## 💬 **Comment Endpoints**

### **GET /api/v1/cards/:cardId/comments**
```typescript
// Query Parameters
interface GetCommentsParams {
  page?: number;
  limit?: number;
  sort?: 'created_at';
  order?: 'asc' | 'desc';
}

// Response
interface GetCommentsResponse {
  comments: Comment[];
  pagination: PaginationMeta;
}
```

### **POST /api/v1/cards/:cardId/comments**
```typescript
// Request
interface CreateCommentRequest {
  content: string;
}

// Response
interface CreateCommentResponse {
  comment: Comment;
}

// Example
POST /api/v1/cards/card-123/comments
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "content": "This looks great! Ready for review."
}
```

### **PUT /api/v1/comments/:id**
```typescript
// Request
interface UpdateCommentRequest {
  content: string;
}

// Response
interface UpdateCommentResponse {
  comment: Comment;
}
```

### **DELETE /api/v1/comments/:id**
```typescript
// Response: 204 No Content
```

## 📎 **Attachment Endpoints**

### **GET /api/v1/cards/:cardId/attachments**
```typescript
// Response
interface GetAttachmentsResponse {
  attachments: Attachment[];
}
```

### **POST /api/v1/cards/:cardId/attachments**
```typescript
// Request: multipart/form-data
interface UploadAttachmentRequest {
  file: File;
  isCover?: boolean;
}

// Response
interface UploadAttachmentResponse {
  attachment: Attachment;
}

// Example
POST /api/v1/cards/card-123/attachments
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

FormData:
- file: [File object]
- isCover: false
```

### **PUT /api/v1/attachments/:id**
```typescript
// Request
interface UpdateAttachmentRequest {
  filename?: string;
  isCover?: boolean;
}

// Response
interface UpdateAttachmentResponse {
  attachment: Attachment;
}
```

### **DELETE /api/v1/attachments/:id**
```typescript
// Response: 204 No Content
```

## 📊 **Activity Endpoints**

### **GET /api/v1/boards/:boardId/activities**
```typescript
// Query Parameters
interface GetActivitiesParams {
  cardId?: string;
  userId?: string;
  actionTypes?: ActivityType[];
  page?: number;
  limit?: number;
}

// Response
interface GetActivitiesResponse {
  activities: Activity[];
  pagination: PaginationMeta;
}

// Example
GET /api/v1/boards/board-123/activities?limit=50&page=1
Authorization: Bearer {access_token}
```

### **GET /api/v1/cards/:cardId/activities**
```typescript
// Response
interface GetCardActivitiesResponse {
  activities: Activity[];
}
```

## 🔔 **Notification Endpoints**

### **GET /api/v1/notifications**
```typescript
// Query Parameters
interface GetNotificationsParams {
  unreadOnly?: boolean;
  types?: NotificationType[];
  page?: number;
  limit?: number;
}

// Response
interface GetNotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: PaginationMeta;
}

// Example
GET /api/v1/notifications?unreadOnly=true&limit=20
Authorization: Bearer {access_token}
```

### **PUT /api/v1/notifications/:id/read**
```typescript
// Response
interface MarkNotificationReadResponse {
  notification: Notification;
}
```

### **PUT /api/v1/notifications/read-all**
```typescript
// Response
interface MarkAllNotificationsReadResponse {
  updatedCount: number;
}
```

### **DELETE /api/v1/notifications/:id**
```typescript
// Response: 204 No Content
```

## 🔍 **Search Endpoints**

### **GET /api/v1/search**
```typescript
// Query Parameters
interface SearchParams {
  q: string; // search query
  types?: ('boards' | 'cards' | 'members')[];
  boardId?: string; // search within specific board
  limit?: number;
}

// Response
interface SearchResponse {
  boards: Board[];
  cards: CardStats[];
  members: User[];
  totalCount: number;
}

// Example
GET /api/v1/search?q=design&types=cards,boards&limit=10
Authorization: Bearer {access_token}
```

## ⚡ **WebSocket Events**

### **Real-time Updates**
```typescript
// Connect to WebSocket
const ws = new WebSocket(`ws://localhost:3001/ws?token=${accessToken}`);

// Event types
interface WebSocketEvent {
  type: string;
  boardId?: string;
  cardId?: string;
  data: any;
}

// Board events
interface BoardUpdatedEvent extends WebSocketEvent {
  type: 'board:updated';
  boardId: string;
  data: Board;
}

// Card events
interface CardCreatedEvent extends WebSocketEvent {
  type: 'card:created';
  boardId: string;
  data: Card;
}

interface CardUpdatedEvent extends WebSocketEvent {
  type: 'card:updated';
  boardId: string;
  cardId: string;
  data: Card;
}

interface CardMovedEvent extends WebSocketEvent {
  type: 'card:moved';
  boardId: string;
  cardId: string;
  data: {
    fromColumnId: string;
    toColumnId: string;
    position: number;
  };
}

// Member events
interface MemberJoinedEvent extends WebSocketEvent {
  type: 'member:joined';
  boardId: string;
  data: BoardMember;
}

// Usage example
ws.onmessage = (event) => {
  const wsEvent: WebSocketEvent = JSON.parse(event.data);
  
  switch (wsEvent.type) {
    case 'card:updated':
      // Update card in state
      break;
    case 'card:moved':
      // Update card position
      break;
    // ... handle other events
  }
};
```

## 📝 **Error Handling**

### **Standard Error Response**
```typescript
interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  details?: any;
}

// HTTP Status Codes
// 400 - Bad Request (validation errors)
// 401 - Unauthorized (authentication required)
// 403 - Forbidden (insufficient permissions) 
// 404 - Not Found (resource doesn't exist)
// 409 - Conflict (resource already exists)
// 422 - Unprocessable Entity (validation failed)
// 429 - Too Many Requests (rate limiting)
// 500 - Internal Server Error

// Example error responses
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "statusCode": 400,
  "details": {
    "title": "Title is required",
    "email": "Invalid email format"
  }
}

{
  "success": false,
  "error": "BOARD_NOT_FOUND",
  "message": "Board not found or you don't have access",
  "statusCode": 404
}

{
  "success": false,
  "error": "INSUFFICIENT_PERMISSIONS",
  "message": "You don't have permission to perform this action",
  "statusCode": 403
}
```

## 🔄 **Rate Limiting**

```typescript
// Rate limiting headers
interface RateLimitHeaders {
  'X-RateLimit-Limit': number;      // Requests per window
  'X-RateLimit-Remaining': number;  // Remaining requests
  'X-RateLimit-Reset': number;      // Reset time (Unix timestamp)
  'X-RateLimit-Window': number;     // Window duration in seconds
}

// Rate limits by endpoint type
const RATE_LIMITS = {
  auth: '5 requests per 15 minutes',
  read: '1000 requests per hour',
  write: '300 requests per hour',
  upload: '50 requests per hour',
};
```

Đây là bộ API endpoints hoàn chỉnh cho ứng dụng Trello clone! 🎯