import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Enable React support in Vite.
  plugins: [react()],
  server: {
    // Proxy API calls to the ASP.NET backend during local development.
    proxy: {
      '/api': {
        target: 'http://localhost:5071',
        changeOrigin: true,
      }
    }
  }
})
