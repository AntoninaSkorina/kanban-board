/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../../interfaces/Task';
import { formatDay, isOverdue, parseDate } from '../../../utils/dateUtils';
import IconButton from '../../ui/IconButton/IconButton';
import {
  TrashIcon, EditIcon, CheckIcon, CrossIcon,
} from '../../ui/icons'; // Предположим, вы экспортируете SVG оттуда
import './TaskCard.scss';

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
  onUpdate: (id: number, patch: Partial<Task>) => void;
}

const TaskCard = ({ task, onDelete, onUpdate }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Прозрачность при перетаскивании
  };
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editStart, setEditStart] = useState(formatDay(task.startDay));
  const [editEnd, setEditEnd] = useState(formatDay(task.endDay));
  // Состояние для ошибок валидации
  const [errors, setErrors] = useState({ start: false, end: false });

  const overdue = isOverdue(task);
  const showEditBtn = task.type === 'todo';

  const handleSave = () => {
    const startTimestamp = parseDate(editStart);
    const endTimestamp = parseDate(editEnd);
    const trimmedText = editText.trim();

    // Валидация
    const newErrors = {
      start: startTimestamp === null,
      end: endTimestamp === null,
    };
    setErrors(newErrors);

    // Если есть ошибки или пустой текст — прерываем сохранение
    if (newErrors.start || newErrors.end || !trimmedText) {
      return;
    }

    // Все ок, сохраняем
    onUpdate(task.id, {
      text: trimmedText,
      startDay: startTimestamp!,
      endDay: endTimestamp!,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditStart(formatDay(task.startDay));
    setEditEnd(formatDay(task.endDay));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <article className="task-card task-card--editing">
        <div className="task-card__form">
          <div className="task-card__row">
            <label className="task-card__label" htmlFor={`start-${task.id}`}>Начало:</label>
            <input
              id={`start-${task.id}`}
              type="text"
              value={editStart}
              onChange={(e) => setEditStart(e.target.value)}
              className={errors.start ? 'error' : ''}
              placeholder="дд.мм.гггг"
            />
          </div>
          <div className="task-card__row">
            <label className="task-card__label" htmlFor={`end-${task.id}`}>Окончание:</label>
            <input
              id={`end-${task.id}`}
              type="text"
              value={editEnd}
              onChange={(e) => setEditEnd(e.target.value)}
              className={errors.end ? 'error' : ''}
              placeholder="дд.мм.гггг"
            />
          </div>
          <div className="task-card__row">
            <label className="task-card__label" htmlFor={`text-${task.id}`}>Описание:</label>
            <input
              id={`text-${task.id}`}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Текст задачи"
            />
          </div>
        </div>
        <div className="task-card__edit-actions">
          <IconButton variant="filled" className="cancel" onClick={handleCancel}>
            <CrossIcon />
          </IconButton>
          <IconButton variant="filled" className="check" onClick={handleSave}>
            <CheckIcon />
          </IconButton>
        </div>
      </article>
    );
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card${overdue ? ' task-card--overdue' : ''} ${isDragging ? 'task-card--dragging' : ''}`}
    >
      <div className="task-card__actions">
        {showEditBtn && (
          <IconButton variant="default" className="edit" onClick={() => setIsEditing(true)} aria-label="Редактировать">
            <EditIcon />
          </IconButton>
        )}
        <IconButton variant="default" className="trash" onClick={() => onDelete(task.id)} aria-label="Удалить">
          <TrashIcon />
        </IconButton>
      </div>

      <div className="task-card__info">
        <div className="task-card__row">
          <span className="task-card__label">Начало:</span>
          <span className="task-card__value">{formatDay(task.startDay)}</span>
        </div>
        <div className="task-card__row">
          <span className="task-card__label">Окончание:</span>
          <span className={`task-card__value${overdue ? ' task-card__value--overdue' : ''}`}>
            {formatDay(task.endDay)}
          </span>
        </div>
        <div className="task-card__row">
          <span className="task-card__label">Описание:</span>
          <span className="task-card__value">{task.text}</span>
        </div>
      </div>
    </article>
  );
};
export default TaskCard;
