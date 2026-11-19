import Column from './Column/Column';
import './Board.scss';
import { TaskStatus } from '../../types';
import { Task } from '../../interfaces/Task';
import { STATUS_COLUMNS } from '../../consts';

interface BoardProps {
  tasksByStatus: Record<TaskStatus, Task[]>;
  onDelete: (id: number) => void;
  onAddTask: (status: TaskStatus) => void;
  onUpdate: (id: number, patch: Partial<Task>) => void;
  // Заготовки для drag&drop (пока не используются)
  // onMoveTask?: (taskId: number, newStatus: TaskStatus) => void;
}

const Board = ({
  tasksByStatus, onDelete, onAddTask, onUpdate,
}: BoardProps) => (
  <div className="board-wrapper">
    <div className="board">
      {STATUS_COLUMNS.map((status) => (
        <Column
          key={status}
          status={status}
          tasks={tasksByStatus[status]}
          onDelete={onDelete}
          onAddTask={onAddTask}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  </div>
);

export default Board;
