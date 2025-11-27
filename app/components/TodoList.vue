<template>
  <div class="space-y-6">
    <!-- Форма добавления новой задачи -->
    <UForm @submit="addTodo" class="space-y-4" :state="formState">
      <UFormGroup 
        label="Новая задача" 
        :error="validationError"
        :help="newTodo.length > 0 ? `${newTodo.length}/500 символов` : ''"
      >
    <UInput
      v-model="newTodo"
      placeholder="Введите новую задачу..."
      size="lg"
      class="rounded-lg"
      ref="inputRef"
      @blur="clearValidationError"
      :maxlength="500"
    />
      </UFormGroup>
      
      <UButton
        type="submit"
        :disabled="!newTodo.trim()"
        class="w-full"
        size="lg"
        variant="solid"
        :loading="addingTodo"
      >
        <UIcon name="i-heroicons-plus" class="w-5 h-5" />
        Добавить задачу
      </UButton>
    </UForm>

    <!-- Уведомление об ошибке -->
    <UAlert
      v-if="errorMessage"
      :title="errorMessage"
      variant="outline"
      icon="i-heroicons-exclamation-triangle"
      @close="clearError"
      class="mt-4"
    />

    <!-- Фильтры -->
    <div class="flex gap-2 flex-wrap">
      <UButton
        v-for="filter in filters"
        :key="filter.key"
        @click="currentFilter = filter.key"
        :variant="currentFilter === filter.key ? 'solid' : 'outline'"
        :color="currentFilter === filter.key ? 'primary' : 'neutral'"
        size="sm"
      >
        {{ filter.label }}
        <UBadge 
          v-if="filter.key === 'active' && todoStore.activeTodos.length > 0"
          :label="todoStore.activeTodos.length.toString()"
          color="primary"
          variant="solid"
          class="ml-1"
        />
        <UBadge 
          v-if="filter.key === 'completed' && todoStore.completedTodos.length > 0"
          :label="todoStore.completedTodos.length.toString()"
          color="primary"
          variant="solid"
          class="ml-1"
        />
      </UButton>
    </div>

    <!-- Список задач -->
    <div class="space-y-3">
      <TransitionGroup name="list" tag="div">
        <UCard
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="transition-all duration-300 hover:shadow-md group"
          :class="todo.completed ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'"
        >
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <UCheckbox
                :model-value="todo.completed"
                @update:model-value="todoStore.toggleTodo(todo.id)"
              />
              
              <!-- Редактируемое поле -->
              <div class="flex-1 min-w-0" v-if="editingTodoId === todo.id">
                <UInput
                  v-model="editingText"
                  @blur="saveEdit(todo.id)"
                  @keyup.enter="saveEdit(todo.id)"
                  @keyup.escape="cancelEdit"
                  size="sm"
                  autofocus
                  :maxlength="500"
                />
                <p class="text-xs text-gray-500 mt-1">
                  {{ editingText.length }}/500 символов
                </p>
              </div>
              
              <!-- Отображение задачи -->
              <div 
                v-else
                class="flex-1 min-w-0 cursor-pointer"
                @dblclick="startEdit(todo)"
              >
                <span
                  :class="[
                    'wrap-break-word transition-all duration-200',
                    todo.completed 
                      ? 'line-through text-gray-500 dark:text-gray-400' 
                      : 'text-gray-900 dark:text-white font-medium'
                  ]"
                >
                  {{ todo.text }}
                </span>
                
                <!-- Бейдж если задача длинная -->
                <UBadge 
                  v-if="todo.text.length > 100"
                  label="Длинная"
                  color="warning"
                  variant="subtle"
                  size="xs"
                  class="ml-2"
                />
              </div>
            </div>
            
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <UButton
                v-if="editingTodoId !== todo.id"
                @click="startEdit(todo)"
                color="neutral"
                variant="ghost"
                icon="i-heroicons-pencil"
                :padded="false"
                size="xs"
              />
              
              <UButton
                @click="confirmDelete(todo)"
                color="neutral"
                variant="ghost"
                icon="i-heroicons-trash"
                :padded="false"
                size="xs"
              />
            </div>
          </div>
          
          <!-- Мета-информация -->
          <div class="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-4 pb-4">
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-calendar" class="w-3 h-3" />
                <span>{{ formatDate(todo.createdAt) }}</span>
              </div>
              
              <UBadge 
                v-if="todo.completed"
                label="Выполнено"
                color="success"
                variant="subtle"
                size="xs"
              />
            </div>
            
            <div class="text-xs opacity-70">
              {{ todo.text.length }}/500
            </div>
          </div>
        </UCard>
      </TransitionGroup>

      <!-- Сообщение о пустом списке -->
      <UCard
        v-if="filteredTodos.length === 0"
        class="text-center py-8"
      >
        <UIcon 
          :name="emptyMessageIcon" 
          class="w-12 h-12 text-gray-400 mx-auto mb-4" 
        />
        <p class="text-gray-500 dark:text-gray-400 mb-2">{{ emptyMessage }}</p>
        <p class="text-sm text-gray-400">{{ emptyMessageSubtitle }}</p>
      </UCard>
    </div>

    <!-- Статистика и действия -->
    <UCard v-if="todoStore.todos.length > 0">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Статистика</h3>
          <UBadge 
            :label="`${progress}%`"
            :color="progressBadgeColor"
            variant="subtle"
          />
        </div>
      </template>
      
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {{ todoStore.todos.length }}
          </p>
          <p class="text-sm text-gray-500">Всего</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ todoStore.activeTodos.length }}
          </p>
          <p class="text-sm text-gray-500">Активных</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ todoStore.completedTodos.length }}
          </p>
          <p class="text-sm text-gray-500">Выполнено</p>
        </div>
      </div>

      <!-- Прогресс-бар -->
      <div class="mt-4 space-y-2">
        <div class="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Прогресс выполнения</span>
          <span>{{ progress }}%</span>
        </div>
        <UProgress 
          :value="progress" 
          size="md"
          :color="progressColor"
        />
      </div>

      <template #footer>
        <div class="flex gap-2">
          <UButton
            v-if="todoStore.completedTodos.length > 0"
            @click="clearCompleted"
            variant="outline"
            class="flex-1"
            icon="i-heroicons-trash"
          >
            Очистить выполненные ({{ todoStore.completedTodos.length }})
          </UButton>
          
          <UButton
            @click="exportTodos"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-down-tray"
          >
            Экспорт
          </UButton>
        </div>
      </template>
    </UCard>

    <!-- Модальное окно подтверждения удаления -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-500" />
            <h3 class="text-lg font-semibold">Подтверждение удаления</h3>
          </div>
        </template>

        <p>Вы уверены, что хотите удалить задачу "{{ todoToDelete?.text }}"?</p>

        <template #footer>
          <div class="flex gap-2 justify-end">
            <UButton
              color="neutral"
              variant="ghost"
              @click="showDeleteModal = false"
            >
              Отмена
            </UButton>
            <UButton
              variant="solid"
              @click="deleteTodo"
            >
              Удалить
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useTodoStore } from '~/stores/todo'
import { useLocalStorage } from '@vueuse/core'
import type { TodoItem } from '~/utils/validation'

