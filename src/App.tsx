import { useState } from 'react';
import {
  DndContext, DragEndEvent, closestCenter, useSensor, useSensors,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import Board from './components/Board/Board';
import { useTasks } from './hooks/useTasks';
import { TaskStatus } from './types';
import { filterTasks } from './utils/taskUtils';
import { SearchIcon } from './components/ui/icons';
import './App.scss';
import TaskModal from './components/ui/TaskModal/TaskModal';
import { Task } from './interfaces/Task';

const App = () => {
  const {
    tasksByStatus, removeTask, updateTask, addTask, moveTask,
  } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');

  // Состояние для модалки: null (закрыта) или статус колонки
  const [modalStatus, setModalStatus] = useState<TaskStatus | null>(null);

  // Настраиваем сенсор, чтобы задача не перетаскивалась при обычном клике
  const sensors = useSensors(
    // Для мыши и тачпада: срабатывает после сдвига на 8px
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // Начинаем drag только после сдвига на 8px
      },
    }),
    // Для сенсорных экранов: долгое нажатие (250мс)
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as number;
    let newStatus = over.id as TaskStatus;

    // Если over.id - число (значит, это id карточки, а не колонки)
    if (typeof over.id === 'number') {
    // Ищем задачу, на которую навели, чтобы узнать её статус
      const overTask = Object.values(tasksByStatus)
        .flat()
        .find((t) => t.id === over.id);

      if (overTask) {
        newStatus = overTask.type;
      }
    }

    // Проверяем, что newStatus валидный
    if (!['todo', 'in_progress', 'review', 'done'].includes(newStatus)) {
      return;
    }

    const currentTask = Object.values(tasksByStatus)
      .flat()
      .find((t) => t.id === taskId);

    if (currentTask && currentTask.type !== newStatus) {
      moveTask(taskId, newStatus);
    }
  };

  const filteredTasksByStatus = Object.keys(tasksByStatus).reduce((acc, key) => {
    const status = key as TaskStatus;
    acc[status] = filterTasks(tasksByStatus[status], searchQuery);
    return acc;
  }, {} as Record<TaskStatus, typeof tasksByStatus['todo']>);

  const handleAddTask = (status: TaskStatus) => {
    setModalStatus(status);
  };
  const handleSaveNewTask = (taskData: Omit<Task, 'id'>) => {
    addTask(taskData);
    setModalStatus(null); // Закрываем модалку
  };

  return (
    <main className="page">
      <header className="app-header">
        <h1 className="app-title">Your tasks</h1>
        <div className="search-bar">
          <SearchIcon className="search-bar__icon" />
          <input
            type="text"
            id="search"
            className="search-bar__input"
            placeholder="поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Board
          tasksByStatus={filteredTasksByStatus}
          onDelete={removeTask}
          onAddTask={handleAddTask}
          onUpdate={updateTask}
        />
      </DndContext>
      {modalStatus && (
        <TaskModal
          status={modalStatus}
          onClose={() => setModalStatus(null)}
          onSave={handleSaveNewTask}
        />
      )}
    </main>
  );
};

export default App;
