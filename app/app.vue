<!-- app.vue -->
<template>
  <div class="container mx-auto p-8">
    <h1 class="text-4xl font-bold mb-8">Мои часы и задачи</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Место для часов -->
      <div class="border rounded-lg p-6">
        <ClockDisplay />
      </div>
      <!-- Место для списка задач -->
      <div class="border rounded-lg p-6">
        <TodoList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Базовые компоненты будут добавлены на следующем шаге
</script>