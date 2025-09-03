// 验证工具函数
export function isEmail(input: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(input)
}

export function isPhone(input: string): boolean {
  // 简单的手机号验证（支持中国手机号）
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(input.replace(/[\s-]/g, ''))
}

export function isURL(input: string): boolean {
  try {
    new URL(input)
    return true
  } catch {
    return false
  }
}

export function isPassword(input: string): boolean {
  // 密码必须是8-32位，不包含空格
  return input.length >= 8 && input.length <= 32 && !input.includes(' ')
}

export function convertUsernameField(username: string) {
  return isEmail(username) ? { email: username } : { phone: username }
}