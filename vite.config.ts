import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // ✅ required for Docker
    port: 3000,
    allowedHosts: ['portfolio-f412.onrender.com', 'localhost'],
  },
})
