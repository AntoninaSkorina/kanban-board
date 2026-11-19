import { Task } from '../interfaces/Task';
import { isOverdue, startOfToday } from './dateUtils';

// Фиксированная дата для тестов, чтобы не зависеть от реального времени
const MOCK_NOW = new Date('2025-05-15T12:00:00');

// Хелпер для создания задачи с нужными полями
const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  type: 'todo',
  startDay: MOCK_NOW.getTime() - 86400000, // вчера
  endDay: MOCK_NOW.getTime() + 86400000, // завтра
  text: 'Test task',
  ...overrides,
});

describe('isOverdue', () => {
  it('возвращает false, если дедлайн в будущем', () => {
    const task = createTask({ endDay: MOCK_NOW.getTime() + 86400000 });
    expect(isOverdue(task, MOCK_NOW)).toBe(false);
  });

  it('возвращает true, если дедлайн в прошлом и статус не done', () => {
    const task = createTask({
      endDay: MOCK_NOW.getTime() - 86400000, // вчера
      type: 'in_progress',
    });
    expect(isOverdue(task, MOCK_NOW)).toBe(true);
  });

  it('возвращает false, если задача в статусе done, даже если дедлайн в прошлом', () => {
    const task = createTask({
      endDay: MOCK_NOW.getTime() - 86400000,
      type: 'done',
    });
    expect(isOverdue(task, MOCK_NOW)).toBe(false);
  });

  it('возвращает false, если дедлайн сегодня (граница дня)', () => {
    // Дедлайн — сегодня в 00:00, начало сегодняшнего дня тоже 00:00
    // Значит endDay === startOfToday, и по условию "<" это не просрочка
    const task = createTask({ endDay: startOfToday(MOCK_NOW) });
    expect(isOverdue(task, MOCK_NOW)).toBe(false);
  });

  it('возвращает true, если дедлайн был вчера в 23:59', () => {
    const yesterdayEnd = startOfToday(MOCK_NOW) - 1; // на 1 мс раньше сегодняшнего начала
    const task = createTask({ endDay: yesterdayEnd });
    expect(isOverdue(task, MOCK_NOW)).toBe(true);
  });

  it('корректно работает со всеми статусами кроме done', () => {
    const statuses: Task['type'][] = ['todo', 'in_progress', 'review'];
    statuses.forEach((type) => {
      const task = createTask({
        type,
        endDay: MOCK_NOW.getTime() - 86400000,
      });
      expect(isOverdue(task, MOCK_NOW)).toBe(true);
    });
  });
});
