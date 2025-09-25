# 🏗️ Backend Architecture Specification

## 📁 **Project Structure**

```
trello-clone-backend/
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── workspace.controller.ts
│   │   ├── board.controller.ts
│   │   ├── column.controller.ts
│   │   ├── card.controller.ts
│   │   ├── comment.controller.ts
│   │   ├── attachment.controller.ts
│   │   └── notification.controller.ts
│   ├── services/              # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── board.service.ts
│   │   ├── card.service.ts
│   │   ├── email.service.ts
│   │   ├── upload.service.ts
│   │   ├── notification.service.ts
│   │   └── activity.service.ts
│   ├── repositories/          # Data access layer
│   │   ├── base.repository.ts
│   │   ├── user.repository.ts
│   │   ├── board.repository.ts
│   │   ├── card.repository.ts
│   │   └── activity.repository.ts
│   ├── models/               # Database models (Prisma/TypeORM)
│   │   ├── User.ts
│   │   ├── Board.ts
│   │   ├── Card.ts
│   │   └── index.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── upload.middleware.ts
│   ├── routes/               # API routes
│   │   ├── v1/
│   │   │   ├── auth.routes.ts
│   │   │   ├── users.routes.ts
│   │   │   ├── boards.routes.ts
│   │   │   ├── cards.routes.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── utils/                # Utilities
│   │   ├── logger.ts
│   │   ├── database.ts
│   │   ├── validation.ts
│   │   ├── jwt.ts
│   │   ├── encryption.ts
│   │   └── constants.ts
│   ├── types/                # TypeScript definitions
│   │   ├── express.d.ts
│   │   ├── auth.types.ts
│   │   ├── api.types.ts
│   │   └── database.types.ts
│   ├── websocket/            # Real-time functionality
│   │   ├── socketHandlers.ts
│   │   ├── boardEvents.ts
│   │   └── index.ts
│   ├── config/               # Configuration
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── aws.config.ts
│   │   └── index.ts
│   └── app.ts                # Express app setup
├── prisma/                   # Database schema & migrations
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tests/                    # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                     # Documentation
├── docker/                   # Docker configurations
├── .env.example
├── package.json
├── tsconfig.json
├── jest.config.js
├── docker-compose.yml
└── README.md
```

## 🚀 **Technology Stack**

### **Core Technologies**
```typescript
{
  "runtime": "Node.js 20+",
  "language": "TypeScript 5+", 
  "framework": "Express.js 4.x",
  "database": "PostgreSQL 15+",
  "orm": "Prisma 5.x",
  "cache": "Redis 7+",
  "fileStorage": "AWS S3 / MinIO",
  "websockets": "Socket.IO 4.x",
  "authentication": "JWT + Refresh Tokens",
  "validation": "Zod",
  "testing": "Jest + Supertest",
  "documentation": "Swagger/OpenAPI",
  "monitoring": "Winston + Morgan",
  "deployment": "Docker + Docker Compose"
}
```

## 🗄️ **Database Configuration**

### **Prisma Schema Setup**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(uuid())
  username      String   @unique @db.VarChar(50)
  email         String   @unique @db.VarChar(255)
  passwordHash  String   @map("password_hash") @db.VarChar(255)
  fullName      String   @map("full_name") @db.VarChar(100)
  avatarUrl     String?  @map("avatar_url")
  isActive      Boolean  @default(true) @map("is_active")
  lastLoginAt   DateTime? @map("last_login_at")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  // Relations
  createdBoards    Board[]        @relation("BoardCreator")
  boardMemberships BoardMember[]
  cardAssignments  CardMember[]
  comments         Comment[]
  activities       Activity[]
  notifications    Notification[]
  attachments      Attachment[]   @relation("AttachmentUploader")

  @@map("users")
}

model Board {
  id              String           @id @default(uuid())
  title           String           @db.VarChar(255)
  description     String?
  backgroundType  BackgroundType   @default(GRADIENT) @map("background_type")
  backgroundValue String           @default("linear-gradient(135deg, #026AA7 0%, #4A90C2 50%, #5AAC44 100%)") @map("background_value")
  visibility      BoardVisibility  @default(PRIVATE)
  isClosed        Boolean          @default(false) @map("is_closed")
  createdBy       String           @map("created_by")
  workspaceId     String?          @map("workspace_id")
  createdAt       DateTime         @default(now()) @map("created_at")
  updatedAt       DateTime         @updatedAt @map("updated_at")

  // Relations
  creator     User           @relation("BoardCreator", fields: [createdBy], references: [id], onDelete: Cascade)
  workspace   Workspace?     @relation(fields: [workspaceId], references: [id], onDelete: SetNull)
  columns     Column[]
  members     BoardMember[]
  labels      Label[]
  activities  Activity[]

  @@map("boards")
}

