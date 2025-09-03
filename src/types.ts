// 简化的登录相关类型定义
export interface LoginOptions {
  username?: string
  password?: string
}

export type LoginRequestParams = {
  baseURL: string
  email: string
  password: string
} | {
  baseURL: string
  phone: string
  password: string
}

export interface User {
  uuid: string
  email: string
  name: string
  phone: string
  token: string
}

export interface Team {
  uuid: string
  name: string
  status: number
  org_uuid: string
}

export interface Org {
  uuid: string
  name: string
  org_type: number
  owner: string
  style_hash: string
}

export interface LoginResponse {
  user: User
  teams: Team[]
  org: Org
}

export interface LocalConfig {
  platform: {
    baseURL: string
    username: string
    token: string
  }
  local: {
    user_uuid: string
    team_uuid?: string
    organization_uuid?: string
  }
}

export interface LoginPromptAnswer {
  baseURL: string
  username: string
  password: string
}

export interface AppOptions {
  appInstallationId?: string
  manifestUrl?: string
}

export interface AppManagementParams {
  baseURL: string
  orgUuid: string
  appInstallationId: string
  token: string
  action: 'install' | 'enable' | 'disable' | 'uninstall'
  manifestUrl?: string
}

export interface ErrorResponse {
  code?: string
  message?: string
  details?: {
    description?: string
    [key: string]: any
  }
}