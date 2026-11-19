import { Task } from '../interfaces/Task';

export function startOfToday(now: Date = new Date()): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Просрочена ли задача: endDay < сегодня и статус не done */
export function isOverdue(task: Task, now: Date = new Date()): boolean {
  if (task.type === 'done') return false;
  return task.endDay < startOfToday(now);
}

export function formatDay(timestamp: number): string {
  const d = new Date(timestamp);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export function parseDate(dateStr: string): number | null {
  const trimmed = dateStr.trim();
  const match = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

  if (!match) return null;

  const [, dayStr, monthStr, yearStr] = match;
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  // Проверка на валидность календарной даты (например, 31.02.2025 не существует)
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year
    || date.getMonth() !== month - 1
    || date.getDate() !== day
  ) {
    return null; // Дата невалидна (например, 32 января)
  }

  // Возвращаем timestamp на начало дня (локальное время)
  return date.getTime();
}
