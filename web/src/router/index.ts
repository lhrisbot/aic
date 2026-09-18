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
        meta: { title: '首页', activeMenu: 'home' },
      },
      {
        path: 'heritage',
        name: 'HeritageList',
        component: () => import('@/views/Heritage/index.vue'),
        meta: { title: '非遗探索', activeMenu: 'heritage' },
      },
      {
        path: 'heritage/:id',
        name: 'HeritageDetail',
        component: () => import('@/views/Heritage/Detail.vue'),
        meta: { title: '非遗详情', activeMenu: 'heritage' },
      },
      {
        path: 'creation',
        name: 'Creation',
        component: () => import('@/views/Creation/index.vue'),
        meta: { title: 'AI 创作', activeMenu: 'creation', requiresAuth: true },
      },
      {
        path: 'video',
        name: 'Video',
        component: () => import('@/views/Video/index.vue'),
        meta: { title: '视频创作', activeMenu: 'video', requiresAuth: true },
      },
      {
        path: 'works',
        name: 'Works',
        component: () => import('@/views/Works/index.vue'),
        meta: { title: '我的作品', activeMenu: 'works', requiresAuth: true },
      },
      {
        path: 'works/:id',
        name: 'WorkDetail',
        component: () => import('@/views/Works/Detail.vue'),
        meta: { title: '作品详情', activeMenu: 'works', requiresAuth: true },
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
        meta: { title: '登录' },
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/Register/index.vue'),
        meta: { title: '注册' },
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
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

setupRouterGuards(router)

export default router
