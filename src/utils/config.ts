import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { cwd } from 'process'
import yaml from 'js-yaml'
import type { LocalConfig } from '../types.js'

const CONFIG_DIR = join(cwd(), '.ones')
const CONFIG_FILE = join(CONFIG_DIR, 'simple-login.yaml')

// 确保配置目录存在
export function ensureConfigDir() {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true })
  }
}

// 读取本地配置
export function getLocalConfig(): LocalConfig | null {
  try {
    if (!existsSync(CONFIG_FILE)) {
      return null
    }
    
    const content = readFileSync(CONFIG_FILE, 'utf8')
    return yaml.load(content) as LocalConfig
  } catch (error) {
    console.warn('Failed to read config file:', error)
    return null
  }
}

// 更新本地配置
export function updateLocalConfig(config: LocalConfig) {
  try {
    ensureConfigDir()
    const yamlContent = yaml.dump(config, { 
      indent: 2,
      lineWidth: -1
    })
    writeFileSync(CONFIG_FILE, yamlContent, 'utf8')
  } catch (error) {
    throw new Error(`Failed to save config: ${error}`)
  }
}

// 获取配置文件路径（用于显示给用户）
export function getConfigPath(): string {
  return CONFIG_FILE
}