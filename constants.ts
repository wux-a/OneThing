import { Task } from './types';

export const DEFAULT_TASKS: Task[] = [
  { id: '1', title: '深呼吸 1 分钟', icon: '🌬️', isActive: true },
  { id: '2', title: '喝半杯温水', icon: '🍵', isActive: true },
  { id: '3', title: '看窗外发呆', icon: '🌳', isActive: true },
  { id: '4', title: '给手机充上电', icon: '🔋', isActive: true },
  { id: '5', title: '整理桌面三个垃圾', icon: '🗑️', isActive: true },
  { id: '6', title: '闭眼休息一会儿', icon: '😌', isActive: true },
  { id: '7', title: '伸个懒腰', icon: '🙆', isActive: true },
  { id: '8', title: '洗一把脸', icon: '💧', isActive: true },
];

export const STORAGE_KEYS = {
  TASKS: 'one-thing-tasks-v1',
  LOGS: 'one-thing-logs-v1',
  THEME: 'one-thing-theme',
};

export const CELEBRATION_MESSAGES = [
  "干得漂亮",
  "太棒了",
  "今天也很不错",
  "休息一下吧",
  "这很重要",
  "享受此刻",
];
