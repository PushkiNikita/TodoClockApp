<!-- app/components/TodoList.vue -->
<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Список дел</h2>
    
    <!-- Форма добавления новой задачи -->
    <div class="mb-4">
      <input 
        v-model="newTodo" 
        @keyup.enter="addTodo"
        placeholder="Добавьте новую задачу"
        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    
    <!-- Список задач -->
    <ul class="space-y-2">
      <li 
        v-for="todo in todoStore.todos" 
        :key="todo.id"
        class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md shadow-sm"
      >
        <div class="flex items-center">
          <input 
            type="checkbox" 
            :checked="todo.completed" 
            @change="todoStore.toggleTodo(todo.id)"
            class="mr-3 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span 
            :class="{ 
              'line-through text-gray-500': todo.completed,
              'text-gray-800': !todo.completed
            }"
          >
            {{ todo.text }}
          </span>
        </div>
        <button 
          @click="todoStore.removeTodo(todo.id)"
          class="text-red-500 hover:text-red-700 p-1 rounded"
        >
          ✕
        </button>
      </li>
    </ul>
    
    <!-- Статистика -->
    <div class="mt-4 text-sm text-gray-600">
      <p>Всего задач: {{ todoStore.todos.length }}</p>
      <p>Выполнено: {{ todoStore.completedTodos.length }}</p>
      <p>Активных: {{ todoStore.activeTodos.length }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTodoStore } from '~/stores/todo'

const todoStore = useTodoStore()
const newTodo = ref('')

const addTodo = () => {
  if (newTodo.value.trim()) {
    todoStore.addTodo(newTodo.value.trim())
    newTodo.value = ''
  }
}
</script>