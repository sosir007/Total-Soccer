import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@total-soccer/shared': fileURLToPath(new URL('../../packages/shared/src', import.meta.url))
    }
  },
  server: {
    port: 9248
  }
});
