import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { login as loginApi, register as registerApi } from '@/api/auth'
import type { LoginPayload, LoginResult, RegisterPayload, UserInfo } from '@/types/user'
import { isNotifiedError } from '@/utils/request'
import {
  clearAuthStorage,
  getStorage,
  getToken,
  setStorage,
  setToken,
  USER_KEY,
} from '@/utils/storage'

/**
 * 用户状态：令牌 + 用户信息，持久化到 localStorage。
 *
 * 注意：request.ts 直接读取 localStorage 中的令牌（避免 store 与 request 互相依赖），
 * 因此本 store 写入令牌时同步落盘，保证刷新后请求仍携带 Authorization。
 */
export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getToken())
  const user = ref<UserInfo | null>(getStorage<UserInfo | null>(USER_KEY, null))
  /** 登录 / 注册请求进行中 */
  const loading = ref(false)

  const isLoggedIn = computed(() => Boolean(token.value))
  const displayName = computed(() => user.value?.username ?? '未登录用户')
  /** 无头像时用于文字头像 */
  const avatarText = computed(() => {
    const name = user.value?.username?.trim()
    return name ? name.slice(0, 1).toUpperCase() : '遗'
  })

  /** 写入登录结果（登录 / 注册成功后调用） */
  function setAuth(result: LoginResult): void {
    token.value = result.token
    user.value = result.user
    setToken(result.token)
    setStorage(USER_KEY, result.user)
  }

  /** 登录：成功返回 true，失败由本方法统一提示 */
  async function login(payload: LoginPayload): Promise<boolean> {
    if (loading.value) {
      return false
    }
    loading.value = true
    try {
      const result = await loginApi(payload)
      setAuth(result)
      ElMessage.success(`欢迎回来，${result.user.username}`)
      return true
    } catch (error) {
      if (!isNotifiedError(error)) {
        ElMessage.error(error instanceof Error ? error.message : '登录失败，请稍后重试')
      }
      return false
    } finally {
      loading.value = false
    }
  }

  /** 注册：成功后直接进入登录态 */
  async function register(payload: RegisterPayload): Promise<boolean> {
    if (loading.value) {
      return false
    }
    loading.value = true
    try {
      const result = await registerApi(payload)
      setAuth(result)
      ElMessage.success('注册成功，已为你自动登录')
      return true
    } catch (error) {
      if (!isNotifiedError(error)) {
        ElMessage.error(error instanceof Error ? error.message : '注册失败，请稍后重试')
      }
      return false
    } finally {
      loading.value = false
    }
  }

  /** 局部更新用户资料 */
  function updateUser(patch: Partial<UserInfo>): void {
    if (!user.value) {
      return
    }
    user.value = { ...user.value, ...patch }
    setStorage(USER_KEY, user.value)
  }

  /** 退出登录：清空登录态与令牌（不影响演示数据，如已注册的 Mock 账号） */
  function logout(): void {
    token.value = ''
    user.value = null
    clearAuthStorage()
  }

  return {
    token,
    user,
    loading,
    isLoggedIn,
    displayName,
    avatarText,
    setAuth,
    login,
    register,
    updateUser,
    logout,
  }
})
