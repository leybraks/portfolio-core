import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // Esto es vital para que Vite funcione dentro de Docker
    allowedHosts: ['silvadata.me'] // La llave mágica para tu dominio
  }
})