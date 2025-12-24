import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function AddTaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      date: date || new Date().toISOString().split('T')[0],
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    onAddTask(newTask);
    setTitle('');
    setDescription('');
    setDate('');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название задачи"
        required
        className="task-input"
      />
      
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Описание задачи"
        className="task-textarea"
      />
      
      <div className="form-row">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date-input"
        />
        
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="priority-select"
        >
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
      </div>
      
      <button type="submit" className="add-button">
        Добавить задачу
      </button>
    </form>
  );
}

