import pino from 'pino';

import { getEnvironmentConfig } from '../../config/environment-loader.js';

const env = getEnvironmentConfig();

export const logger = pino({
  level: env.logLevel,
  base: { environment: env.name },
  redact: {
    paths: [
      'password',
      '*.password',
      'token',
      '*.token',
      'authorization',
      '*.authorization',
      'cookie',
      '*.cookie',
    ],
    censor: '[REDACTED]',
  },
});
