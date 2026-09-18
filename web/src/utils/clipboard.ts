/**
 * 复制到剪贴板。
 * 优先使用 Clipboard API（需要安全上下文），不可用时降级为临时 textarea + execCommand，
 * 保证在 http 内网部署或旧浏览器下「复制」按钮依然可用。
 */
export async function copyText(text: string): Promise<boolean> {
  if (!text) {
    return false
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* 继续走降级方案 */
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', 'readonly')
    textarea.style.position = 'fixed'
    textarea.style.top = '-1000px'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const succeed = document.execCommand('copy')
    document.body.removeChild(textarea)
    return succeed
  } catch {
    return false
  }
}