// ... other models following the database schema
```

### **Database Connection**
```typescript
// src/utils/database.ts
import { PrismaClient } from '@prisma/client';
import logger from './logger';

class Database {
  private static instance: Database;
  public prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'info', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
    });

    // Log database queries in development
    if (process.env.NODE_ENV === 'development') {
      this.prisma.$on('query', (e) => {
        logger.debug(`Query: ${e.query}`);
        logger.debug(`Duration: ${e.duration}ms`);
      });
    }

    this.prisma.$on('error', (e) => {
      logger.error('Database error:', e);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      logger.info('✅ Database connected successfully');
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
    logger.info('Database disconnected');
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}

export default Database.getInstance();
```

## 🔐 **Authentication System**

### **JWT Configuration**
```typescript
// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

interface JwtPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

class JwtService {
  private accessTokenSecret = process.env.JWT_ACCESS_SECRET!;
  private refreshTokenSecret = process.env.JWT_REFRESH_SECRET!;
  private accessTokenExpiry = '15m';
  private refreshTokenExpiry = '7d';

  generateTokenPair(user: User): TokenPair {
    const accessTokenPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      type: 'access'
    };

    const refreshTokenPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      type: 'refresh'
    };

    const accessToken = jwt.sign(
      accessTokenPayload,
      this.accessTokenSecret,
      { expiresIn: this.accessTokenExpiry }
    );

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      this.refreshTokenSecret,
      { expiresIn: this.refreshTokenExpiry }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60 // 15 minutes in seconds
    };
  }

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, this.accessTokenSecret) as JwtPayload;
  }

  verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, this.refreshTokenSecret) as JwtPayload;
  }

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

export default new JwtService();
```

### **Authentication Middleware**
```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwtService from '../utils/jwt';
import database from '../utils/database';
import { ApiError } from '../utils/errors';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = jwtService.extractTokenFromHeader(authHeader || '');

    if (!token) {
      throw new ApiError('Access token required', 401);
    }

    const payload = jwtService.verifyAccessToken(token);
    
    // Verify user still exists and is active
    const user = await database.prisma.user.findFirst({
      where: {
        id: payload.userId,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        isActive: true
      }
    });

    if (!user) {
      throw new ApiError('User not found or inactive', 401);
    }

    req.user = {
      id: user.id,
      email: user.email
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = jwtService.extractTokenFromHeader(authHeader || '');

    if (token) {
      const payload = jwtService.verifyAccessToken(token);
      const user = await database.prisma.user.findFirst({
        where: { id: payload.userId, isActive: true }
      });

      if (user) {
        req.user = {
          id: user.id,
          email: user.email
        };
      }
    }

    next();
  } catch (error) {
    // For optional auth, continue even if token is invalid
    next();
  }
};
```

## 🛡️ **Authorization System**

### **Permission Middleware**
```typescript
// src/middleware/permissions.middleware.ts
import { Request, Response, NextFunction } from 'express';
import database from '../utils/database';
import { ApiError } from '../utils/errors';
import { BoardMemberRole } from '@prisma/client';

interface PermissionRequest extends Request {
  user: { id: string; email: string };
  params: { [key: string]: string };
}

