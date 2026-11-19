import { Task } from '../interfaces/Task';
import { formatDay } from './dateUtils';

export function filterTasks(tasks: Task[], query: string): Task[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return tasks;

  const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
  const isDateQuery = dateRegex.test(trimmedQuery);

  if (isDateQuery) {
    return tasks.filter((task) => {
      const startStr = formatDay(task.startDay);
      const endStr = formatDay(task.endDay);
      return startStr === trimmedQuery || endStr === trimmedQuery;
    });
  }

  const lowerQuery = trimmedQuery.toLowerCase();
  return tasks.filter((task) => task.text.toLowerCase().includes(lowerQuery));
}
