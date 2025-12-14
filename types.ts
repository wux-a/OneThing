export interface Task {
  id: string;
  title: string;
  icon: string; // Emoji
  isActive: boolean;
}

export interface TaskLog {
  id: string;
  taskId: string;
  completedAt: number; // Timestamp
}

export type AppView = 'home' | 'settings';
export type CardState = 'idle' | 'active' | 'completed';
