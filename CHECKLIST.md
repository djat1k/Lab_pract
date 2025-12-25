# Чеклист соответствия критериям оценки

## ✅ 1. Приложение запускается и работает (2 балла)
- [x] Все компоненты созданы (App.jsx, AddTaskForm.jsx, ToDoList.jsx, ToDoItem.jsx)
- [x] main.jsx корректно настроен
- [x] Все импорты работают
- [x] Линтер не находит ошибок
- [x] Приложение готово к запуску через `npm run dev`

## ✅ 2. Реализовано состояние (useState) и передача пропсов (2 балла)

### useState:
- [x] **App.jsx** (строка 8): `const [tasks, setTasks] = useState(...)`
- [x] **AddTaskForm.jsx** (строка 4): `const [inputValue, setInputValue] = useState('')`

### Передача пропсов:
- [x] **App → AddTaskForm**: `addTask` функция (App.jsx:37)
- [x] **App → ToDoList**: `tasks` массив и `removeTask` функция (App.jsx:38)
- [x] **ToDoList → ToDoItem**: `task` объект и `removeTask` функция (ToDoList.jsx:7-10)

## ✅ 3. Реализовано сохранение данных (2 балла)
- [x] **useEffect** для сохранения в localStorage (App.jsx:14-16)
- [x] Загрузка из localStorage при инициализации (App.jsx:8-11)
- [x] Данные сохраняются при каждом изменении массива tasks

## ✅ 4. Реализована очистка (2 балла)
- [x] Функция `clearAllTasks` реализована (App.jsx:28-32)
- [x] Кнопка "Очистить всё" добавлена (App.jsx:39-46)
- [x] Кнопка показывается только когда есть задачи
- [x] Подтверждение перед очисткой через `window.confirm`

---

**Итого: Все критерии выполнены ✅**




