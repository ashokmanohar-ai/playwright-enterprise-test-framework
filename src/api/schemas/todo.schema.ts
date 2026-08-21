import { z } from 'zod';

export const todoSchema = z.object({
  userId: z.number().int().positive(),
  id: z.number().int().positive(),
  title: z.string().min(1),
  completed: z.boolean(),
});

export const todosSchema = z.array(todoSchema);
