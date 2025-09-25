import type { Board } from '../pages/Dashboard/components';

// Mock data cho boards
export const mockBoards: Board[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Complete website redesign project',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    isStarred: true,
    members: [
      { id: '1', name: 'John Doe', avatar: 'JD' },
      { id: '2', name: 'Jane Smith', avatar: 'JS' },
      { id: '3', name: 'Mike Johnson', avatar: 'MJ' },
    ],
    progress: 75,
    totalTasks: 24,
    completedTasks: 18,
    lastUpdated: '2 hours ago',
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'React Native mobile application',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    isStarred: false,
    members: [
      { id: '1', name: 'John Doe', avatar: 'JD' },
      { id: '4', name: 'Sarah Wilson', avatar: 'SW' },
    ],
    progress: 45,
    totalTasks: 32,
    completedTasks: 14,
    lastUpdated: '5 hours ago',
  },
  {
    id: '3',
    title: 'Marketing Campaign',
    description: 'Q4 marketing strategy and execution',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    isStarred: true,
    members: [
      { id: '5', name: 'Emily Davis', avatar: 'ED' },
      { id: '6', name: 'David Brown', avatar: 'DB' },
    ],
    progress: 60,
    totalTasks: 18,
    completedTasks: 11,
    lastUpdated: '1 day ago',
  },
  {
    id: '4',
    title: 'Product Launch',
    description: 'New product launch preparation',
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    isStarred: false,
    members: [
      { id: '7', name: 'Lisa Chen', avatar: 'LC' },
      { id: '8', name: 'Tom Wilson', avatar: 'TW' },
      { id: '9', name: 'Anna Lee', avatar: 'AL' },
    ],
    progress: 30,
    totalTasks: 28,
    completedTasks: 8,
    lastUpdated: '3 hours ago',
  },
];