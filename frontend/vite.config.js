import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Esto hace que "@" apunte a la carpeta src
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // puerto de Laravel
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
