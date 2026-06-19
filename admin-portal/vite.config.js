import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    // Uncomment and adjust once the backend is running, so calls to
    // /api/* are proxied to Spring Boot and you avoid CORS issues in dev:
    proxy: {
      '/api': 'http://localhost:8080',
     },
  },
})
