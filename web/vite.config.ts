import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    // Vite 8 默认使用 Sass 现代 API，此处仅保留后续可能需要的扩展位
    preprocessorOptions: {
      scss: {},
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    open: false,
    // 忽略工具产生的临时目录与验证产物，避免监听器在文件被占用时触发 EBUSY 崩溃
    watch: {
      ignored: [
        '**/.verify/**',
        '**/.verify',
        '**/*.tmpdir/**',
        '**/.*.tmpdir/**',
        '**/*.tmp',
      ],
    },
    // 预留 FastAPI 后端代理：VITE_USE_MOCK=false 时 /api 转发到本地后端
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Element Plus 全量引入会让单个 chunk 偏大，这里放宽告警阈值
    chunkSizeWarningLimit: 1600,
  },
})