export const requireBoardAccess = (requiredRole?: BoardMemberRole) => {
  return async (req: PermissionRequest, res: Response, next: NextFunction) => {
    try {
      const boardId = req.params.boardId || req.params.id;
      
      if (!boardId) {
        throw new ApiError('Board ID required', 400);
      }

      const membership = await database.prisma.boardMember.findFirst({
        where: {
          boardId,
          userId: req.user.id
        },
        include: {
          board: {
            select: {
              id: true,
              visibility: true,
              createdBy: true
            }
          }
        }
      });

      // Check if user is board creator
      const isCreator = membership?.board.createdBy === req.user.id;

      // Check if board is public and user has at least observer access
      const hasPublicAccess = membership?.board.visibility === 'PUBLIC';

      if (!membership && !isCreator && !hasPublicAccess) {
        throw new ApiError('Board not found or access denied', 404);
      }

      // Check required role
      if (requiredRole && membership) {
        const roleHierarchy = {
          OBSERVER: 1,
          MEMBER: 2,
          ADMIN: 3,
          OWNER: 4
        };

        const userRoleLevel = roleHierarchy[membership.role];
        const requiredRoleLevel = roleHierarchy[requiredRole];

        if (userRoleLevel < requiredRoleLevel && !isCreator) {
          throw new ApiError('Insufficient permissions', 403);
        }
      }

      // Add board info to request
      req.boardMembership = membership;
      req.isCreator = isCreator;
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireCardAccess = () => {
  return async (req: PermissionRequest, res: Response, next: NextFunction) => {
    try {
      const cardId = req.params.cardId || req.params.id;
      
      const card = await database.prisma.card.findFirst({
        where: { id: cardId },
        include: {
          column: {
            select: {
              boardId: true
            }
          }
        }
      });

      if (!card) {
        throw new ApiError('Card not found', 404);
      }

      // Check board access
      req.params.boardId = card.column.boardId;
      return requireBoardAccess()(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
```

## 📊 **Service Layer Architecture**

### **Base Service**
```typescript
// src/services/base.service.ts
import database from '../utils/database';
import logger from '../utils/logger';
import { ApiError } from '../utils/errors';

export abstract class BaseService {
  protected db = database.prisma;
  protected logger = logger;

  protected handleError(error: any, context: string): never {
    this.logger.error(`Error in ${context}:`, error);
    
    if (error instanceof ApiError) {
      throw error;
    }

    if (error.code === 'P2002') {
      throw new ApiError('Resource already exists', 409);
    }

    if (error.code === 'P2025') {
      throw new ApiError('Resource not found', 404);
    }

    throw new ApiError('Internal server error', 500);
  }

  protected async executeWithTransaction<T>(
    operation: (tx: any) => Promise<T>
  ): Promise<T> {
    return await this.db.$transaction(operation);
  }
}
```

### **Board Service**
```typescript
// src/services/board.service.ts
import { BaseService } from './base.service';
import { Board, BoardMember, Column, Prisma } from '@prisma/client';
import { ApiError } from '../utils/errors';
import activityService from './activity.service';

interface CreateBoardData {
  title: string;
  description?: string;
  backgroundType?: 'COLOR' | 'GRADIENT' | 'IMAGE';
  backgroundValue?: string;
  visibility?: 'PRIVATE' | 'WORKSPACE' | 'PUBLIC';
  workspaceId?: string;
}

interface UpdateBoardData {
  title?: string;
  description?: string;
  backgroundType?: 'COLOR' | 'GRADIENT' | 'IMAGE';
  backgroundValue?: string;
  visibility?: 'PRIVATE' | 'WORKSPACE' | 'PUBLIC';
  isClosed?: boolean;
}

class BoardService extends BaseService {
  async createBoard(userId: string, data: CreateBoardData): Promise<Board> {
    try {
      return await this.executeWithTransaction(async (tx) => {
        // Create board
        const board = await tx.board.create({
          data: {
            ...data,
            createdBy: userId,
          }
        });

        // Add creator as owner
        await tx.boardMember.create({
          data: {
            boardId: board.id,
            userId: userId,
            role: 'OWNER'
          }
        });

        // Create default columns
        const defaultColumns = [
          { title: 'To Do', position: 0 },
          { title: 'In Progress', position: 1 },
          { title: 'Done', position: 2 }
        ];

        await tx.column.createMany({
          data: defaultColumns.map(col => ({
            ...col,
            boardId: board.id
          }))
        });

        // Create default labels
        const defaultLabels = [
          { name: 'High Priority', color: '#eb5a46' },
          { name: 'Medium Priority', color: '#f2d600' },
          { name: 'Low Priority', color: '#61bd4f' },
          { name: 'Bug', color: '#ff5630' },
          { name: 'Feature', color: '#0079bf' },
        ];

        await tx.label.createMany({
          data: defaultLabels.map(label => ({
            ...label,
            boardId: board.id
          }))
        });

        // Log activity
        await activityService.createActivity({
          userId,
          boardId: board.id,
          actionType: 'CREATE_BOARD',
          entityType: 'BOARD',
          entityId: board.id,
          details: { boardTitle: board.title }
        });

        return board;
      });
    } catch (error) {
      this.handleError(error, 'BoardService.createBoard');
    }
  }

  async getBoardById(
    boardId: string, 
    userId?: string,
    includeArchived = false
  ): Promise<Board & { 
    columns: (Column & { cards: any[] })[];
    members: BoardMember[];
    labels: any[];
  }> {
    try {
      const board = await this.db.board.findFirst({
        where: { 
          id: boardId,
          ...(includeArchived ? {} : { isClosed: false })
        },
        include: {
          columns: {
            where: { 
              ...(includeArchived ? {} : { isArchived: false })
            },
            orderBy: { position: 'asc' },
            include: {
              cards: {
                where: {
                  ...(includeArchived ? {} : { isArchived: false })
                },
                orderBy: { position: 'asc' },
                include: {
                  labels: {
                    include: { label: true }
                  },
                  members: {
                    include: { user: true }
                  }
                }
              }
            }
          },
          members: {
            include: { user: true }
          },
          labels: true
        }
      });

      if (!board) {
        throw new ApiError('Board not found', 404);
      }

      return board;
    } catch (error) {
      this.handleError(error, 'BoardService.getBoardById');
    }
  }

  async updateBoard(
    boardId: string, 
    userId: string, 
    data: UpdateBoardData
  ): Promise<Board> {
    try {
      const board = await this.db.board.update({
        where: { id: boardId },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });

      // Log activity
      await activityService.createActivity({
        userId,
        boardId,
        actionType: 'UPDATE_BOARD',
        entityType: 'BOARD',
        entityId: boardId,
        details: { changes: data }
      });

      return board;
    } catch (error) {
      this.handleError(error, 'BoardService.updateBoard');
    }
  }

  async deleteBoard(boardId: string, userId: string): Promise<void> {
    try {
      await this.db.board.delete({
        where: { id: boardId }
      });

      // Log activity
      await activityService.createActivity({
        userId,
        boardId,
        actionType: 'DELETE_BOARD',
        entityType: 'BOARD',
        entityId: boardId
      });
    } catch (error) {
      this.handleError(error, 'BoardService.deleteBoard');
    }
  }

  async getUserBoards(
    userId: string,
    options: {
      workspaceId?: string;
      starred?: boolean;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{ boards: Board[]; totalCount: number }> {
    try {
      const { workspaceId, starred, page = 1, limit = 20 } = options;
      const skip = (page - 1) * limit;

      const whereClause: Prisma.BoardWhereInput = {
        isClosed: false,
        members: {
          some: {
            userId,
            ...(starred ? { isStarred: true } : {})
          }
        },
        ...(workspaceId ? { workspaceId } : {})
      };

      const [boards, totalCount] = await Promise.all([
        this.db.board.findMany({
          where: whereClause,
          include: {
            creator: {
              select: { fullName: true }
            },
            _count: {
              select: {
                columns: { where: { isArchived: false } },
                members: true
              }
            }
          },
          orderBy: { updatedAt: 'desc' },
          skip,
          take: limit
        }),
        this.db.board.count({ where: whereClause })
      ]);

      return { boards, totalCount };
    } catch (error) {
      this.handleError(error, 'BoardService.getUserBoards');
    }
  }

  async toggleBoardStar(
    boardId: string, 
    userId: string
  ): Promise<{ isStarred: boolean }> {
    try {
      const membership = await this.db.boardMember.findFirst({
        where: { boardId, userId }
      });

      if (!membership) {
        throw new ApiError('Board membership not found', 404);
      }

      const updated = await this.db.boardMember.update({
        where: { id: membership.id },
        data: { isStarred: !membership.isStarred }
      });

      return { isStarred: updated.isStarred };
    } catch (error) {
      this.handleError(error, 'BoardService.toggleBoardStar');
    }
  }
}

export default new BoardService();
```

## 🔄 **WebSocket Integration**

### **Socket.IO Setup**
```typescript
// src/websocket/index.ts
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwtService from '../utils/jwt';
import database from '../utils/database';
import logger from '../utils/logger';
import { BoardEventHandlers } from './boardEvents';

interface SocketData {
  userId: string;
  email: string;
}

class WebSocketServer {
  private io: Server;
  private boardHandlers: BoardEventHandlers;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true
      }
    });

    this.boardHandlers = new BoardEventHandlers(this.io);
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || 
                     socket.handshake.headers.authorization?.replace('Bearer ', '');

        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const payload = jwtService.verifyAccessToken(token);
        
        const user = await database.prisma.user.findFirst({
          where: { id: payload.userId, isActive: true }
        });

        if (!user) {
          return next(new Error('User not found'));
        }

        socket.data = {
          userId: user.id,
          email: user.email
        } as SocketData;

        logger.info(`User ${user.email} connected via WebSocket`);
        next();
      } catch (error) {
        logger.error('WebSocket authentication failed:', error);
        next(new Error('Authentication failed'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      // Join user to their personal room
      socket.join(`user:${socket.data.userId}`);

      // Board events
      socket.on('join:board', (boardId: string) => {
        this.boardHandlers.handleJoinBoard(socket, boardId);
      });

      socket.on('leave:board', (boardId: string) => {
        this.boardHandlers.handleLeaveBoard(socket, boardId);
      });

      // Card events
      socket.on('card:move', (data) => {
        this.boardHandlers.handleCardMove(socket, data);
      });

      socket.on('card:update', (data) => {
        this.boardHandlers.handleCardUpdate(socket, data);
      });

      // Typing indicators
      socket.on('typing:start', (data) => {
        socket.to(`board:${data.boardId}`).emit('user:typing', {
          userId: socket.data.userId,
          cardId: data.cardId
        });
      });

      socket.on('typing:stop', (data) => {
        socket.to(`board:${data.boardId}`).emit('user:stop-typing', {
          userId: socket.data.userId,
          cardId: data.cardId
        });
      });

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  // Emit to specific board
  public emitToBoardMembers(boardId: string, event: string, data: any) {
    this.io.to(`board:${boardId}`).emit(event, data);
  }

  // Emit to specific user
  public emitToUser(userId: string, event: string, data: any) {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  // Broadcast to all connected clients
  public broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }
}

export default WebSocketServer;
```

### **Board Event Handlers**
```typescript
// src/websocket/boardEvents.ts
import { Server, Socket } from 'socket.io';
import database from '../utils/database';
import logger from '../utils/logger';

export class BoardEventHandlers {
  constructor(private io: Server) {}

  async handleJoinBoard(socket: Socket, boardId: string) {
    try {
      // Verify user has access to board
      const membership = await database.prisma.boardMember.findFirst({
        where: {
          boardId,
          userId: socket.data.userId
        }
      });

      if (!membership) {
        socket.emit('error', { message: 'Board access denied' });
        return;
      }

      socket.join(`board:${boardId}`);
      
      // Notify other board members
      socket.to(`board:${boardId}`).emit('user:joined', {
        userId: socket.data.userId,
        email: socket.data.email
      });

      logger.info(`User ${socket.data.userId} joined board ${boardId}`);
    } catch (error) {
      logger.error('Error joining board:', error);
      socket.emit('error', { message: 'Failed to join board' });
    }
  }

  async handleLeaveBoard(socket: Socket, boardId: string) {
    socket.leave(`board:${boardId}`);
    
    socket.to(`board:${boardId}`).emit('user:left', {
      userId: socket.data.userId
    });

    logger.info(`User ${socket.data.userId} left board ${boardId}`);
  }

  async handleCardMove(socket: Socket, data: {
    cardId: string;
    sourceColumnId: string;
    targetColumnId: string;
    position: number;
    boardId: string;
  }) {
    try {
      // Verify user has board access
      const hasAccess = await this.verifyBoardAccess(
        socket.data.userId, 
        data.boardId
      );

      if (!hasAccess) {
        socket.emit('error', { message: 'Board access denied' });
        return;
      }

      // Emit real-time update to other board members
      socket.to(`board:${data.boardId}`).emit('card:moved', {
        cardId: data.cardId,
        sourceColumnId: data.sourceColumnId,
        targetColumnId: data.targetColumnId,
        position: data.position,
        movedBy: socket.data.userId
      });

    } catch (error) {
      logger.error('Error handling card move:', error);
      socket.emit('error', { message: 'Failed to move card' });
    }
  }

  async handleCardUpdate(socket: Socket, data: {
    cardId: string;
    updates: any;
    boardId: string;
  }) {
    try {
      const hasAccess = await this.verifyBoardAccess(
        socket.data.userId, 
        data.boardId
      );

      if (!hasAccess) {
        socket.emit('error', { message: 'Board access denied' });
        return;
      }

      socket.to(`board:${data.boardId}`).emit('card:updated', {
        cardId: data.cardId,
        updates: data.updates,
        updatedBy: socket.data.userId
      });

    } catch (error) {
      logger.error('Error handling card update:', error);
    }
  }

  private async verifyBoardAccess(
    userId: string, 
    boardId: string
  ): Promise<boolean> {
    const membership = await database.prisma.boardMember.findFirst({
      where: { boardId, userId }
    });
    return !!membership;
  }
}
```

## 📝 **API Controller Example**

### **Card Controller**
```typescript
// src/controllers/card.controller.ts
import { Request, Response, NextFunction } from 'express';
import cardService from '../services/card.service';
import { CreateCardSchema, UpdateCardSchema } from '../utils/validation';
import { ApiResponse } from '../types/api.types';

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string };
}

class CardController {
  async createCard(
    req: AuthenticatedRequest, 
    res: Response, 
    next: NextFunction
  ): Promise<void> {
    try {
      const { columnId } = req.params;
      const validatedData = CreateCardSchema.parse(req.body);

      const card = await cardService.createCard(
        columnId,
        req.user.id,
        validatedData
      );

      const response: ApiResponse<typeof card> = {
        success: true,
        data: card,
        message: 'Card created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getCard(
    req: AuthenticatedRequest,
    res: Response, 
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      
      const card = await cardService.getCardById(id);

      const response: ApiResponse<typeof card> = {
        success: true,
        data: card
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateCard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = UpdateCardSchema.parse(req.body);

      const card = await cardService.updateCard(
        id,
        req.user.id,
        validatedData
      );

      const response: ApiResponse<typeof card> = {
        success: true,
        data: card,
        message: 'Card updated successfully'
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async moveCard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { targetColumnId, position } = req.body;

      await cardService.moveCard(id, targetColumnId, position, req.user.id);

      const response: ApiResponse<null> = {
        success: true,
        message: 'Card moved successfully'
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteCard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      await cardService.deleteCard(id, req.user.id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new CardController();
```

## 🔧 **Utility Classes**

### **Error Handling**
```typescript
// src/utils/errors.ts
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    message: string, 
    statusCode: number = 500, 
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import logger from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
      statusCode: error.statusCode
    });
    return;
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    
    switch (prismaError.code) {
      case 'P2002':
        res.status(409).json({
          success: false,
          error: 'Resource already exists',
          statusCode: 409
        });
        return;
      case 'P2025':
        res.status(404).json({
          success: false,
          error: 'Resource not found',
          statusCode: 404
        });
        return;
    }
  }

  // Default error
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    statusCode: 500
  });
};
```

### **Validation Schemas**
```typescript
// src/utils/validation.ts
import { z } from 'zod';

export const CreateBoardSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  backgroundType: z.enum(['COLOR', 'GRADIENT', 'IMAGE']).optional(),
  backgroundValue: z.string().optional(),
  visibility: z.enum(['PRIVATE', 'WORKSPACE', 'PUBLIC']).optional(),
  workspaceId: z.string().uuid().optional()
});

export const UpdateBoardSchema = CreateBoardSchema.partial();

export const CreateCardSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  position: z.number().int().min(0).optional(),
  dueDate: z.string().datetime().optional(),
  coverColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional()
});

export const UpdateCardSchema = CreateCardSchema.partial().extend({
  isCompleted: z.boolean().optional(),
  isArchived: z.boolean().optional()
});

export const CreateColumnSchema = z.object({
  title: z.string().min(1).max(255),
  position: z.number().int().min(0).optional()
});

export const CreateCommentSchema = z.object({
  content: z.string().min(1).max(5000)
});
```

Đây là kiến trúc backend hoàn chỉnh cho ứng dụng Trello clone! 🚀