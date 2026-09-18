import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  /**
   * 资源前缀。
   * 本地开发与常规部署都用 '/'；部署到 GitHub Pages 项目站点时，
   * 地址是 https://<用户名>.github.io/<仓库名>/，需要带上仓库名前缀。
   * 用 `npm run build:pages` 时会自动通过 VITE_BASE 传入，无需手改本文件。
   */
  base: process.env.VITE_BASE || '/',
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
    // 忽略工具产生的临时目录、验证产物与静态图片目录，
    // 避免监听器在文件正被写入时触发 EBUSY 崩溃（public/ 仍会被正常访问）
    watch: {
      ignored: [
        '**/.verify/**',
        '**/.verify',
        '**/public/covers/**',
        '**/*.tmpdir/**',
        '**/.*.tmpdir/**',
        '**/*.tmp',
        '**/*.jpg',
        '**/*.jpeg',
        '**/*.png',
        '**/*.webp',
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
