import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { vReveal } from '@/directives/reveal'
import '@/styles/index.scss'

/**
 * 应用入口。
 * 注意引入顺序：先 Element Plus 基础样式，再引入项目样式，保证设计令牌与覆盖生效。
 */
const app = createApp(App)

app.directive('reveal', vReveal)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale: zhCn })

app.mount('#app')