const todoStore = useTodoStore()
const newTodo = ref('')
const inputRef = ref<HTMLInputElement>()
const addingTodo = ref(false)
const validationError = ref('')
const errorMessage = ref('')
const editingTodoId = ref<number | null>(null)
const editingText = ref('')
const showDeleteModal = ref(false)
const todoToDelete = ref<TodoItem | null>(null)

type FilterType = 'all' | 'active' | 'completed'
const currentFilter = useLocalStorage<FilterType>('todo-filter', 'all')

const filters = [
  { key: 'all' as FilterType, label: 'Все' },
  { key: 'active' as FilterType, label: 'Активные' },
  { key: 'completed' as FilterType, label: 'Выполненные' }
]

const formState = computed(() => ({
  text: newTodo.value
}))

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

const emptyMessageSubtitle = computed(() => {
  switch (currentFilter.value) {
    case 'active':
      return 'Все задачи выполнены! 🎉'
    case 'completed':
      return 'Начните выполнять задачи'
    default:
      return 'Добавьте первую задачу выше'
  }
})

const emptyMessageIcon = computed(() => {
  switch (currentFilter.value) {
    case 'active':
      return 'i-heroicons-check-badge'
    case 'completed':
      return 'i-heroicons-clock'
    default:
      return 'i-heroicons-clipboard-document'
  }
})

