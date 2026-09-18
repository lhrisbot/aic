/**
 * GitHub Pages 专用构建脚本。
 *
 * 相比普通 `vite build`，它额外处理三件 GitHub Pages 上必踩的事：
 * 1. 资源前缀：项目站点的地址是 https://<用户名>.github.io/<仓库名>/，
 *    资源必须带 <仓库名>/ 前缀，否则 JS/CSS 全部 404、页面白屏；
 * 2. SPA 回退：路由用的是 history 模式，GitHub Pages 没有重写规则，
 *    直接访问 /heritage 这类深链会 404；把 index.html 复制成 404.html 即可兜住；
 * 3. .nojekyll：Vite 产物里有 assets/_plugin-vue_export-helper-*.js，
 *    Jekyll 会忽略下划线开头的文件，导致该文件 404 —— 放一个 .nojekyll 让 Pages 跳过 Jekyll。
 *
 * 用法（仓库名请换成你自己的）：
 *   node scripts/build-pages.mjs /my-repo-name/
 *   或  PAGES_BASE=/my-repo-name/ npm run build:pages
 * 不传参数时按根路径 '/' 构建（用于自定义域名或 <用户名>.github.io 仓库）。
 */
import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const rawBase = process.argv[2] ?? process.env.PAGES_BASE ?? '/'

/** 规范化成以 / 开头、以 / 结尾的形式 */
function normalizeBase(value) {
  const trimmed = value.trim()
  if (!trimmed || trimmed === '/') return '/'
  return `/${trimmed.replace(/^\/+/, '').replace(/\/+$/, '')}/`
}

const base = normalizeBase(rawBase)
const distDir = join(process.cwd(), 'dist')

console.log(`\n[build-pages] 资源前缀 base = ${base}`)

execSync('npx vite build', {
  stdio: 'inherit',
  env: { ...process.env, VITE_BASE: base },
})

if (!existsSync(join(distDir, 'index.html'))) {
  console.error('[build-pages] 构建产物缺失：dist/index.html 不存在')
  process.exit(1)
}

// 2) SPA 回退
copyFileSync(join(distDir, 'index.html'), join(distDir, '404.html'))
console.log('[build-pages] 已生成 dist/404.html（history 路由深链回退）')

// 3) 跳过 Jekyll
writeFileSync(join(distDir, '.nojekyll'), '')
console.log('[build-pages] 已生成 dist/.nojekyll')

const html = statSync(join(distDir, 'index.html')).size
console.log(`[build-pages] 完成：dist/index.html ${html} 字节，可直接发布\n`)
console.log('下一步：把 dist/ 的内容发布到 GitHub Pages（详见 docs/05-deploy-github-pages.md）')
