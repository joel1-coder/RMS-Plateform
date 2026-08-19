import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Expose env variables to the app
  define: {
    // In production, VITE_API_URL must be set in Vercel to the Render backend URL
    // In dev, API calls are proxied via the above proxy config
  }
}))

