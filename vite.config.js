import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Slightly more generous than Vite's default 500 kB so we don't get a
    // noisy warning on the single-file App.jsx (it's ~330 kB of data).
    chunkSizeWarningLimit: 800,
  },
})
