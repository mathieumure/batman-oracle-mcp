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
        criminals: resolve(import.meta.dirname, 'src/criminals/index.html'),
        'crime-map': resolve(import.meta.dirname, 'src/crime-map/index.html'),
      },
    },
  },
  base: process.env.MCP_ORIGIN,
});
