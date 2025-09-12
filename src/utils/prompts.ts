import inquirer from 'inquirer'
import { isEmail, isPhone, isURL, isPassword } from './validation.js'
import type { LoginOptions, LoginPromptAnswer } from '../types.js'

export async function displayLoginPrompts(
  baseURL?: string,
  options: LoginOptions = {}
): Promise<LoginPromptAnswer> {
  // If all required parameters are provided via CLI, skip interactive prompts
  if (baseURL && options.username && options.password) {
    // Validate provided parameters
    if (!isURL(baseURL)) {
      throw new Error('Invalid base URL provided')
    }
    if (!isEmail(options.username) && !isPhone(options.username)) {
      throw new Error('Username must be a valid email or phone number')
    }
    if (!isPassword(options.password)) {
      throw new Error('Password must be 8-32 characters and not contain spaces')
    }
    
    // Clean baseURL (remove trailing slash)
    let cleanURL = baseURL.trim()
    if (cleanURL.endsWith('/')) {
      cleanURL = cleanURL.slice(0, -1)
    }
    
    return {
      baseURL: cleanURL,
      username: options.username,
      password: options.password
    }
  }

  const questions = [
    {
      type: 'input',
      name: 'baseURL',
      message: 'Please enter the environment base URL:',
      default: baseURL,
      when: () => !baseURL,
      transformer: (input: string) => {
        let url = input.trim()
        // 移除尾部斜杠
        if (url.endsWith('/')) {
          url = url.slice(0, -1)
        }
        return url
      },
      validate: (input: string) => {
        if (!input) return 'URL is required'
        if (!isURL(input)) return 'URL is invalid'
        return true
      }
    },
    {
      type: 'input',
      name: 'username',
      message: 'Username (email or phone):',
      default: options.username,
      when: () => !options.username,
      validate: (input: string) => {
        if (!input) return 'Username is required'
        if (!isEmail(input) && !isPhone(input)) {
          return 'Username must be a valid email or phone number'
        }
        return true
      }
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password:',
      when: () => !options.password,
      validate: (input: string) => {
        if (!input) return 'Password is required'
        if (!isPassword(input)) {
          return 'Password must be 8-32 characters and not contain spaces'
        }
        return true
      }
    }
  ]

  const answers = await inquirer.prompt(questions)
  
  return {
    baseURL: baseURL || answers.baseURL,
    username: options.username || answers.username,
    password: options.password || answers.password
  }
}