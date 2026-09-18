/**
 * 鉴权 Mock。
 *
 * 说明：
 * 1. 账号库保存在 localStorage（key: yiyun:mock-accounts），因此「注册 → 退出 → 再登录」
 *    在刷新页面后依然成立，演示链路完整；
 * 2. 预置一个演示账号（见 config/constants.ts 的 DEMO_ACCOUNT），登录页可一键填入；
 * 3. 令牌为模拟字符串，仅用于前端状态与请求头演示，不具备真实校验能力。
 */
import { DEMO_ACCOUNT } from '@/config/constants'
import type { LoginPayload, LoginResult, RegisterPayload, UserInfo } from '@/types/user'
import { getStorage, setStorage } from '@/utils/storage'
import { mockDelay, randomBetween } from '@/mock/utils'

interface Account extends UserInfo {
  password: string
}

const ACCOUNTS_KEY = 'mock-accounts'

/** 预置账号库 */
function createInitialAccounts(): Account[] {
  return [
    {
      id: 'u_demo',
      username: DEMO_ACCOUNT.username,
      email: DEMO_ACCOUNT.email,
      password: DEMO_ACCOUNT.password,
      bio: DEMO_ACCOUNT.bio,
      createdAt: new Date('2026-01-08T09:30:00+08:00').toISOString(),
    },
  ]
}

function loadAccounts(): Account[] {
  const stored = getStorage<Account[] | null>(ACCOUNTS_KEY, null)
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    return createInitialAccounts()
  }
  // 保证演示账号始终存在（避免历史数据里缺账号导致无法登录体验）
  const hasDemo = stored.some((item) => item.username === DEMO_ACCOUNT.username)
  return hasDemo ? stored : [...createInitialAccounts(), ...stored]
}

let accounts: Account[] = loadAccounts()

function persist(): void {
  setStorage(ACCOUNTS_KEY, accounts)
}

/** 去掉密码后的用户信息（对外只返回 UserInfo） */
function toUserInfo(account: Account): UserInfo {
  return {
    id: account.id,
    username: account.username,
    email: account.email,
    bio: account.bio,
    createdAt: account.createdAt,
  }
}

function createToken(account: Account): string {
  return `mock-token-${account.id}-${Date.now().toString(36)}`
}

/** POST /auth/login */
export function mockLogin(payload: LoginPayload): Promise<LoginResult> {
  const username = payload.username.trim()

  const account = accounts.find((item) => item.username === username)
  if (!account) {
    return Promise.reject(new Error('该用户名尚未注册，请先注册账号'))
  }
  if (account.password !== payload.password) {
    return Promise.reject(new Error('密码不正确，请重新输入'))
  }

  return mockDelay<LoginResult>(
    {
      token: createToken(account),
      user: toUserInfo(account),
    },
    randomBetween(420, 820),
  )
}

/** POST /auth/register */
export function mockRegister(payload: RegisterPayload): Promise<LoginResult> {
  const username = payload.username.trim()
  const email = payload.email.trim()

  if (accounts.some((item) => item.username === username)) {
    return Promise.reject(new Error('该用户名已被注册，换一个试试'))
  }
  if (accounts.some((item) => item.email && item.email === email)) {
    return Promise.reject(new Error('该邮箱已被注册，可直接登录'))
  }

  const account: Account = {
    id: `u_${Date.now().toString(36)}`,
    username,
    email,
    password: payload.password,
    bio: '',
    createdAt: new Date().toISOString(),
  }

  accounts = [...accounts, account]
  persist()

  // 注册即登录，减少一次输入
  return mockDelay<LoginResult>(
    {
      token: createToken(account),
      user: toUserInfo(account),
    },
    randomBetween(520, 900),
  )
}
