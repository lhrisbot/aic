/**
 * localStorage 封装：统一前缀、JSON 安全读写、异常兜底。
 * 浏览器禁用存储或超出配额时不抛错，避免影响页面渲染。
 */
const PREFIX = 'yiyun:'

export const TOKEN_KEY = 'token'
export const USER_KEY = 'user'

function withPrefix(key: string): string {
  return `${PREFIX}${key}`
}

/** 读取并反序列化；不存在或解析失败时返回兜底值 */
export function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(withPrefix(key))
    if (raw === null) {
      return fallback
    }
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/** 序列化写入 */
export function setStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(withPrefix(key), JSON.stringify(value))
  } catch {
    /* 存储不可用时静默降级为内存态 */
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(withPrefix(key))
  } catch {
    /* 同上 */
  }
}

/**
 * 清除登录态（仅令牌与用户信息）。
 *
 * 注意：这里刻意不做「清空所有 yiyun: 前缀键」——
 * Mock 账号库（yiyun:mock-accounts）等演示数据也使用同一前缀，
 * 退出登录若全清会导致刚注册的账号消失、无法再次登录。
 */
export function clearAuthStorage(): void {
  removeStorage(TOKEN_KEY)
  removeStorage(USER_KEY)
}

/** 读取登录令牌（request.ts 与 user store 共用） */
export function getToken(): string {
  return getStorage<string>(TOKEN_KEY, '')
}

export function setToken(token: string): void {
  setStorage(TOKEN_KEY, token)
}

export function removeToken(): void {
  removeStorage(TOKEN_KEY)
}
