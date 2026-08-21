export {};

try {
  const { getEnvironmentConfig } = await import('../config/environment-loader.js');
  const env = getEnvironmentConfig();

  console.log('ENVIRONMENT VALIDATION');
  console.log(`Environment:       ${env.name.toUpperCase()}`);
  console.log(`Base URL:          ${env.baseUrl}`);
  console.log(`API Base URL:      ${env.apiBaseUrl}`);
  console.log(`Headless:          ${String(env.headless)}`);
  console.log(`Workers:           ${env.workers}`);
  console.log(`Credentials set:   ${String(Boolean(env.username && env.password))}`);
  console.log('Status:            PASS');
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Environment validation failed.');
  process.exitCode = 1;
}
