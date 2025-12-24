import React from 'react';

export function Statistics({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <div className="statistics">
      <div className="stat-item">
        <span className="stat-label">Всего задач:</span>
        <span className="stat-value">{totalTasks}</span>
      </div>
      
      <div className="stat-item">
        <span className="stat-label">Выполнено:</span>
        <span className="stat-value completed">{completedTasks}</span>
      </div>
      
      <div className="stat-item">
        <span className="stat-label">Осталось:</span>
        <span className="stat-value pending">{pendingTasks}</span>
      </div>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <span className="progress-text">{completionPercentage}%</span>
      </div>
    </div>
  );
}

