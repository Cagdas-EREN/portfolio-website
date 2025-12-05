import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define: {
    // Production'da environment variable'lar için fallback
    'import.meta.env.VITE_API_URL': mode === 'production' ? '"/api"' : undefined,
    'import.meta.env.VITE_BASE_URL': mode === 'production' ? '""' : undefined,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
}))
