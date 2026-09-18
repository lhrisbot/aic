/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 应用标题 */
  readonly VITE_APP_TITLE: string
  /** 后端接口基础路径 */
  readonly VITE_API_BASE_URL: string
  /** Mock 开关：'false' 时走真实接口 */
  readonly VITE_USE_MOCK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
