<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>

<template>
  <div class="container mx-auto p-8 bg-gray-50 min-h-screen">
    <h1 class="text-4xl font-bold mb-8 text-blue-600 text-center">
      Мои часы и задачи
    </h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="border-2 border-blue-200 rounded-lg p-6 bg-white shadow-lg">
        <ClockDisplay />
      </div>
      <div class="border-2 border-green-200 rounded-lg p-6 bg-white shadow-lg">
        <TodoList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>