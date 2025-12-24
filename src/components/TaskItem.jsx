import React from 'react';
import { formatDateTime } from '../utils/dateUtils';

export function TaskItem({ 
  task, 
  onToggleComplete, 
  onDelete, 
  onEdit,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging 
}) {
  const priorityColors = {
    high: '#ff4444',
    medium: '#ffbb33',
    low: '#00C851'
  };

  return (
    <div
      className={`task-item ${task.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="task-header">
        <div className="task-main">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="task-checkbox"
          />
          
          <div className="task-info">
            <h3 className="task-title">{task.title}</h3>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            <span className="task-date">{formatDateTime(new Date(task.date))}</span>
          </div>
        </div>
        
        <div className="task-actions">
          <span 
            className="priority-badge"
            style={{ backgroundColor: priorityColors[task.priority] }}
          >
            {task.priority === 'high' ? 'Высокий' : 
             task.priority === 'medium' ? 'Средний' : 'Низкий'}
          </span>
          
          <button 
            onClick={() => onEdit(task)}
            className="edit-button"
          >
            ✏️
          </button>
          
          <button 
            onClick={() => onDelete(task.id)}
            className="delete-button"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

