import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import * as process from 'node:process';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'import.meta.env.GITHUB_TOKEN': JSON.stringify(env.GITHUB_TOKEN),
      'import.meta.env.GITHUB_ORGA': JSON.stringify(env.GITHUB_ORGA),
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
