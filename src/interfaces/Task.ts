import { TaskStatus } from '../types';

export interface Task {
  /** id задачи */
  id: number;
  /** статус задачи */
  type: TaskStatus;
  /** timestamp начала задачи */
  startDay: number;
  /** timestamp дедлайна */
  endDay: number;
  /** описание задачи */
  text: string;
}
