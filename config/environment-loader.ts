import path from 'node:path';

import dotenv from 'dotenv';
import { ZodError } from 'zod';

import { devDefaults } from './environments/dev.js';
import { qaDefaults } from './environments/qa.js';
import { uatDefaults } from './environments/uat.js';
import {
  environmentNameSchema,
  environmentSchema,
  type EnvironmentConfig,
  type EnvironmentName,
} from './schema.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });

function resolveEnvironmentName(): EnvironmentName {
  const rawValue = process.env.TEST_ENV ?? 'qa';
  const result = environmentNameSchema.safeParse(rawValue);
  if (!result.success) {
    throw new Error(
      `Environment validation failed:\n- TEST_ENV: expected dev, qa, or uat; received "${rawValue}".`,
      { cause: result.error },
    );
  }
  return result.data;
}

const selectedEnvironment = resolveEnvironmentName();
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${selectedEnvironment}`),
  quiet: true,
});

const defaults: Record<EnvironmentName, { baseUrl: string; apiBaseUrl: string; workers: number }> =
  {
    dev: devDefaults,
    qa: qaDefaults,
    uat: uatDefaults,
  };

let cachedConfig: EnvironmentConfig | undefined;

export function getEnvironmentConfig(): EnvironmentConfig {
  if (cachedConfig) return cachedConfig;

  const fallback = defaults[selectedEnvironment];

  try {
    cachedConfig = environmentSchema.parse({
      name: selectedEnvironment,
      baseUrl: process.env.BASE_URL ?? fallback.baseUrl,
      apiBaseUrl: process.env.API_BASE_URL ?? fallback.apiBaseUrl,
      username: process.env.TEST_USERNAME || undefined,
      password: process.env.TEST_PASSWORD || undefined,
      headless: (process.env.HEADLESS ?? 'true').toLowerCase(),
      workers: process.env.WORKERS ?? fallback.workers,
      logLevel: (process.env.LOG_LEVEL ?? 'info').toLowerCase(),
      isCI: Boolean(process.env.CI),
    });
    return cachedConfig;
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.issues
        .map((issue) => `- ${issue.path.join('.')}: ${issue.message}`)
        .join('\n');
      throw new Error(`Environment validation failed:\n${details}`, { cause: error });
    }
    throw error;
  }
}

export function requireAuthCredentials(): { username: string; password: string } {
  const config = getEnvironmentConfig();
  if (!config.username || !config.password) {
    throw new Error(
      'Authentication configuration is incomplete. Set TEST_USERNAME and TEST_PASSWORD in your local .env file or CI secret store.',
    );
  }
  return { username: config.username, password: config.password };
}

export function getApiBaseUrl(): string {
  return process.env.USE_LOCAL_API === 'true'
    ? 'http://127.0.0.1:4010'
    : getEnvironmentConfig().apiBaseUrl;
}
