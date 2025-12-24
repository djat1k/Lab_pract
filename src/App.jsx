import React, { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getDateFilters } from './utils/dateUtils';
import { TaskList } from './components/TaskList';
import { AddTaskForm } from './components/AddTaskForm';
import { Filters } from './components/Filters';
import { Statistics } from './components/Statistics';
import { Modal } from './components/Modal';
import './App.css';

function App() {
  const [tasks, setTasks] = useLocalStorage('todo-pro-tasks', []);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = getDateFilters[activeFilter](task);
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const addTask = useCallback((newTask) => {
    setTasks(prev => [newTask, ...prev]);
  }, [setTasks]);

  const toggleTaskComplete = useCallback((id) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }, [setTasks]);

  const deleteTask = useCallback((id) => {
    if (window.confirm('Удалить задачу?')) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  }, [setTasks]);

  const updateTask = useCallback((updatedTask) => {
    setTasks(prev => prev.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
    setEditingTask(null);
    setIsModalOpen(false);
  }, [setTasks]);

  const reorderTasks = useCallback((draggedId, targetId) => {
    setTasks(prev => {
      const newTasks = [...prev];
      const draggedIndex = newTasks.findIndex(t => t.id === draggedId);
      const targetIndex = newTasks.findIndex(t => t.id === targetId);
      
      const [draggedTask] = newTasks.splice(draggedIndex, 1);
      newTasks.splice(targetIndex, 0, draggedTask);
      
      return newTasks;
    });
  }, [setTasks]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Todo Pro</h1>
        <p>Ваш личный планировщик задач</p>
      </header>

      <main className="app-main">
        <div className="left-panel">
          <AddTaskForm onAddTask={addTask} />
          <Statistics tasks={tasks} />
        </div>

        <div className="right-panel">
          <Filters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={toggleTaskComplete}
            onDelete={deleteTask}
            onEdit={handleEdit}
            onReorder={reorderTasks}
          />
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Редактировать задачу"
      >
        {editingTask && (
          <div className="edit-form">
            <input
              type="text"
              defaultValue={editingTask.title}
              onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
              className="edit-input"
            />
            <textarea
              defaultValue={editingTask.description}
              onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
              className="edit-textarea"
            />
            <div className="edit-actions">
              <button onClick={() => updateTask(editingTask)} className="save-button">
                Сохранить
              </button>
              <button onClick={() => setIsModalOpen(false)} className="cancel-button">
                Отмена
              </button>
            </div>
          </div>
        )}
      </Modal>

      <footer className="app-footer">
        <p>Всего задач: {tasks.length} | Выполнено: {tasks.filter(t => t.completed).length}</p>
      </footer>
    </div>
  );
}

export default App;
