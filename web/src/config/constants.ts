import { markRaw, type Component } from 'vue'
import { Document, Film, Mic, Present } from '@element-plus/icons-vue'
import type { SceneType } from '@/types/ai'
import type { FeedbackType } from '@/types/feedback'
import type { HeritageCategory, HeritageRegion, SourceType } from '@/types/heritage'
import type { VideoTaskStatus } from '@/types/video'
import type { WorkSort, WorkType } from '@/types/work'

/** 应用信息 */
export const APP_NAME = '遗韵智创'
export const APP_SUBTITLE = 'AI 非遗多模态内容创作平台'
export const APP_SLOGAN = '让千年非遗，被今天的人看见'

/** 顶部导航 */
export interface NavItem {
  key: string
  label: string
  path: string
  requiresAuth?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: '首页', path: '/' },
  { key: 'heritage', label: '非遗探索', path: '/heritage' },
  { key: 'creation', label: 'AI 创作', path: '/creation', requiresAuth: true },
  { key: 'video', label: '视频创作', path: '/video', requiresAuth: true },
  { key: 'works', label: '我的作品', path: '/works', requiresAuth: true },
]

/** 创作场景元信息（首页场景能力卡与创作页场景选择共用） */
export interface SceneMeta {
  type: SceneType
  label: string
  /** 首页 / 选择器用的一句话描述 */
  desc: string
  icon: Component
}

// markRaw：图标是组件对象，避免被意外转为响应式
export const SCENE_META: SceneMeta[] = [
  {
    type: 'article',
    label: '文旅推文',
    desc: '公众号、小红书、微博的场景化宣传文案，一次生成多平台可用稿。',
    icon: markRaw(Document),
  },
  {
    type: 'video',
    label: '短视频脚本',
    desc: '从选题到分镜的短视频脚本，直接衔接视频生成。',
    icon: markRaw(Film),
  },
  {
    type: 'live',
    label: '直播话术',
    desc: '非遗介绍、文创带货、景区宣传的直播话术与节奏设计。',
    icon: markRaw(Mic),
  },
  {
    type: 'package',
    label: '文创包装',
    desc: '产品包装文案与文化释义，让非遗元素落到商品上。',
    icon: markRaw(Present),
  },
]

export const SCENE_LABELS: Record<SceneType, string> = {
  article: '文旅推文',
  video: '短视频',
  live: '直播话术',
  package: '文创包装',
}

/** 「我的作品」里的作品类型：四种内容场景 + 视频作品 */
export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  ...SCENE_LABELS,
  videoWork: '视频作品',
}

/** 非遗分类与地区筛选项（首项为「全部」） */
export const HERITAGE_CATEGORIES: HeritageCategory[] = [
  '传统戏剧',
  '传统美术',
  '传统技艺',
  '传统音乐',
  '传统舞蹈',
  '民俗',
]

export const HERITAGE_REGIONS: HeritageRegion[] = [
  '北京',
  '江苏',
  '浙江',
  '四川',
  '陕西',
  '广东',
  '其他',
]

/** 参考资料类型徽标 */
export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  book: '志书',
  journal: '学术期刊',
  museum: '博物馆',
  official: '官方网站',
  news: '媒体报道',
}

/** 作品时间排序 */
export const WORK_SORT_OPTIONS: Array<{ label: string; value: WorkSort }> = [
  { label: '最新创建', value: 'latest' },
  { label: '最早创建', value: 'oldest' },
]

/** 视频任务状态的展示文案与标签类型 */
export const VIDEO_STATUS_META: Record<
  VideoTaskStatus,
  { label: string; description: string; tagType: 'info' | 'warning' | 'success' | 'danger' }
> = {
  pending: { label: '等待生成', description: '任务已提交，正在排队等待算力资源。', tagType: 'info' },
  generating: { label: '生成中', description: '正在按分镜逐镜生成画面并合成音画。', tagType: 'warning' },
  success: { label: '生成成功', description: '视频已生成完成，可预览、保存或下载。', tagType: 'success' },
  failed: { label: '生成失败', description: '生成过程出现异常，可重试或调整分镜后再次生成。', tagType: 'danger' },
}

/**
 * 演示账号（Mock 阶段的唯一预置账号）。
 * 同时被 mock/auth.ts（账号库初始化）与登录页（一键填入）引用，保证只有一处定义。
 */
export const DEMO_ACCOUNT = {
  username: '非遗创作者',
  password: 'yiyun2026',
  email: 'creator@example.com',
  bio: '文旅宣传工作者，关注非遗的当代表达',
} as const

/** 用户名 / 密码的校验长度（前后端共享同一套约定） */
export const USERNAME_MIN = 2
export const USERNAME_MAX = 20
export const PASSWORD_MIN = 6

/** 非遗探索列表分页大小（3 列 × 3 行） */
export const HERITAGE_PAGE_SIZE = 9

/** 搜索框的快捷示例词 */
export const SEARCH_SUGGESTIONS: string[] = ['皮影戏', '昆曲', '苏绣']

/** 意见反馈类型选项 */
export const FEEDBACK_TYPE_OPTIONS: Array<{ label: string; value: FeedbackType }> = [
  { label: '功能建议', value: 'suggestion' },
  { label: '问题反馈', value: 'bug' },
  { label: '资料纠错', value: 'content' },
  { label: '其他', value: 'other' },
]

/** 生成过程的思考态文案（Loading 时轮换展示，强化「可信知识库」感知） */
export const GENERATING_TIPS: string[] = [
  '正在检索非遗知识库…',
  '正在核对史实与技艺细节…',
  '正在按场景组织内容结构…',
  '正在生成最终文案…',
]
