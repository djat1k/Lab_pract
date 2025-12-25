import { useState, useEffect } from 'react'
import AddTaskForm from './AddTaskForm.jsx'
import ToDoList from './ToDoList.jsx'
import './App.css'

function App() {
  // Загружаем задачи из localStorage при инициализации
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('todoTasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  // Сохраняем задачи в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks))
  }, [tasks])

  // Анимация фона по движению курсора
  useEffect(() => {
    const handleMouseMove = (e) => { 
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      document.documentElement.style.setProperty('--mouse-x', `${x}%`)
      document.documentElement.style.setProperty('--mouse-y', `${y}%`)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const addTask = (text) => {
    if (text.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text }])
    }
  }

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const clearAllTasks = () => {
    if (window.confirm('Вы уверены, что хотите удалить все задачи?')) {
      setTasks([])
    }
  }

  return (
    <div className="app">
      <h1>ToDo Приложение</h1>
      <AddTaskForm addTask={addTask} />
      <ToDoList tasks={tasks} removeTask={removeTask} />
      {tasks.length > 0 && (
        <button 
          className="clear-all-button" 
          onClick={clearAllTasks}
        >
          Очистить всё
        </button>
      )}
    </div>
  )
}

export default App
