// app/stores/todo.ts
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export interface TodoItem {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

export const useTodoStore = defineStore('todo', () => {
  // Используем localStorage для сохранения задач
  const todos = useLocalStorage<TodoItem[]>('todos', [])
  const nextId = useLocalStorage<number>('next-todo-id', 1)

  const addTodo = (text: string) => {
    const newTodo: TodoItem = {
      id: nextId.value++,
      text,
      completed: false,
      createdAt: new Date()
    }
    todos.value.push(newTodo)
  }

  const removeTodo = (id: number) => {
    const index = todos.value.findIndex(todo => todo.id === id)
    if (index !== -1) {
      todos.value.splice(index, 1)
    }
  }

  const toggleTodo = (id: number) => {
    const todo = todos.value.find(todo => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  const completedTodos = computed(() => 
    todos.value.filter(todo => todo.completed)
  )

  const activeTodos = computed(() => 
    todos.value.filter(todo => !todo.completed)
  )

  return {
    todos: readonly(todos), // делаем доступным только для чтения
    addTodo,
    removeTodo,
    toggleTodo,
    completedTodos,
    activeTodos
  }
})