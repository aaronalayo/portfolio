import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"


// https://vite.dev/config/
export default defineConfig(
  {
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // ✅ required for Docker
    port: 3000,
    allowedHosts: ['portfolio-f412.onrender.com', 'localhost'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
})
