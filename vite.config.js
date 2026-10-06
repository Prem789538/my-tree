import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Reached over the tailnet through `tailscale serve` on
// https://lianyu.tail8b4fb0.ts.net:8447. No backend of its own.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 4513,
    strictPort: true,
    allowedHosts: ['mytree.tail8b4fb0.ts.net', 'lianyu.tail8b4fb0.ts.net'],
  },
})
