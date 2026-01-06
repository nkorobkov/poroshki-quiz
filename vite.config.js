import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  base : '/poroshki-quiz/',
  plugins: [preact()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
});

