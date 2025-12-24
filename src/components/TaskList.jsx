import React, { useState } from 'react';
import { TaskItem } from './TaskItem';
import { sortTasks } from '../utils/dateUtils';

export function TaskList({ 
  tasks, 
  onToggleComplete, 
  onDelete, 
  onEdit,
  onReorder 
}) {
  const [draggedId, setDraggedId] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      onReorder(draggedId, targetId);
    }
    setDraggedId(null);
  };

  const sortedTasks = sortTasks(tasks);

  return (
    <div className="task-list">
      {sortedTasks.length === 0 ? (
        <p className="empty-message">Нет задач</p>
      ) : (
        sortedTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onEdit={onEdit}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, task.id)}
            isDragging={draggedId === task.id}
          />
        ))
      )}
    </div>
  );
}

