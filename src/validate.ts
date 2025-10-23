import { readFileSync, existsSync } from 'fs'
import { join, resolve } from 'path'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import inquirer from 'inquirer'
import type { ValidationOptions, ValidationResult } from './types.js'

// 初始化 AJV 验证器
const ajv = new Ajv2020()
addFormats(ajv)

// 默认 schema 文件路径
const DEFAULT_SCHEMA_PATH = join(process.cwd(), 'docs', 'app_manifest_schema.json')

/**
 * 加载 JSON Schema
 */
function loadSchema(schemaPath: string): any {
  try {
    if (!existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`)
    }
    
    const schemaContent = readFileSync(schemaPath, 'utf8')
    return JSON.parse(schemaContent)
  } catch (error) {
    throw new Error(`Failed to load schema: ${error instanceof Error ? error.message : error}`)
  }
}

/**
 * 加载 manifest 文件
 */
function loadManifest(manifestPath: string): any {
  try {
    if (!existsSync(manifestPath)) {
      throw new Error(`Manifest file not found: ${manifestPath}`)
    }
    
    const manifestContent = readFileSync(manifestPath, 'utf8')
    return JSON.parse(manifestContent)
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in manifest file: ${error.message}`)
    }
    throw new Error(`Failed to load manifest: ${error instanceof Error ? error.message : error}`)
  }
}

/**
 * 验证 manifest 文件
 */
function validateManifest(manifestData: any, schema: any): ValidationResult {
  const validate = ajv.compile(schema)
  const isValid = validate(manifestData)
  
  if (isValid) {
    return {
      isValid: true,
      errors: []
    }
  }
  
  const errors = validate.errors?.map((error) => {
    // 处理 additionalProperties 错误，显示具体的额外属性名称
    if (error.keyword === 'additionalProperties' && error.params?.additionalProperty) {
      const path = error.instancePath || 'root'
      return `${path}/${error.params.additionalProperty}: Unknown property "${error.params.additionalProperty}"`
    }
    
    // 处理其他类型的错误
    const path = error.instancePath || 'root'
    const message = error.message || 'Validation error'
    return `${path}: ${message}`
  }) || ['Unknown validation error']
  
  return {
    isValid: false,
    errors
  }
}

/**
 * 获取 manifest 文件路径
 */
async function getManifestPath(providedPath?: string): Promise<string> {
  if (providedPath) {
    return resolve(providedPath)
  }
  
  // 交互式输入
  const { manifestPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'manifestPath',
      message: 'Please enter the path to the manifest.json file:',
      default: './manifest.json',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Manifest file path is required'
        }
        return true
      }
    }
  ])
  
  return resolve(manifestPath)
}

/**
 * 获取 schema 文件路径
 */
async function getSchemaPath(providedPath?: string): Promise<string> {
  if (providedPath) {
    return resolve(providedPath)
  }
  
  // 交互式输入
  const { schemaPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'schemaPath',
      message: 'Please enter the path to the schema file:',
      default: DEFAULT_SCHEMA_PATH,
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Schema file path is required'
        }
        return true
      }
    }
  ])
  
  return resolve(schemaPath)
}

/**
 * 显示验证结果
 */
function displayValidationResult(result: ValidationResult, manifestPath: string): void {
  console.log(`\n📋 Validating manifest file: ${manifestPath}`)
  console.log('=' .repeat(60))
  
  if (result.isValid) {
    console.log('✅ Validation successful!')
    console.log('🎉 The manifest file is valid according to the schema.')
  } else {
    console.log('❌ Validation failed!')
    console.log('\n📝 Found the following errors:')
    
    result.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`)
    })
    
    console.log('\n💡 Please fix these errors and try again.')
  }
  
  console.log('=' .repeat(60))
}

/**
 * 主验证函数
 */
export async function validateCommand(options: ValidationOptions) {
  try {
    console.log('🔍 Starting manifest validation...')
    
    // 获取文件路径
    const manifestPath = await getManifestPath(options.manifest)
    const schemaPath = await getSchemaPath(options.schema)
    
    console.log(`📄 Manifest file: ${manifestPath}`)
    console.log(`📋 Schema file: ${schemaPath}`)
    
    // 加载文件
    const schema = loadSchema(schemaPath)
    const manifestData = loadManifest(manifestPath)
    
    // 执行验证
    const result = validateManifest(manifestData, schema)
    
    // 显示结果
    displayValidationResult(result, manifestPath)
    
    // 如果验证失败，退出码为 1
    if (!result.isValid) {
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ Validation failed:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}
