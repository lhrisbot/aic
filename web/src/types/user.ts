/** 用户与鉴权 */

export interface UserInfo {
  id: string
  username: string
  email?: string
  /** 头像地址；为空时以用户名首字生成文字头像 */
  avatar?: string
  /** 一句话简介（个人中心展示） */
  bio?: string
  createdAt?: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginResult {
  token: string
  user: UserInfo
}
