import type { Router } from 'vue-router'
import { ElMessage } from 'element-plus'
import { APP_NAME, APP_SUBTITLE } from '@/config/constants'
import { useUserStore } from '@/stores/user'

/**
 * 全局路由守卫。
 * - requiresAuth：/creation、/video、/works 及其详情页需要登录；
 * - 登录态访问登录 / 注册页时自动回跳；
 * - afterEach 统一维护 document.title。
 */
export function setupRouterGuards(router: Router): void {
  router.beforeEach((to) => {
    // 在守卫内部获取 store，确保 Pinia 已完成安装
    const userStore = useUserStore()

    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
      ElMessage.warning('该功能需要登录后使用')
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      }
    }

    if ((to.name === 'Login' || to.name === 'Register') && userStore.isLoggedIn) {
      const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/'
      return { path: redirect }
    }

    return true
  })

  router.afterEach((to) => {
    document.title = to.meta.title
      ? `${to.meta.title} · ${APP_NAME}`
      : `${APP_NAME} · ${APP_SUBTITLE}`
  })
}
