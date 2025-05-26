import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// För att få __dirname i ES-moduler:
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Skapa __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  build: {
    outDir: '../backend/dist',
    emptyOutDir: true,
  }
})