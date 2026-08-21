import { z } from 'zod';

const booleanString = z.enum(['true', 'false']).transform((value) => value === 'true');

export const environmentNameSchema = z.enum(['dev', 'qa', 'uat']);

export const environmentSchema = z.object({
  name: environmentNameSchema,
  baseUrl: z.url(),
  apiBaseUrl: z.url(),
  username: z.string().min(1).optional(),
  password: z.string().min(1).optional(),
  headless: booleanString,
  workers: z.coerce.number().int().min(1).max(16),
  logLevel: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
  isCI: z.boolean(),
});

export type EnvironmentName = z.infer<typeof environmentNameSchema>;
export type EnvironmentConfig = z.infer<typeof environmentSchema>;
