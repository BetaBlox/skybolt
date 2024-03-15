import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default ({ mode }) => {
  // Will load any .env vars prefix with VITE_
  // see - https://vitejs.dev/guide/env-and-mode
  const viteEnvVars = loadEnv(mode, resolve(__dirname, '../../'), 'VITE_');

  // https://vitejs.dev/config/
  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8001', // local Nest app
          changeOrigin: true,
        },
      },
      host: 'localhost',
      port: 8000,
      strictPort: true,
      open: true,
    },
    define: {
      'process.env': viteEnvVars,
    },
    resolve: {
      alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
    },
  });
};
