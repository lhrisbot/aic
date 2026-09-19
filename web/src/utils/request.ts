/**
 * 统一请求封装（Axios）。
 *
 * 约定：
 * 1. `http.get/post/put/delete` 已解包 ApiResponse，直接返回业务数据，因此
 *    `src/api/*` 中的真实实现与 Mock 实现拥有完全一致的签名（Promise<T>），
 *    切换 VITE_USE_MOCK 无需改动任何页面代码；
 * 2. 请求拦截器注入 `Authorization: Bearer <token>`；
 * 3. 响应拦截器统一处理业务错误码与 401；
 * 4. 401 跳转使用 window.location，避免 request → router → store → api → request 的循环依赖。
 */
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiResponse } from '@/types/common'
import { getToken, removeToken, removeStorage, USER_KEY } from '@/utils/storage'

/** Mock 开关：只有显式设置为 'false' 时才走真实接口 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const DEFAULT_TIMEOUT = 15000

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

/** 请求拦截器：注入令牌 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

/** 判断响应体是否符合统一响应包结构 */
function isApiResponse(payload: unknown): payload is ApiResponse<unknown> {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'code' in payload &&
    'data' in payload
  )
}

/**
 * 标记「错误提示已经展示过」。
 * 拦截器负责弹出提示，业务层（store）在 catch 中不应重复提示，
 * 通过这个标记可以把「谁提示」收敛到一处。
 */
interface NotifiedError {
  __notified?: boolean
}

function markNotified(error: unknown): void {
  if (error && typeof error === 'object') {
    ;(error as NotifiedError).__notified = true
  }
}

/** 供 store 判断该错误是否已经弹过提示 */
export function isNotifiedError(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && (error as NotifiedError).__notified)
}

/** 401：清理本地登录态并回到登录页 */
function redirectToLogin(): void {
  removeToken()
  removeStorage(USER_KEY)
  const { pathname, search, hash } = window.location
  const current = `${pathname}${search}${hash}`
  const loginPath = `${import.meta.env.BASE_URL}login`
  if (pathname === loginPath) {
    return
  }
  const redirect = encodeURIComponent(current)
  window.location.replace(`${loginPath}?redirect=${redirect}`)
}

/** 把 Axios 错误转换为对用户友好的提示文案 */
function resolveErrorMessage(error: AxiosError<ApiResponse<unknown>>): string {
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return '请求超时，请稍后重试'
  }
  if (!error.response) {
    return '网络异常，请检查网络连接后重试'
  }

  const { status, data } = error.response
  if (data && typeof data === 'object' && 'message' in data && data.message) {
    return String(data.message)
  }

  if (status === 400) return '请求参数有误'
  if (status === 401) return '登录状态已失效，请重新登录'
  if (status === 403) return '没有权限执行该操作'
  if (status === 404) return '请求的资源不存在'
  if (status >= 500) return '服务暂时不可用，请稍后重试'
  return `请求失败（${status}）`
}

/** 响应拦截器：解包业务数据 + 统一错误提示 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const payload: unknown = response.data

    // 非统一响应包（如文件流）原样返回
    if (!isApiResponse(payload)) {
      return payload as unknown as AxiosResponse
    }

    if (payload.code === 0 || payload.code === 200) {
      return payload.data as unknown as AxiosResponse
    }

    const message = payload.message || '请求失败'
    ElMessage.error(message)
    const businessError = new Error(message)
    markNotified(businessError)
    return Promise.reject(businessError)
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const status = error.response?.status
    if (status === 401) {
      ElMessage.error('登录状态已失效，请重新登录')
      redirectToLogin()
      markNotified(error)
      return Promise.reject(error)
    }
    ElMessage.error(resolveErrorMessage(error))
    markNotified(error)
    return Promise.reject(error)
  },
)

/** 通用请求方法：返回值已解包为业务数据 */
export function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return service.request(config) as unknown as Promise<T>
}

export const http = {
  get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return request<T>({ url, method: 'GET', params, ...config })
  },
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return request<T>({ url, method: 'POST', data, ...config })
  },
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return request<T>({ url, method: 'PUT', data, ...config })
  },
  delete<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return request<T>({ url, method: 'DELETE', params, ...config })
  },
}

export default service
