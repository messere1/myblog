import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/')) {
            if (['vue/', 'vue-router/', 'pinia/'].some(p => id.includes(p))) return 'vue-vendor'
            if (id.includes('md-editor-v3/') || id.includes('markdown-it/')) return 'md-vendor'
            if (id.includes('naive-ui/')) return 'ui-vendor'
          }
        }
      }
    }
  },
})
