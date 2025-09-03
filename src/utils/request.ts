import axios from 'axios'
import type { LoginRequestParams, LoginResponse, ErrorResponse } from '../types.js'

// HTTP请求工具
export async function login(params: LoginRequestParams) {
  const { baseURL, ...loginData } = params
  
  // 检查是否是ONES开发API域名
  const isONESDevAPI = baseURL.includes('devapi.myones.net')
  let apiPath = '/auth/v2/login'
  
  // 如果不是开发API，添加项目API前缀
  if (!isONESDevAPI) {
    apiPath = '/project/api/project/auth/v2/login'
  }
  
  const fullURL = `${baseURL}${apiPath}`
  
  try {
    const response = await axios.post<LoginResponse>(
      fullURL,
      loginData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    )
    
    return { data: response.data }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ErrorResponse
      
      let errorMsg = error.message
      if (errorData) {
        const code = errorData.code || 'Error'
        const message = errorData.message || ''
        
        errorMsg = `${code}: ${message}`
        
        // 添加详细错误信息
        if (errorData.details?.description) {
          // 处理换行符，让错误信息更易读
          const formattedDescription = errorData.details.description
            .replace(/\\n/g, '\n  ')
            .replace(/- at/g, '\n  - at')
          errorMsg += `\n\n详细信息:\n  ${formattedDescription}`
        }
      }
      
      throw new Error(`Login failed: ${errorMsg}`)
    }
    throw error
  }
}