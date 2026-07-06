import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules\/(three|@react-three)\//.test(id)) return 'three'
          return undefined
        },
      },
    },
  },
})
