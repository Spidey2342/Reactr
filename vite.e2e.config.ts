import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// Hermetic config used only by the e2e tests: same app, none of the Figma Make plugins.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  // Pre-bundle up front so Vite does not discover dependencies mid-test and reload the page.
  optimizeDeps: { include: ['react', 'react-dom', 'react-dom/client', 'react-router', 'react/jsx-dev-runtime'] },
  server: { host: '127.0.0.1', port: 4173, strictPort: true },
})
