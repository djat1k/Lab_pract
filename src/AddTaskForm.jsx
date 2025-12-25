import { useState } from 'react'

function AddTaskForm({ addTask }) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    addTask(inputValue)
    setInputValue('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Введите задачу..."
      />
      <button type="submit">Добавить</button>
    </form>
  )
}

export default AddTaskForm




