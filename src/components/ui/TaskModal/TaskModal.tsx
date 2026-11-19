/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { formatDay, parseDate } from '../../../utils/dateUtils';
import IconButton from '../IconButton/IconButton';
import { CrossIcon } from '../icons';
import './TaskModal.scss';
import { Task } from '../../../interfaces/Task';
import { TaskStatus } from '../../../types';

interface TaskModalProps {
  status: TaskStatus;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
}

const TaskModal = ({ status, onClose, onSave }: TaskModalProps) => {
  // По умолчанию ставим сегодняшнюю дату
  const today = formatDay(Date.now());

  const [text, setText] = useState('');
  const [startDay, setStartDay] = useState(today);
  const [endDay, setEndDay] = useState(today);
  const [errors, setErrors] = useState({ start: false, end: false });

  const handleSave = () => {
    const startTimestamp = parseDate(startDay);
    const endTimestamp = parseDate(endDay);
    const trimmedText = text.trim();

    const newErrors = {
      start: startTimestamp === null,
      end: endTimestamp === null,
    };
    setErrors(newErrors);

    if (newErrors.start || newErrors.end || !trimmedText) return;

    onSave({
      type: status,
      text: trimmedText,
      startDay: startTimestamp!,
      endDay: endTimestamp!,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>
            Добавить новую задачу
          </h2>
          <IconButton variant="default" onClick={onClose} aria-label="Закрыть">
            <CrossIcon />
          </IconButton>
        </header>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="modal-start">Начало:</label>
            <input
              id="modal-start"
              type="text"
              value={startDay}
              onChange={(e) => setStartDay(e.target.value)}
              className={errors.start ? 'error' : ''}
              placeholder="дд.мм.гггг"
            />
          </div>
          <div className="form-group">
            <label htmlFor="modal-end">Окончание:</label>
            <input
              id="modal-end"
              type="text"
              value={endDay}
              onChange={(e) => setEndDay(e.target.value)}
              className={errors.end ? 'error' : ''}
              placeholder="дд.мм.гггг"
            />
          </div>
          <div className="form-group">
            <label htmlFor="modal-text">Описание:</label>
            <textarea
              id="modal-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Что нужно сделать?"
              rows={3}
            />
          </div>
        </div>

        <footer className="modal-footer">
          <button type="button" className="btn btn--cancel" onClick={onClose}>
            Отмена
          </button>
          <button type="button" className="btn btn--save" onClick={handleSave}>
            Сохранить
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TaskModal;
