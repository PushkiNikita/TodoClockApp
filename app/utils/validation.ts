// app/utils/validation.ts
import { z } from 'zod';

// Схема для валидации новой задачи
export const todoSchema = z.object({
  text: z
    .string()
    .min(1, 'Задача не может быть пустой')
    .max(500, 'Задача слишком длинная (максимум 500 символов)')
    .refine(text => text.trim().length > 0, 'Задача не может состоять только из пробелов'),
});

// Схема для валидации существующей задачи
export const todoItemSchema = z.object({
  id: z.number().positive('ID должен быть положительным числом'),
  text: z.string().min(1, 'Текст задачи обязателен'),
  completed: z.boolean(),
  createdAt: z.date(),
});

// Типы TypeScript на основе схем Zod
export type TodoInput = z.infer<typeof todoSchema>;
export type TodoItem = z.infer<typeof todoItemSchema>;

// Функция для валидации задачи
export const validateTodo = (input: unknown) => {
  return todoSchema.safeParse(input);
};

// Функция для валидации массива задач
export const validateTodos = (todos: unknown) => {
  return z.array(todoItemSchema).safeParse(todos);
};

// Функция для получения первой ошибки валидации
export const getFirstValidationError = (error: z.ZodError) => {
  return error.issues[0]?.message || 'Произошла ошибка валидации';
};
