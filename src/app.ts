import { manageApp } from './utils/app-request.js'
import { getLocalConfig } from './utils/config.js'
import type { AppOptions } from './types.js'
import inquirer from 'inquirer'

async function getAppInstallationId(providedId?: string): Promise<string> {
  if (providedId) {
    return providedId
  }

  const { appInstallationId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'appInstallationId',
      message: 'Please enter the app installation ID (for enable/disable/uninstall):',
      validate: (input: string) => {
        if (!input) return 'App installation ID is required'
        return true
      }
    }
  ])

  return appInstallationId
}

async function getManifestUrl(providedUrl?: string): Promise<string> {
  if (providedUrl) {
    return providedUrl
  }

  const { manifestUrl } = await inquirer.prompt([
    {
      type: 'input',
      name: 'manifestUrl',
      message: 'Please enter the manifest URL for installation:',
      validate: (input: string) => {
        if (!input) return 'Manifest URL is required for installation'
        return true
      }
    }
  ])

  return manifestUrl
}

export async function appCommand(
  action: 'install' | 'enable' | 'disable' | 'uninstall',
  options: AppOptions
) {
  try {
    // 读取本地配置
    const config = getLocalConfig()
    if (!config) {
      throw new Error('No login configuration found. Please run "npx op2 login" first')
    }

    const { platform: { baseURL, token }, local: { organization_uuid } } = config
    
    if (!token || !organization_uuid) {
      throw new Error('Invalid configuration. Please run "npx op2 login" again')
    }

    let appInstallationId: string = ''
    let manifestUrl: string | undefined
    
    if (action === 'install') {
      manifestUrl = await getManifestUrl(options.manifestUrl)
      // install 不需要 appInstallationId，使用空字符串
      appInstallationId = ''
    } else {
      // enable, disable, uninstall 需要 installation ID
      appInstallationId = await getAppInstallationId(options.appInstallationId)
    }

    console.log(`🚀 ${action.charAt(0).toUpperCase() + action.slice(1)}ing app...`)
    console.log(`   Org: ${organization_uuid}`)
    if (action === 'install') {
      console.log(`   Manifest URL: ${manifestUrl}`)
    } else {
      console.log(`   Installation ID: ${appInstallationId}`)
    }

    const result = await manageApp({
      baseURL,
      orgUuid: organization_uuid,
      appInstallationId,
      token,
      action,
      manifestUrl
    })

    console.log(`✅ App ${action} successful!`)
    if (result.data && Object.keys(result.data).length > 0) {
      console.log('📄 Response:', JSON.stringify(result.data, null, 2))
    }

  } catch (error) {
    console.error(`❌ App ${action} failed:`, error instanceof Error ? error.message : error)
    process.exit(1)
  }
}