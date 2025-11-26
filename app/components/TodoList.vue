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
        ref="inputRef"
      />
      <button 
        @click="addTodo"
        :disabled="!newTodo.trim()"
        class="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Добавить задачу
      </button>
    </div>
    
    <!-- Фильтры -->
    <div class="flex space-x-2 mb-4">
      <button 
        v-for="filter in filters"
        :key="filter.key"
        @click="currentFilter = filter.key"
        :class="[
          'px-3 py-1 rounded-md text-sm',
          currentFilter === filter.key 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ filter.label }}
      </button>
    </div>
    
    <!-- Список задач -->
    <ul class="space-y-2" v-if="filteredTodos.length">
      <li 
        v-for="todo in filteredTodos" 
        :key="todo.id"
        class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <div class="flex items-center flex-1">
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
            class="break-words flex-1"
          >
            {{ todo.text }}
          </span>
        </div>
        <button 
          @click="todoStore.removeTodo(todo.id)"
          class="text-red-500 hover:text-red-700 p-1 rounded ml-2 flex-shrink-0"
        >
          ✕
        </button>
      </li>
    </ul>
    
    <!-- Сообщение о пустом списке -->
    <div v-else class="text-center py-8 text-gray-500">
      {{ emptyMessage }}
    </div>
    
    <!-- Статистика -->
    <div class="mt-4 p-3 bg-gray-100 rounded-md text-sm text-gray-600">
      <p>Всего задач: {{ todoStore.todos.length }}</p>
      <p>Выполнено: {{ todoStore.completedTodos.length }}</p>
      <p>Активных: {{ todoStore.activeTodos.length }}</p>
    </div>
    
    <!-- Кнопка очистки выполненных -->
    <button 
      v-if="todoStore.completedTodos.length > 0"
      @click="clearCompleted"
      class="mt-3 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
    >
      Очистить выполненные ({{ todoStore.completedTodos.length }})
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTodoStore } from '~/stores/todo'
import { useLocalStorage } from '@vueuse/core'

const todoStore = useTodoStore()
const newTodo = ref('')
const inputRef = ref<HTMLInputElement>()

type FilterType = 'all' | 'active' | 'completed'
const currentFilter = useLocalStorage<FilterType>('todo-filter', 'all')

const filters = [
  { key: 'all' as FilterType, label: 'Все' },
  { key: 'active' as FilterType, label: 'Активные' },
  { key: 'completed' as FilterType, label: 'Выполненные' }
]

const filteredTodos = computed(() => {
  switch (currentFilter.value) {
    case 'active':
      return todoStore.activeTodos
    case 'completed':
      return todoStore.completedTodos
    default:
      return todoStore.todos
  }
})

const emptyMessage = computed(() => {
  switch (currentFilter.value) {
    case 'active':
      return 'Нет активных задач'
    case 'completed':
      return 'Нет выполненных задач'
    default:
      return 'Список задач пуст'
  }
})

const addTodo = () => {
  if (newTodo.value.trim()) {
    todoStore.addTodo(newTodo.value.trim())
    newTodo.value = ''
    // Фокусируемся обратно на input после добавления
    if (inputRef.value) {
      inputRef.value.focus()
    }
  }
}

const clearCompleted = () => {
  todoStore.completedTodos.forEach(todo => {
    todoStore.removeTodo(todo.id)
  })
}
</script>