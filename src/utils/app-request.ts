import axios from 'axios'
import type { AppManagementParams, ErrorResponse } from '../types.js'

export async function manageApp(params: AppManagementParams) {
  const { baseURL, orgUuid, appInstallationId, token, action, manifestUrl } = params
  
  let apiPath: string
  let requestBody: any = {}
  
  // 根据不同的action构建API路径和请求体
  if (action === 'install') {
    apiPath = '/platform/api/app/install'
    requestBody = {
      org_id: orgUuid,
      manifest_url: manifestUrl
    }
  } else {
    // enable, disable, uninstall 使用 installation_id
    apiPath = `/platform/api/app/${appInstallationId}/${action}`
  }
  
  const fullURL = `${baseURL}${apiPath}`
  
  try {
    const response = await axios.post(
      fullURL,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 30000
      }
    )
    
    return { data: response.data, status: response.status }
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
          errorMsg += `\n\nDetailed error:\n  ${formattedDescription}`
        }
      }
      
      throw new Error(`App ${action} failed: ${errorMsg}`)
    }
    throw error
  }
}