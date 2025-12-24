import { format, isToday, isTomorrow, isAfter, isBefore, parseISO } from 'date-fns';

export const formatDate = (date) => format(date, 'dd.MM.yyyy');
export const formatDateTime = (date) => format(date, 'dd.MM.yyyy HH:mm');

export const getDateFilters = {
  today: (task) => isToday(parseISO(task.date)),
  tomorrow: (task) => isTomorrow(parseISO(task.date)),
  all: () => true,
};

export const sortTasks = (tasks) => {
  return [...tasks].sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    
    if (isBefore(dateA, dateB)) return -1;
    if (isAfter(dateA, dateB)) return 1;
    
    if (a.priority !== b.priority) {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    return 0;
  });
};

