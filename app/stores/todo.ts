// app/stores/todo.ts
import { defineStore } from 'pinia'

export interface TodoItem {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<TodoItem[]>([])
  const nextId = ref(1)

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
    todos,
    addTodo,
    removeTodo,
    toggleTodo,
    completedTodos,
    activeTodos
  }
})