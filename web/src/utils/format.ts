/** 展示层格式化工具（不引入 dayjs 等额外依赖） */

function pad2(value: number): string {
  return value < 10 ? `0${value}` : String(value)
}

function toDate(value: string | number | Date): Date | null {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** 2026-03-08 或 2026-03-08 14:30 */
export function formatDate(value?: string | number | Date, withTime = true): string {
  if (value === undefined || value === null || value === '') {
    return '-'
  }
  const date = toDate(value)
  if (!date) {
    return '-'
  }
  const day = `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
  if (!withTime) {
    return day
  }
  return `${day} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

/** 相对时间：刚刚 / 12 分钟前 / 3 小时前 / 2 天前，超过 7 天回落为日期 */
export function formatRelativeTime(value?: string | number | Date): string {
  if (value === undefined || value === null || value === '') {
    return '-'
  }
  const date = toDate(value)
  if (!date) {
    return '-'
  }

  const diff = Date.now() - date.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return '刚刚'
  }
  if (diff < hour) {
    return `${Math.floor(diff / minute)} 分钟前`
  }
  if (diff < day) {
    return `${Math.floor(diff / hour)} 小时前`
  }
  if (diff < 7 * day) {
    return `${Math.floor(diff / day)} 天前`
  }
  return formatDate(date, false)
}

/** 秒 → mm:ss（视频时长、分镜时间轴） */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '00:00'
  }
  const total = Math.round(seconds)
  const minutes = Math.floor(total / 60)
  const rest = total % 60
  return `${pad2(minutes)}:${pad2(rest)}`
}

/** 分镜时间区间：0-5 秒 */
export function formatTimeRange(start: number, end: number): string {
  return `${start}-${end} 秒`
}

/** 0.95 → 95% */
export function formatPercent(ratio: number, digits = 0): string {
  if (!Number.isFinite(ratio)) {
    return '0%'
  }
  const value = ratio <= 1 ? ratio * 100 : ratio
  return `${value.toFixed(digits)}%`
}

/** 超出长度截断并追加省略号 */
export function truncate(text: string, max: number): string {
  if (!text) {
    return ''
  }
  return text.length > max ? `${text.slice(0, max)}…` : text
}

/** 从 Markdown 正文提取纯文本摘要（列表卡片用） */
export function markdownToSummary(markdown: string, max = 90): string {
  if (!markdown) {
    return ''
  }
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*`_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return truncate(plain, max)
}
