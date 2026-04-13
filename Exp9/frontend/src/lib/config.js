const runtimeConfig = window.__APP_CONFIG__ ?? {};

export const appConfig = {
  apiBaseUrl: runtimeConfig.API_BASE_URL ?? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
  appEnv: runtimeConfig.APP_ENV ?? import.meta.env.MODE ?? 'development',
};

