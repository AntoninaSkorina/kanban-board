import { TaskStatus } from '../types';

export const STATUS_COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
};
