// 🗄️ Mock Database for Trello Clone
// Based on the database schema designed in database-models.md

import type {
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
} from './frontend/src/types';

// 🎭 Mock Data Implementation
class MockDatabase {
  public users: User[] = [];
  public workspaces: Workspace[] = [];
  public boards: Board[] = [];
  public columns: Column[] = [];
  public cards: Card[] = [];
  public labels: Label[] = [];
  public boardMembers: BoardMember[] = [];
  public cardMembers: CardMember[] = [];
  public cardLabels: CardLabel[] = [];
  public checklists: Checklist[] = [];
  public checklistItems: ChecklistItem[] = [];
  public comments: Comment[] = [];
  public attachments: Attachment[] = [];
  public activities: Activity[] = [];
  public notifications: Notification[] = [];
  public workspaceMembers: WorkspaceMember[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create mock users
    this.users = [
      {
        id: 'user-1',
        username: 'johndoe',
        email: 'john@example.com',
        passwordHash: '$2b$10$hashedpassword1',
        fullName: 'John Doe',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        initials: 'JD',
        isActive: true,
        lastLoginAt: new Date('2025-09-25T10:00:00Z'),
        createdAt: new Date('2025-01-15T08:00:00Z'),
        updatedAt: new Date('2025-09-25T10:00:00Z'),
      },
      {
        id: 'user-2',
        username: 'janesmith',
        email: 'jane@example.com',
        passwordHash: '$2b$10$hashedpassword2',
        fullName: 'Jane Smith',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
        initials: 'JS',
        isActive: true,
        lastLoginAt: new Date('2025-09-25T09:30:00Z'),
        createdAt: new Date('2025-02-01T10:00:00Z'),
        updatedAt: new Date('2025-09-25T09:30:00Z'),
      },
      {
        id: 'user-3',
        username: 'mikejohnson',
        email: 'mike@example.com',
        passwordHash: '$2b$10$hashedpassword3',
        fullName: 'Mike Johnson',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
        initials: 'MJ',
        isActive: true,
        lastLoginAt: new Date('2025-09-24T16:45:00Z'),
        createdAt: new Date('2025-03-10T14:20:00Z'),
        updatedAt: new Date('2025-09-24T16:45:00Z'),
      },
      {
        id: 'user-4',
        username: 'sarahwilson',
        email: 'sarah@example.com',
        passwordHash: '$2b$10$hashedpassword4',
        fullName: 'Sarah Wilson',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        initials: 'SW',
        isActive: true,
        lastLoginAt: new Date('2025-09-25T11:15:00Z'),
        createdAt: new Date('2025-04-05T09:30:00Z'),
        updatedAt: new Date('2025-09-25T11:15:00Z'),
      },
      {
        id: 'user-5',
        username: 'davidbrown',
        email: 'david@example.com',
        passwordHash: '$2b$10$hashedpassword5',
        fullName: 'David Brown',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
        initials: 'DB',
        isActive: true,
        lastLoginAt: new Date('2025-09-25T08:20:00Z'),
        createdAt: new Date('2025-05-12T13:45:00Z'),
        updatedAt: new Date('2025-09-25T08:20:00Z'),
      },
    ];

    // Create mock workspaces
    this.workspaces = [
      {
        id: 'workspace-1',
        name: 'Personal Projects',
        description: 'My personal development projects',
        type: 'personal',
        visibility: 'private',
        createdBy: 'user-1',
        createdAt: new Date('2025-01-15T08:00:00Z'),
        updatedAt: new Date('2025-09-20T10:00:00Z'),
      },
      {
        id: 'workspace-2',
        name: 'Tech Startup',
        description: 'Building the next big thing in tech',
        type: 'team',
        visibility: 'private',
        createdBy: 'user-2',
        createdAt: new Date('2025-03-01T09:00:00Z'),
        updatedAt: new Date('2025-09-25T11:00:00Z'),
      },
    ];

    // Create mock workspace members
    this.workspaceMembers = [
      {
        id: 'ws-member-1',
        workspaceId: 'workspace-1',
        userId: 'user-1',
        role: 'admin',
        joinedAt: new Date('2025-01-15T08:00:00Z'),
      },
      {
        id: 'ws-member-2',
        workspaceId: 'workspace-2',
        userId: 'user-2',
        role: 'admin',
        joinedAt: new Date('2025-03-01T09:00:00Z'),
      },
      {
        id: 'ws-member-3',
        workspaceId: 'workspace-2',
        userId: 'user-3',
        role: 'member',
        joinedAt: new Date('2025-03-05T10:30:00Z'),
      },
      {
        id: 'ws-member-4',
        workspaceId: 'workspace-2',
        userId: 'user-4',
        role: 'member',
        joinedAt: new Date('2025-03-10T14:15:00Z'),
      },
    ];

    // Create mock boards
    this.boards = [
      {
        id: 'board-1',
        title: 'Website Redesign',
        description: 'Complete website redesign project with modern UI/UX',
        backgroundType: 'gradient',
        backgroundValue: 'linear-gradient(135deg, #026AA7 0%, #4A90C2 30%, #5AAC44 70%, #7BC15A 100%)',
        visibility: 'private',
        isClosed: false,
        createdBy: 'user-1',
        workspaceId: 'workspace-1',
        createdAt: new Date('2025-01-20T10:00:00Z'),
        updatedAt: new Date('2025-09-25T12:00:00Z'),
      },
      {
        id: 'board-2',
        title: 'Mobile App Development',
        description: 'Cross-platform mobile application for our startup',
        backgroundType: 'gradient',
        backgroundValue: 'linear-gradient(135deg, #0079bf 0%, #4A9FDF 50%, #61bd4f 100%)',
        visibility: 'workspace',
        isClosed: false,
        createdBy: 'user-2',
        workspaceId: 'workspace-2',
        createdAt: new Date('2025-03-15T09:30:00Z'),
        updatedAt: new Date('2025-09-24T16:00:00Z'),
      },
      {
        id: 'board-3',
        title: 'Marketing Campaign',
        description: 'Q4 marketing campaign planning and execution',
        backgroundType: 'color',
        backgroundValue: '#f2d600',
        visibility: 'workspace',
        isClosed: false,
        createdBy: 'user-3',
        workspaceId: 'workspace-2',
        createdAt: new Date('2025-07-01T11:00:00Z'),
        updatedAt: new Date('2025-09-20T14:30:00Z'),
      },
    ];

    // Create mock board members
    this.boardMembers = [
      {
        id: 'board-member-1',
        boardId: 'board-1',
        userId: 'user-1',
        role: 'owner',
        isStarred: true,
        joinedAt: new Date('2025-01-20T10:00:00Z'),
      },
      {
        id: 'board-member-2',
        boardId: 'board-2',
        userId: 'user-2',
        role: 'owner',
        isStarred: false,
        joinedAt: new Date('2025-03-15T09:30:00Z'),
      },
      {
        id: 'board-member-3',
        boardId: 'board-2',
        userId: 'user-3',
        role: 'admin',
        isStarred: true,
        joinedAt: new Date('2025-03-16T10:00:00Z'),
      },
      {
        id: 'board-member-4',
        boardId: 'board-2',
        userId: 'user-4',
        role: 'member',
        isStarred: false,
        joinedAt: new Date('2025-03-17T11:30:00Z'),
      },
      {
        id: 'board-member-5',
        boardId: 'board-3',
        userId: 'user-3',
        role: 'owner',
        isStarred: false,
        joinedAt: new Date('2025-07-01T11:00:00Z'),
      },
      {
        id: 'board-member-6',
        boardId: 'board-3',
        userId: 'user-2',
        role: 'member',
        isStarred: true,
        joinedAt: new Date('2025-07-02T09:15:00Z'),
      },
    ];

    // Create mock labels
    this.labels = [
      // Board 1 labels
      {
        id: 'label-1',
        boardId: 'board-1',
        name: 'High Priority',
        color: '#eb5a46',
        createdAt: new Date('2025-01-20T10:00:00Z'),
      },
      {
        id: 'label-2',
        boardId: 'board-1',
        name: 'Design',
        color: '#f2d600',
        createdAt: new Date('2025-01-20T10:00:00Z'),
      },
      {
        id: 'label-3',
        boardId: 'board-1',
        name: 'Frontend',
        color: '#0079bf',
        createdAt: new Date('2025-01-20T10:00:00Z'),
      },
      {
        id: 'label-4',
        boardId: 'board-1',
        name: 'Review',
        color: '#61bd4f',
        createdAt: new Date('2025-01-20T10:00:00Z'),
      },
      {
        id: 'label-5',
        boardId: 'board-1',
        name: 'Setup',
        color: '#026AA7',
        createdAt: new Date('2025-01-20T10:00:00Z'),
      },
      // Board 2 labels
      {
        id: 'label-6',
        boardId: 'board-2',
        name: 'Bug',
        color: '#ff5630',
        createdAt: new Date('2025-03-15T09:30:00Z'),
      },
      {
        id: 'label-7',
        boardId: 'board-2',
        name: 'Feature',
        color: '#0079bf',
        createdAt: new Date('2025-03-15T09:30:00Z'),
      },
      {
        id: 'label-8',
        boardId: 'board-2',
        name: 'Backend',
        color: '#c377e0',
        createdAt: new Date('2025-03-15T09:30:00Z'),
      },
      // Board 3 labels
      {
        id: 'label-9',
        boardId: 'board-3',
        name: 'Urgent',
        color: '#eb5a46',
        createdAt: new Date('2025-07-01T11:00:00Z'),
      },
      {
        id: 'label-10',
        boardId: 'board-3',
        name: 'Social Media',
        color: '#00c2e0',
        createdAt: new Date('2025-07-01T11:00:00Z'),
      },
    ];

    // Create mock columns
    this.columns = [
      // Board 1 columns
      {
        id: 'column-1',
        boardId: 'board-1',
        title: 'To Do',
        position: 0,
        isArchived: false,
        createdAt: new Date('2025-01-20T10:00:00Z'),
        updatedAt: new Date('2025-01-20T10:00:00Z'),
      },
      {
        id: 'column-2',
        boardId: 'board-1',
        title: 'In Progress',
        position: 1,
        isArchived: false,
        createdAt: new Date('2025-01-20T10:00:00Z'),
        updatedAt: new Date('2025-01-20T10:00:00Z'),
      },
      {
        id: 'column-3',
        boardId: 'board-1',
        title: 'Review',
        position: 2,
        isArchived: false,
        createdAt: new Date('2025-01-20T10:00:00Z'),
        updatedAt: new Date('2025-01-20T10:00:00Z'),
      },
      {
        id: 'column-4',
        boardId: 'board-1',
        title: 'Done',
        position: 3,
        isArchived: false,
        createdAt: new Date('2025-01-20T10:00:00Z'),
        updatedAt: new Date('2025-01-20T10:00:00Z'),
      },
      // Board 2 columns
      {
        id: 'column-5',
        boardId: 'board-2',
        title: 'Backlog',
        position: 0,
        isArchived: false,
        createdAt: new Date('2025-03-15T09:30:00Z'),
        updatedAt: new Date('2025-03-15T09:30:00Z'),
      },
      {
        id: 'column-6',
        boardId: 'board-2',
        title: 'Ready',
        position: 1,
        isArchived: false,
        createdAt: new Date('2025-03-15T09:30:00Z'),
        updatedAt: new Date('2025-03-15T09:30:00Z'),
      },
      {
        id: 'column-7',
        boardId: 'board-2',
        title: 'In Development',
        position: 2,
        isArchived: false,
        createdAt: new Date('2025-03-15T09:30:00Z'),
        updatedAt: new Date('2025-03-15T09:30:00Z'),
      },
      {
        id: 'column-8',
        boardId: 'board-2',
        title: 'Testing',
        position: 3,
        isArchived: false,
        createdAt: new Date('2025-03-15T09:30:00Z'),
        updatedAt: new Date('2025-03-15T09:30:00Z'),
      },
      {
        id: 'column-9',
        boardId: 'board-2',
        title: 'Deployed',
        position: 4,
        isArchived: false,
        createdAt: new Date('2025-03-15T09:30:00Z'),
        updatedAt: new Date('2025-03-15T09:30:00Z'),
      },
    ];

    // Create mock cards
    this.cards = [
      // Board 1 cards
      {
        id: 'card-1',
        columnId: 'column-1',
        title: 'Research user needs',
        description: 'Conduct user interviews and surveys to understand requirements',
        position: 0,
        dueDate: new Date('2025-10-01T00:00:00Z'),
        isCompleted: false,
        isArchived: false,
        createdBy: 'user-1',
        createdAt: new Date('2025-01-21T09:00:00Z'),
        updatedAt: new Date('2025-01-21T09:00:00Z'),
      },
      {
        id: 'card-2',
        columnId: 'column-1',
        title: 'Create wireframes',
        description: 'Design basic layout wireframes for the new website',
        position: 1,
        dueDate: new Date('2025-10-05T00:00:00Z'),
        isCompleted: false,
        isArchived: false,
        createdBy: 'user-1',
        createdAt: new Date('2025-01-22T10:30:00Z'),
        updatedAt: new Date('2025-01-22T10:30:00Z'),
      },
      {
        id: 'card-3',
        columnId: 'column-2',
        title: 'Login page design',
        description: 'Create modern login page with animations and responsive design',
        position: 0,
        dueDate: new Date('2025-09-30T00:00:00Z'),
        isCompleted: false,
        isArchived: false,
        createdBy: 'user-1',
        createdAt: new Date('2025-01-23T14:15:00Z'),
        updatedAt: new Date('2025-09-25T11:00:00Z'),
      },
      {
        id: 'card-4',
        columnId: 'column-3',
        title: 'Homepage mockup',
        description: 'Review and approve homepage design mockup',
        position: 0,
        dueDate: new Date('2025-09-28T00:00:00Z'),
        isCompleted: false,
        isArchived: false,
        createdBy: 'user-1',
        createdAt: new Date('2025-01-24T16:45:00Z'),
        updatedAt: new Date('2025-01-24T16:45:00Z'),
      },
      {
        id: 'card-5',
        columnId: 'column-4',
        title: 'Project setup',
        description: 'Initialize project repository and development environment',
        position: 0,
        dueDate: new Date('2025-09-20T00:00:00Z'),
        isCompleted: true,
        isArchived: false,
        createdBy: 'user-1',
        createdAt: new Date('2025-01-20T11:00:00Z'),
        updatedAt: new Date('2025-09-20T17:00:00Z'),
      },
      // Board 2 cards
      {
        id: 'card-6',
        columnId: 'column-5',
        title: 'User authentication system',
        description: 'Implement JWT-based authentication with refresh tokens',
        position: 0,
        dueDate: new Date('2025-10-15T00:00:00Z'),
        isCompleted: false,
        isArchived: false,
        createdBy: 'user-2',
        createdAt: new Date('2025-03-16T09:00:00Z'),
        updatedAt: new Date('2025-03-16T09:00:00Z'),
      },
      {
        id: 'card-7',
        columnId: 'column-6',
        title: 'Database schema design',
        description: 'Design PostgreSQL schema with proper relationships and indexes',
        position: 0,
        dueDate: new Date('2025-10-10T00:00:00Z'),
        isCompleted: false,
        isArchived: false,
        createdBy: 'user-3',
        createdAt: new Date('2025-03-17T10:30:00Z'),
        updatedAt: new Date('2025-09-24T15:00:00Z'),
      },
      {
        id: 'card-8',
        columnId: 'column-7',
        title: 'API endpoints implementation',
        description: 'Build REST API endpoints with proper validation and error handling',
        position: 0,
        dueDate: new Date('2025-10-08T00:00:00Z'),
        isCompleted: false,
        isArchived: false,
        createdBy: 'user-4',
        createdAt: new Date('2025-03-18T14:20:00Z'),
        updatedAt: new Date('2025-09-25T09:30:00Z'),
      },
    ];

    // Create mock card members
    this.cardMembers = [
      {
        id: 'card-member-1',
        cardId: 'card-1',
        userId: 'user-1',
        assignedAt: new Date('2025-01-21T09:00:00Z'),
        assignedBy: 'user-1',
      },
      {
        id: 'card-member-2',
        cardId: 'card-1',
        userId: 'user-2',
        assignedAt: new Date('2025-01-21T09:15:00Z'),
        assignedBy: 'user-1',
      },
      {
        id: 'card-member-3',
        cardId: 'card-3',
        userId: 'user-1',
        assignedAt: new Date('2025-01-23T14:15:00Z'),
        assignedBy: 'user-1',
      },
      {
        id: 'card-member-4',
        cardId: 'card-4',
        userId: 'user-3',
        assignedAt: new Date('2025-01-24T16:45:00Z'),
        assignedBy: 'user-1',
      },
      {
        id: 'card-member-5',
        cardId: 'card-5',
        userId: 'user-1',
        assignedAt: new Date('2025-01-20T11:00:00Z'),
        assignedBy: 'user-1',
      },
      {
        id: 'card-member-6',
        cardId: 'card-5',
        userId: 'user-3',
        assignedAt: new Date('2025-01-20T11:30:00Z'),
        assignedBy: 'user-1',
      },
    ];

    // Create mock card labels
    this.cardLabels = [
      {
        id: 'card-label-1',
        cardId: 'card-1',
        labelId: 'label-1',
        createdAt: new Date('2025-01-21T09:00:00Z'),
      },
      {
        id: 'card-label-2',
        cardId: 'card-2',
        labelId: 'label-2',
        createdAt: new Date('2025-01-22T10:30:00Z'),
      },
      {
        id: 'card-label-3',
        cardId: 'card-3',
        labelId: 'label-3',
        createdAt: new Date('2025-01-23T14:15:00Z'),
      },
      {
        id: 'card-label-4',
        cardId: 'card-3',
        labelId: 'label-2',
        createdAt: new Date('2025-01-23T14:15:00Z'),
      },
      {
        id: 'card-label-5',
        cardId: 'card-4',
        labelId: 'label-4',
        createdAt: new Date('2025-01-24T16:45:00Z'),
      },
      {
        id: 'card-label-6',
        cardId: 'card-5',
        labelId: 'label-5',
        createdAt: new Date('2025-01-20T11:00:00Z'),
      },
      {
        id: 'card-label-7',
        cardId: 'card-6',
        labelId: 'label-7',
        createdAt: new Date('2025-03-16T09:00:00Z'),
      },
      {
        id: 'card-label-8',
        cardId: 'card-7',
        labelId: 'label-6',
        createdAt: new Date('2025-03-17T10:30:00Z'),
      },
      {
        id: 'card-label-9',
        cardId: 'card-8',
        labelId: 'label-8',
        createdAt: new Date('2025-03-18T14:20:00Z'),
      },
    ];

    // Create mock checklists
    this.checklists = [
      {
        id: 'checklist-1',
        cardId: 'card-3',
        title: 'Design Tasks',
        position: 0,
        createdAt: new Date('2025-01-23T14:30:00Z'),
        updatedAt: new Date('2025-09-25T11:00:00Z'),
      },
      {
        id: 'checklist-2',
        cardId: 'card-6',
        title: 'Authentication Requirements',
        position: 0,
        createdAt: new Date('2025-03-16T09:15:00Z'),
        updatedAt: new Date('2025-03-16T09:15:00Z'),
      },
    ];

    // Create mock checklist items
    this.checklistItems = [
      {
        id: 'checklist-item-1',
        checklistId: 'checklist-1',
        content: 'Research competitors',
        isCompleted: true,
        position: 0,
        assignedTo: 'user-1',
        completedAt: new Date('2025-09-20T10:00:00Z'),
        completedBy: 'user-1',
        createdAt: new Date('2025-01-23T14:30:00Z'),
        updatedAt: new Date('2025-09-20T10:00:00Z'),
      },
      {
        id: 'checklist-item-2',
        checklistId: 'checklist-1',
        content: 'Create wireframes',
        isCompleted: false,
        position: 1,
        assignedTo: 'user-1',
        createdAt: new Date('2025-01-23T14:35:00Z'),
        updatedAt: new Date('2025-01-23T14:35:00Z'),
      },
      {
        id: 'checklist-item-3',
        checklistId: 'checklist-1',
        content: 'Design mockups',
        isCompleted: false,
        position: 2,
        assignedTo: 'user-3',
        createdAt: new Date('2025-01-23T14:40:00Z'),
        updatedAt: new Date('2025-01-23T14:40:00Z'),
      },
      {
        id: 'checklist-item-4',
        checklistId: 'checklist-2',
        content: 'JWT token implementation',
        isCompleted: false,
        position: 0,
        assignedTo: 'user-2',
        createdAt: new Date('2025-03-16T09:15:00Z'),
        updatedAt: new Date('2025-03-16T09:15:00Z'),
      },
      {
        id: 'checklist-item-5',
        checklistId: 'checklist-2',
        content: 'Password hashing',
        isCompleted: true,
        position: 1,
        assignedTo: 'user-2',
        completedAt: new Date('2025-03-18T11:00:00Z'),
        completedBy: 'user-2',
        createdAt: new Date('2025-03-16T09:20:00Z'),
        updatedAt: new Date('2025-03-18T11:00:00Z'),
      },
    ];

    // Create mock comments
    this.comments = [
      {
        id: 'comment-1',
        cardId: 'card-3',
        userId: 'user-1',
        content: 'The design looks great! I love the new color scheme.',
        isEdited: false,
        createdAt: new Date('2025-01-25T09:30:00Z'),
        updatedAt: new Date('2025-01-25T09:30:00Z'),
      },
      {
        id: 'comment-2',
        cardId: 'card-3',
        userId: 'user-3',
        content: 'Thanks! I\'ve updated the wireframes based on your feedback.',
        isEdited: false,
        createdAt: new Date('2025-01-25T10:15:00Z'),
        updatedAt: new Date('2025-01-25T10:15:00Z'),
      },
      {
        id: 'comment-3',
        cardId: 'card-7',
        userId: 'user-3',
        content: 'Database schema is ready for review. Let me know if you need any changes.',
        isEdited: false,
        createdAt: new Date('2025-03-17T11:00:00Z'),
        updatedAt: new Date('2025-03-17T11:00:00Z'),
      },
      {
        id: 'comment-4',
        cardId: 'card-8',
        userId: 'user-4',
        content: 'API endpoints are implemented. Testing in progress.',
        isEdited: true,
        editedAt: new Date('2025-09-25T10:00:00Z'),
        createdAt: new Date('2025-03-20T14:30:00Z'),
        updatedAt: new Date('2025-09-25T10:00:00Z'),
      },
    ];

    // Create mock attachments
    this.attachments = [
      {
        id: 'attachment-1',
        cardId: 'card-2',
        filename: 'wireframe-v1.png',
        originalFilename: 'Homepage Wireframe v1.png',
        fileSize: 2457600, // 2.4MB
        mimeType: 'image/png',
        fileUrl: 'https://example.com/uploads/wireframe-v1.png',
        thumbnailUrl: 'https://example.com/uploads/thumbnails/wireframe-v1-thumb.png',
        isCover: false,
        uploadedBy: 'user-1',
        uploadedAt: new Date('2025-01-22T11:00:00Z'),
      },
      {
        id: 'attachment-2',
        cardId: 'card-4',
        filename: 'homepage-mockup.jpg',
        originalFilename: 'Homepage Mockup Final.jpg',
        fileSize: 5120000, // 5MB
        mimeType: 'image/jpeg',
        fileUrl: 'https://example.com/uploads/homepage-mockup.jpg',
        thumbnailUrl: 'https://example.com/uploads/thumbnails/homepage-mockup-thumb.jpg',
        isCover: true,
        uploadedBy: 'user-3',
        uploadedAt: new Date('2025-01-24T17:00:00Z'),
      },
      {
        id: 'attachment-3',
        cardId: 'card-7',
        filename: 'database-schema.pdf',
        originalFilename: 'Database Schema Documentation.pdf',
        fileSize: 1024000, // 1MB
        mimeType: 'application/pdf',
        fileUrl: 'https://example.com/uploads/database-schema.pdf',
        isCover: false,
        uploadedBy: 'user-3',
        uploadedAt: new Date('2025-03-17T10:45:00Z'),
      },
    ];

    // Create mock activities
    this.activities = [
      {
        id: 'activity-1',
        boardId: 'board-1',
        cardId: 'card-1',
        userId: 'user-1',
        actionType: 'create_card',
        entityType: 'card',
        entityId: 'card-1',
        details: { cardTitle: 'Research user needs' },
        createdAt: new Date('2025-01-21T09:00:00Z'),
      },
      {
        id: 'activity-2',
        boardId: 'board-1',
        userId: 'user-1',
        actionType: 'add_board_member',
        entityType: 'member',
        entityId: 'board-member-2',
        details: { memberName: 'Jane Smith', role: 'member' },
        createdAt: new Date('2025-01-21T09:15:00Z'),
      },
      {
        id: 'activity-3',
        boardId: 'board-1',
        cardId: 'card-3',
        userId: 'user-1',
        actionType: 'add_comment',
        entityType: 'comment',
        entityId: 'comment-1',
        details: { commentPreview: 'The design looks great!...' },
        createdAt: new Date('2025-01-25T09:30:00Z'),
      },
      {
        id: 'activity-4',
        boardId: 'board-2',
        userId: 'user-2',
        actionType: 'create_board',
        entityType: 'board',
        entityId: 'board-2',
        details: { boardTitle: 'Mobile App Development' },
        createdAt: new Date('2025-03-15T09:30:00Z'),
      },
      {
        id: 'activity-5',
        boardId: 'board-1',
        cardId: 'card-5',
        userId: 'user-1',
        actionType: 'complete_card',
        entityType: 'card',
        entityId: 'card-5',
        details: { cardTitle: 'Project setup' },
        createdAt: new Date('2025-09-20T17:00:00Z'),
      },
    ];

    // Create mock notifications
    this.notifications = [
      {
        id: 'notification-1',
        userId: 'user-2',
        type: 'card_assigned',
        title: 'You were assigned to a card',
        message: 'John assigned you to "Research user needs"',
        entityType: 'card',
        entityId: 'card-1',
        isRead: false,
        createdAt: new Date('2025-01-21T09:15:00Z'),
      },
      {
        id: 'notification-2',
        userId: 'user-3',
        type: 'comment_added',
        title: 'New comment on your card',
        message: 'John commented on "Login page design"',
        entityType: 'card',
        entityId: 'card-3',
        isRead: true,
        readAt: new Date('2025-01-25T10:30:00Z'),
        createdAt: new Date('2025-01-25T09:30:00Z'),
      },
      {
        id: 'notification-3',
        userId: 'user-1',
        type: 'card_due_soon',
        title: 'Card due soon',
        message: '"Login page design" is due tomorrow',
        entityType: 'card',
        entityId: 'card-3',
        isRead: false,
        createdAt: new Date('2025-09-29T09:00:00Z'),
      },
      {
        id: 'notification-4',
        userId: 'user-4',
        type: 'board_invitation',
        title: 'You were added to a board',
        message: 'Jane added you to "Mobile App Development"',
        entityType: 'board',
        entityId: 'board-2',
        isRead: false,
        createdAt: new Date('2025-03-17T11:30:00Z'),
      },
    ];
  }

