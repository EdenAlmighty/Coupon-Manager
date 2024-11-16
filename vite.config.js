import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  outDir: 'dist',
  emptyOutDir: true,
  base: '/Coupon-Manager/', 
  plugins: [react()],
})
