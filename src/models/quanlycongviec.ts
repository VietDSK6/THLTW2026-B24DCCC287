import { useState, useEffect } from 'react';

export interface Task {
  id: string;
  name: string;
  description?: string;
  deadline?: string;
  priority: 'Cao' | 'Trung bình' | 'Thấp';
  tags?: string[];
  status: 'Cần làm' | 'Đang làm' | 'Hoàn thành';
}

export default function useQuanLyCongViec() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [visibleForm, setVisibleForm] = useState(false);
  const [edit, setEdit] = useState(false);
  const [record, setRecord] = useState<Task | undefined>(undefined);

  useEffect(() => {
    const savedTasks = localStorage.getItem('quanLyCongViec_tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {}
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('quanLyCongViec_tasks', JSON.stringify(newTasks));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: Date.now().toString() };
    saveTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    const newTasks = tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t));
    saveTasks(newTasks);
  };

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter((t) => t.id !== id);
    saveTasks(newTasks);
  };

  return {
    tasks,
    setTasks: saveTasks,
    addTask,
    updateTask,
    deleteTask,
    visibleForm,
    setVisibleForm,
    edit,
    setEdit,
    record,
    setRecord,
  };
}
