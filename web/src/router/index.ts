import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { setupRouterGuards } from './guards'

/**
 * 路由表。
 * - 常规页面挂在 MainLayout（顶部导航 + 页脚）下；
 * - 登录 / 注册使用独立的 AuthLayout（左侧文化 Banner + 右侧表单卡）；
 * - 所有业务页面懒加载，首屏只加载布局与首页。
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home/index.vue'),
        meta: { title: '首页', activeMenu: 'home', layout: 'public', transition: 'page' },
      },
      {
        path: 'heritage',
        name: 'HeritageList',
        component: () => import('@/views/Heritage/index.vue'),
        meta: { title: '非遗探索', activeMenu: 'heritage', layout: 'discovery', transition: 'discovery' },
      },
      {
        path: 'heritage/:id',
        name: 'HeritageDetail',
        component: () => import('@/views/Heritage/Detail.vue'),
        meta: { title: '非遗详情', activeMenu: 'heritage', layout: 'editorial', transition: 'editorial' },
      },
      {
        path: 'creation',
        name: 'Creation',
        component: () => import('@/views/Creation/index.vue'),
        meta: { title: 'AI 创作', activeMenu: 'creation', requiresAuth: true, layout: 'studio', transition: 'studio' },
      },
      {
        path: 'video',
        name: 'Video',
        component: () => import('@/views/Video/index.vue'),
        meta: { title: '视频创作', activeMenu: 'video', requiresAuth: true, layout: 'production', transition: 'production' },
      },
      {
        path: 'works',
        name: 'Works',
        component: () => import('@/views/Works/index.vue'),
        meta: { title: '我的作品', activeMenu: 'works', requiresAuth: true, layout: 'library', transition: 'library' },
      },
      {
        path: 'works/:id',
        name: 'WorkDetail',
        component: () => import('@/views/Works/Detail.vue'),
        meta: { title: '作品详情', activeMenu: 'works', requiresAuth: true, layout: 'editorial', transition: 'editorial' },
      },
    ],
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Login/index.vue'),
        meta: { title: '登录', layout: 'auth' },
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/Register/index.vue'),
        meta: { title: '注册', layout: 'auth' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound/index.vue'),
    meta: { title: '页面不存在' },
  },
]

const router = createRouter({
  /**
   * history base 必须与 Vite 的 base 保持一致。
   * 本地开发与常规部署时 BASE_URL 为 '/'；
   * 部署到 GitHub Pages 项目站点（https://<用户名>.github.io/<仓库名>/）时，
   * BASE_URL 会变成 '/<仓库名>/'，路由会自动剥掉这段前缀——
   * 否则浏览器地址是 /<仓库名>/heritage，路由匹配不到任何规则，整站都会落到 404 页。
   */
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // 同一页面内的筛选、分页不强制打断用户当前阅读位置；跨页面时平滑回到顶部。
    if (_to.path === _from.path) {
      return false
    }
    return { top: 0, behavior: 'smooth' }
  },
})

setupRouterGuards(router)

export default router
