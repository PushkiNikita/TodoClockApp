<!-- app/components/TestStyles.vue -->
<template>
  <div class="p-6 space-y-4">
    <!-- Проверка цветов -->
    <div class="space-y-2">
      <div class="text-sm font-medium text-gray-700">Проверка цветов:</div>
      <div class="flex gap-2">
        <div class="w-8 h-8 bg-red-500 rounded"></div>
        <div class="w-8 h-8 bg-green-500 rounded"></div>
        <div class="w-8 h-8 bg-blue-500 rounded"></div>
        <div class="w-8 h-8 bg-gray-500 rounded"></div>
      </div>
    </div>
    
    <!-- Проверка типографики -->
    <div class="space-y-2">
      <div class="text-sm font-medium text-gray-700">Проверка текста:</div>
      <div class="space-y-1">
        <div class="text-xs text-gray-600">Текст xs</div>
        <div class="text-sm text-gray-600">Текст sm</div>
        <div class="text-base text-gray-600">Текст base</div>
        <div class="text-lg text-gray-600">Текст lg</div>
        <div class="text-xl text-gray-600">Текст xl</div>
        <div class="text-2xl font-bold text-gray-900">Текст 2xl bold</div>
      </div>
    </div>
    
    <!-- Проверка сетки -->
    <div class="space-y-2">
      <div class="text-sm font-medium text-gray-700">Проверка сетки:</div>
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-blue-100 p-4 rounded text-center">1</div>
        <div class="bg-blue-100 p-4 rounded text-center">2</div>
        <div class="bg-blue-100 p-4 rounded text-center">3</div>
      </div>
    </div>
    
    <!-- Проверка отступов -->
    <div class="space-y-2">
      <div class="text-sm font-medium text-gray-700">Проверка отступов:</div>
      <div class="space-y-4">
        <div class="p-1 bg-yellow-100">p-1</div>
        <div class="p-2 bg-yellow-100">p-2</div>
        <div class="p-4 bg-yellow-100">p-4</div>
        <div class="p-8 bg-yellow-100">p-8</div>
      </div>
    </div>
  </div>
</template>