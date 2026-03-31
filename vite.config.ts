import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev: default base `/` (npm run dev). Deploy: `npm run build` / `npm run preview` pass --base=/minerva-book/
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
})
