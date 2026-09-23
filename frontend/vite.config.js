import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Dev proxy: any request the browser makes to /api/... is forwarded to
    // the Express backend on port 5000. This lets our frontend call
    // `api.get('/health')` without hardcoding http://localhost:5000.
    // (We still enable cors() on the backend as a second safety net.)
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})