import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  build: {
    rolldownOptions: {
      input: {
        villains: resolve(import.meta.dirname, 'src/villains/index.html'),
        'villains-map': resolve(import.meta.dirname, 'src/villains-map/index.html'),
      },
    },
  },
  base: 'http://localhost:3000/',
});