  // 🛠️ Database Query Methods
  getUsers() {
    return this.users;
  }

  getUserById(id: string) {
    return this.users.find(user => user.id === id);
  }

  getUserByEmail(email: string) {
    return this.users.find(user => user.email === email);
  }

  getBoards() {
    return this.boards;
  }

  getBoardById(id: string) {
    return this.boards.find(board => board.id === id);
  }

  getUserBoards(userId: string) {
    const userBoardIds = this.boardMembers
      .filter(member => member.userId === userId)
      .map(member => member.boardId);

    return this.boards.filter(board =>
      userBoardIds.includes(board.id) && !board.isClosed
    );
  }

  getBoardColumns(boardId: string) {
    return this.columns
      .filter(column => column.boardId === boardId && !column.isArchived)
      .sort((a, b) => a.position - b.position);
  }

  getColumnCards(columnId: string) {
    return this.cards
      .filter(card => card.columnId === columnId && !card.isArchived)
      .sort((a, b) => a.position - b.position);
  }

  getCardById(id: string) {
    return this.cards.find(card => card.id === id);
  }

  getCardWithDetails(id: string) {
    const card = this.getCardById(id);
    if (!card) return null;

    const labels = this.cardLabels
      .filter(cl => cl.cardId === id)
      .map(cl => this.labels.find(l => l.id === cl.labelId))
      .filter(Boolean);

    const members = this.cardMembers
      .filter(cm => cm.cardId === id)
      .map(cm => this.users.find(u => u.id === cm.userId))
      .filter(Boolean);

    const attachments = this.attachments.filter(a => a.cardId === id);

    const comments = this.comments
      .filter(c => c.cardId === id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map(comment => ({
        ...comment,
        user: this.users.find(u => u.id === comment.userId),
      }));

    const checklists = this.checklists
      .filter(ch => ch.cardId === id)
      .map(checklist => ({
        ...checklist,
        items: this.checklistItems
          .filter(item => item.checklistId === checklist.id)
          .sort((a, b) => a.position - b.position),
      }));

    const activities = this.activities
      .filter(a => a.cardId === id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map(activity => ({
        ...activity,
        user: this.users.find(u => u.id === activity.userId),
      }));

    return {
      ...card,
      labels,
      members,
      attachments,
      comments,
      checklists,
      activities,
    };
  }

  getBoardLabels(boardId: string) {
    return this.labels.filter(label => label.boardId === boardId);
  }

  getBoardMembers(boardId: string) {
    return this.boardMembers
      .filter(member => member.boardId === boardId)
      .map(member => ({
        ...member,
        user: this.users.find(u => u.id === member.userId),
      }));
  }

  getUserNotifications(userId: string, unreadOnly = false) {
    return this.notifications
      .filter(n => n.userId === userId && (!unreadOnly || !n.isRead))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getBoardActivities(boardId: string, limit = 50) {
    return this.activities
      .filter(a => a.boardId === boardId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
      .map(activity => ({
        ...activity,
        user: this.users.find(u => u.id === activity.userId),
      }));
  }

  // 🔄 Mutation Methods (for testing purposes)
  createCard(cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) {
    const newCard: Card = {
      ...cardData,
      id: `card-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.cards.push(newCard);
    return newCard;
  }

  updateCard(id: string, updates: Partial<Card>) {
    const cardIndex = this.cards.findIndex(c => c.id === id);
    if (cardIndex === -1) return null;

    this.cards[cardIndex] = {
      ...this.cards[cardIndex],
      ...updates,
      updatedAt: new Date(),
    };
    return this.cards[cardIndex];
  }

  deleteCard(id: string) {
    const cardIndex = this.cards.findIndex(c => c.id === id);
    if (cardIndex === -1) return false;

    this.cards.splice(cardIndex, 1);
    return true;
  }

  // 📊 Statistics Methods
  getBoardStats(boardId: string) {
    const columns = this.getBoardColumns(boardId);
    const cards = columns.flatMap(col => this.getColumnCards(col.id));

    return {
      totalColumns: columns.length,
      totalCards: cards.length,
      completedCards: cards.filter(c => c.isCompleted).length,
      overdueCards: cards.filter(c =>
        c.dueDate && c.dueDate < new Date() && !c.isCompleted
      ).length,
      totalMembers: this.boardMembers.filter(m => m.boardId === boardId).length,
      totalLabels: this.labels.filter(l => l.boardId === boardId).length,
    };
  }

  getUserStats(userId: string) {
    const userBoards = this.getUserBoards(userId);
    const userCards = this.cardMembers
      .filter(cm => cm.userId === userId)
      .map(cm => this.cards.find(c => c.id === cm.cardId))
      .filter(Boolean);

    return {
      totalBoards: userBoards.length,
      starredBoards: this.boardMembers.filter(m =>
        m.userId === userId && m.isStarred
      ).length,
      totalCards: userCards.length,
      completedCards: userCards.filter(c => c?.isCompleted).length,
      overdueCards: userCards.filter(c =>
        c?.dueDate && c.dueDate < new Date() && !c.isCompleted
      ).length,
      unreadNotifications: this.notifications.filter(n =>
        n.userId === userId && !n.isRead
      ).length,
    };
  }
}

// 📤 Export singleton instance
export const mockDatabase = new MockDatabase();

// 🔍 Helper functions for common queries
export const getMockBoardWithDetails = (boardId: string) => {
  const board = mockDatabase.getBoardById(boardId);
  if (!board) return null;

  const columns = mockDatabase.getBoardColumns(boardId).map(column => ({
    ...column,
    cards: mockDatabase.getColumnCards(column.id).map(card => ({
      ...card,
      labels: mockDatabase.cardLabels
        .filter(cl => cl.cardId === card.id)
        .map(cl => mockDatabase.labels.find(l => l.id === cl.labelId))
        .filter(Boolean),
      members: mockDatabase.cardMembers
        .filter(cm => cm.cardId === card.id)
        .map(cm => mockDatabase.users.find(u => u.id === cm.userId))
        .filter(Boolean),
    })),
  }));

  const members = mockDatabase.getBoardMembers(boardId);
  const labels = mockDatabase.getBoardLabels(boardId);
  const activities = mockDatabase.getBoardActivities(boardId);

  return {
    ...board,
    columns,
    members,
    labels,
    activities,
  };
};

export default mockDatabase;