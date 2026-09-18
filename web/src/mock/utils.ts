/**
 * Mock 层公共工具：模拟网络延迟、深拷贝、随机取值。
 * 说明：Mock 返回的数据一律深拷贝，避免页面改动污染内存中的「数据库」。
 */

/**
 * 结构化深拷贝。
 * 注意：structuredClone 无法克隆 Vue 的响应式代理（会抛 DataCloneError），
 * 而 store 中的数据传给 Mock 时往往是代理对象，因此失败后退回 JSON 往返。
 */
export function clone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      /* 响应式代理等不可结构化克隆的值，走 JSON 兜底 */
    }
  }
  return JSON.parse(JSON.stringify(value)) as T
}

/** 闭区间随机整数 */
export function randomBetween(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min))
}

/** 模拟接口延迟后返回数据（默认 280~620ms，AI 类接口可显式传入更长的延迟） */
export function mockDelay<T>(data: T, ms?: number): Promise<T> {
  const delay = ms ?? randomBetween(280, 620)
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(clone(data)), delay)
  })
}
