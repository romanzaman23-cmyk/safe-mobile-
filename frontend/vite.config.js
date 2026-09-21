import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    host: true,
    allowedHosts: [
      'industry-few-gravity-devon.trycloudflare.com',
      '.trycloudflare.com',
      'localhost'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true
      },
      '/ws': {
        target: 'ws://localhost:5050',
        ws: true
      }
    }
  }
});
