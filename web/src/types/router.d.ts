import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题（写入 document.title） */
    title?: string
    /** 顶部导航高亮键，保证详情页也高亮所属主菜单 */
    activeMenu?: string
    /** 是否需要登录 */
    requiresAuth?: boolean
  }
}
