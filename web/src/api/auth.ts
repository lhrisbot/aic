/**
 * 鉴权接口。
 * 页面与 store 只依赖本文件；Mock 与真实后端切换不影响调用方。
 */
import { USE_MOCK, http } from '@/utils/request'
import type { LoginPayload, LoginResult, RegisterPayload } from '@/types/user'
import { mockLogin, mockRegister } from '@/mock/auth'

/** POST /api/auth/login */
export function login(payload: LoginPayload): Promise<LoginResult> {
  if (USE_MOCK) {
    return mockLogin(payload)
  }
  return http.post<LoginResult>('/auth/login', payload)
}

/** POST /api/auth/register */
export function register(payload: RegisterPayload): Promise<LoginResult> {
  if (USE_MOCK) {
    return mockRegister(payload)
  }
  return http.post<LoginResult>('/auth/register', payload)
}
