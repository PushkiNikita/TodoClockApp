<style>
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
</style>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">
        Тест стилей Tailwind
      </h1>
      
      <TestStyles />
      
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">Текущее время</h2>
          <ClockDisplay />
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">Список дел</h2>
          <TodoList />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
