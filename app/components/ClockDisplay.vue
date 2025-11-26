<!-- app/components/ClockDisplay.vue -->
<template>
  <div class="text-center">
    <h2 class="text-2xl font-bold mb-4">Текущее время</h2>
    <div class="text-5xl font-mono bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
      {{ currentTime }}
    </div>
    <div class="mt-4 text-lg text-gray-600">
      {{ currentDate }}
    </div>
    <div class="mt-2 text-sm text-gray-500">
      Обновлено: {{ lastUpdate }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNow, useTimestamp } from '@vueuse/core'

// Используем useNow для реактивного текущего времени
const now = useNow()

// Используем useTimestamp для отслеживания времени обновления
const timestamp = useTimestamp()

const currentTime = computed(() => {
  return now.value.toLocaleTimeString('ru-RU')
})

const currentDate = computed(() => {
  return now.value.toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const lastUpdate = computed(() => {
  return new Date(timestamp.value).toLocaleTimeString('ru-RU')
})
</script>