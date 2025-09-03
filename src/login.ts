import { login as apiLogin } from './utils/request.js'
import { displayLoginPrompts } from './utils/prompts.js'
import { updateLocalConfig, getConfigPath } from './utils/config.js'
import { convertUsernameField } from './utils/validation.js'
import type { LoginOptions, LocalConfig } from './types.js'

export async function login(baseURL: string | undefined, options: LoginOptions) {
  try {
    // 获取用户输入
    const answers = await displayLoginPrompts(baseURL, options)
    
    // 准备登录参数
    const loginParams = {
      baseURL: answers.baseURL,
      password: answers.password,
      ...convertUsernameField(answers.username)
    }
    
    console.log('🔐 Logging in...')
    
    // 执行登录
    const { data } = await apiLogin(loginParams)
    
    if (!data?.user?.token) {
      throw new Error('Login failed: Invalid response from server')
    }
    
    // 准备配置数据
    const config: LocalConfig = {
      platform: {
        baseURL: answers.baseURL,
        username: answers.username,
        token: data.user.token
      },
      local: {
        user_uuid: data.user.uuid,
        organization_uuid: data.org.uuid
      }
    }
    
    // 保存配置到本地
    updateLocalConfig(config)
    
    console.log('✅ Login successful!')
    console.log(`📁 Configuration saved to: ${getConfigPath()}`)
    console.log(`👤 Logged in as: ${data.user.name} (${data.user.email || data.user.phone})`)
    
    if (data.teams && data.teams.length > 0) {
      console.log(`🏢 Available teams: ${data.teams.length}`)
      data.teams.forEach((team, index) => {
        console.log(`   ${index + 1}. ${team.name} (${team.uuid})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Login failed:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}