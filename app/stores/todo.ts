// app/stores/todo.ts
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { validateTodo, validateTodos, type TodoInput, type TodoItem } from '~/utils/validation';

export const useTodoStore = defineStore('todo', () => {
  // Используем Zod для валидации при загрузке из localStorage
  const storageTodos = useLocalStorage('todos', []);
  const initialTodos = validateTodos(storageTodos.value);
  const todos = ref<TodoItem[]>(initialTodos.success ? initialTodos.data : []);

  const nextId = useLocalStorage<number>('next-todo-id', 1);

  const addTodo = (text: string) => {
    // Валидируем входные данные
    const validation = validateTodo({ text });

    if (!validation.success) {
      const errorMessage = getFirstValidationError(validation.error);
      throw new Error(errorMessage);
    }

    const newTodo: TodoItem = {
      id: nextId.value++,
      text: validation.data.text.trim(),
      completed: false,
      createdAt: new Date(),
    };

    todos.value.push(newTodo);
  };

  const removeTodo = (id: number) => {
    const index = todos.value.findIndex(todo => todo.id === id);
    if (index !== -1) {
      todos.value.splice(index, 1);
    }
  };

  const toggleTodo = (id: number) => {
    const todo = todos.value.find(todo => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  };

  const updateTodoText = (id: number, newText: string) => {
    const validation = validateTodo({ text: newText });

    if (!validation.success) {
      const errorMessage = getFirstValidationError(validation.error);
      throw new Error(errorMessage);
    }

    const todo = todos.value.find(todo => todo.id === id);
    if (todo) {
      todo.text = validation.data.text.trim();
    }
  };

  const completedTodos = computed(() => todos.value.filter(todo => todo.completed));

  const activeTodos = computed(() => todos.value.filter(todo => !todo.completed));

  // Валидация всех задач при загрузке
  onMounted(() => {
    const validation = validateTodos(todos.value);
    if (!validation.success) {
      console.warn('Invalid todos data detected, resetting...');
      todos.value = [];
    }
  });

  return {
    todos: readonly(todos),
    addTodo,
    removeTodo,
    toggleTodo,
    updateTodoText,
    completedTodos,
    activeTodos,
  };
});
