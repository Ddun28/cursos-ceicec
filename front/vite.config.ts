import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Cambia esto al puerto donde corre tu servidor Flask
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Elimina el prefijo /api
      },
    },
  },
});

