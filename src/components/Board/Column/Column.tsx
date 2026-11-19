import { useDroppable } from '@dnd-kit/core';
import { STATUS_LABELS } from '../../../consts';
import { Task } from '../../../interfaces/Task';
import { TaskStatus } from '../../../types';
import {
  GhostIcon, HappyAltIcon, SmileIcon, UpsideDownIcon,
} from '../../ui/icons';
import TaskCard from '../TaskCard/TaskCard';
import './Column.scss';

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDelete: (id: number) => void;
  onAddTask: (status: TaskStatus) => void;
  onUpdate: (id: number, patch: Partial<Task>) => void;
}

const STATUS_ICONS: Record<TaskStatus, React.ReactNode> = {
  todo: <HappyAltIcon />,
  in_progress: <SmileIcon />,
  review: <UpsideDownIcon />,
  done: <GhostIcon />,
};

const Column = ({
  status, tasks, onDelete, onAddTask, onUpdate,
}: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status, // ID колонки = её статус
  });
  return (
    <section ref={setNodeRef} className={`column ${isOver ? 'column--over' : ''}`} data-status={status}>
      <header className="column__header">
        <h2 className="column__title">
          {STATUS_ICONS[status]}
          {STATUS_LABELS[status]}
        </h2>
        { status === 'todo' && (
        <button
          type="button"
          className="column__add-btn"
          onClick={() => onAddTask(status)}
        >
          + Добавить
        </button>
        )}
      </header>
      <div className="column__list">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={onDelete} onUpdate={onUpdate} />
        ))}
      </div>
    </section>
  );
};

export default Column;
