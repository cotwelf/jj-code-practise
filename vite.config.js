import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, ''),
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        haru: resolve(__dirname, 'haru-catch/index.html')
      }
    }
  }
})
