/** 稳定的字符串哈希：用于把同一 id 映射到固定的配色 / 纹样，保证每次渲染一致 */
export function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}
