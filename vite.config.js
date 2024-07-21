import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'extension',
    // minify: false,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name].js',
      },
    },
  },
  plugins: [react()],
})
