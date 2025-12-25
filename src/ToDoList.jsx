import ToDoItem from './ToDoItem.jsx'

function ToDoList({ tasks, removeTask }) {
  return (
    <ul className="todo-list">
      {tasks.map(task => (
        <ToDoItem
          key={task.id}
          task={task}
          removeTask={removeTask}
        />
      ))}
    </ul>
  )
}

export default ToDoList