const progress = computed(() => {
  if (todoStore.todos.length === 0) return 0
  return Math.round((todoStore.completedTodos.length / todoStore.todos.length) * 100)
})

const progressColor = computed(() => {
  if (progress.value === 0) return 'neutral'
  if (progress.value < 50) return 'warning'
  if (progress.value < 100) return 'primary'
  return 'success'
})

const progressBadgeColor = computed(() => {
  if (progress.value === 0) return 'neutral'
  if (progress.value < 50) return 'warning'
  if (progress.value < 100) return 'primary'
  return 'success'
})

// Создаем простую замену для тостов
const showNotification = (title: string, type: 'success' | 'error' | 'info' = 'success') => {
  console.log(`[${type.toUpperCase()}] ${title}`)
}

const addTodo = async () => {
  if (!newTodo.value.trim()) return
  
  addingTodo.value = true
  validationError.value = ''
  errorMessage.value = ''
  
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    await todoStore.addTodo(newTodo.value)
    newTodo.value = ''
    showNotification('Задача добавлена', 'success')
  } catch (error) {
    const errorMessageText = (error as Error).message
    validationError.value = errorMessageText
    errorMessage.value = 'Ошибка при добавлении задачи'
    showNotification(errorMessageText, 'error')
  } finally {
    addingTodo.value = false
  }
  
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

const clearCompleted = () => {
  const completedCount = todoStore.completedTodos.length
  todoStore.completedTodos.forEach(todo => {
    todoStore.removeTodo(todo.id)
  })
  
  showNotification(`Удалено ${completedCount} выполненных задач`, 'success')
}

const clearValidationError = () => {
  validationError.value = ''
}

const clearError = () => {
  errorMessage.value = ''
  validationError.value = ''
}

const startEdit = (todo: TodoItem) => {
  editingTodoId.value = todo.id
  editingText.value = todo.text
}

const saveEdit = async (id: number) => {
  if (editingText.value.trim() && editingText.value !== todoStore.todos.find(t => t.id === id)?.text) {
    try {
      await todoStore.updateTodoText(id, editingText.value)
      showNotification('Задача обновлена', 'success')
    } catch (error) {
      errorMessage.value = (error as Error).message
      showNotification((error as Error).message, 'error')
      return
    }
  }
  cancelEdit()
}

const cancelEdit = () => {
  editingTodoId.value = null
  editingText.value = ''
}

const confirmDelete = (todo: TodoItem) => {
  todoToDelete.value = todo
  showDeleteModal.value = true
}

const deleteTodo = () => {
  if (todoToDelete.value) {
    todoStore.removeTodo(todoToDelete.value.id)
    showNotification('Задача удалена', 'success')
  }
  showDeleteModal.value = false
  todoToDelete.value = null
}

const exportTodos = () => {
  const data = {
    todos: todoStore.todos,
    exportedAt: new Date().toISOString(),
    total: todoStore.todos.length,
    completed: todoStore.completedTodos.length,
    active: todoStore.activeTodos.length
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `todos-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  showNotification('Задачи экспортированы', 'info')
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Автоочистка ошибок через 5 секунд
watch(errorMessage, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  }
})
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>