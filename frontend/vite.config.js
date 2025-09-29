import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    cors: true,
    headers: {
      'Content-Security-Policy': "frame-ancestors 'self' http://127.0.0.1:8000",
      'X-Frame-Options': 'SAMEORIGIN',
    },
  },
})
