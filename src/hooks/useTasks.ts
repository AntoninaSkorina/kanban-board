import { useCallback, useMemo } from 'react';
import initialTasks from '../assets/data/tasks.json';
import { useLocalStorage } from './useLocalStorage';
import { Task } from '../interfaces/Task';
import { TaskStatus } from '../types';

const STORAGE_KEY = 'kanban_tasks';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, initialTasks as Task[]);

  /** Remove task by id */
  const removeTask = useCallback((id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, [setTasks]);

  /** For drag&drop */
  const moveTask = useCallback((id: number, type: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, type } : t)));
  }, [setTasks]);

  const addTask = useCallback((taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(),
    };
    setTasks((prev) => [...prev, newTask]);
  }, [setTasks]);

  /** Edit task */
  const updateTask = useCallback((id: number, patch: Partial<Omit<Task, 'id'>>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, [setTasks]);

  /** Tasks are sorted by startDay asc */
  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.startDay - b.startDay),
    [tasks],
  );

  /** Groupped by Status */
  const tasksByStatus = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      todo: [], in_progress: [], review: [], done: [],
    };

    sortedTasks.forEach((t) => {
      // Проверяем, что такой статус вообще существует в нашем объекте
      if (groups[t.type]) {
        groups[t.type].push(t);
      }
    });

    return groups;
  }, [sortedTasks]);

  return {
    tasks, sortedTasks, tasksByStatus, removeTask, moveTask, updateTask, addTask,
  };
}
