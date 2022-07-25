import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as process from 'node:process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'import.meta.env.GITHUB_TOKEN': JSON.stringify(env.GITHUB_TOKEN),
      'import.meta.env.GITHUB_ORGA': JSON.stringify(env.GITHUB_ORGA),
    },
  };
});
