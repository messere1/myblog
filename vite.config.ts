import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') }
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
    // 生成 sourcemap 用于线上排查，但不会影响生产性能
    sourcemap: false,
    // 使用 Vite 8 默认压缩（oxc），不额外依赖 esbuild
    minify: true,
    // chunk 大小告警阈值
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // 使用更稳定的 hash 长度
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('/node_modules/')) {
            // 框架核心： vue / vue-router / pinia / @vueuse
            if (
              ['vue/', 'vue-router/', 'pinia/', '@vueuse/'].some(p => id.includes(p))
            ) return 'vue-vendor'
            // md-editor-v3 已通过 defineAsyncComponent 动态导入，
            // 不再手动分块 —— manualChunks 会把 md-editor 的共享依赖
            // （如 @vueuse/core re-export）强行塞入 md-editor chunk，
            // 导致入口 chunk 不得不 import 它，产生 786KB 的 modulepreload。
            // 让 Rolldown 自动 code-split 即可。
            // markdown-it 前台文章渲染用，体积小，单独成块
            if (id.includes('markdown-it/') || id.includes('entities/') || id.includes('linkify-it/') || id.includes('mdurl/')) return 'markdown-it'
            // Shiki：不再手动分块。和 md-editor 同理，manualChunks 会把
            // shiki 包中被入口链共享的内部模块（如 @shikijs/core 的 re-export）
            // 强制塞入 shiki-vendor chunk，导致入口不得不 import 9.5MB 的 chunk。
            // 让 Rolldown 自动 code-split，shiki 核心会自然归入 PostDetail 懒加载 chunk。
            // Supabase 客户端
            if (id.includes('@supabase/')) return 'supabase-vendor'
            // Naive UI（仅后台用到）
            if (id.includes('naive-ui/') || id.includes('@css-render/') || id.includes('css-render/') || id.includes('evtd/')) return 'ui-vendor'
            // dayjs 体积小，单独成块以便长期缓存
            if (id.includes('dayjs/')) return 'dayjs-vendor'
          }
        }
      }
    }
  },
})
