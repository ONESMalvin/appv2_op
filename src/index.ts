#!/usr/bin/env node

import { Command } from 'commander'
import { login } from './login.js'
import { appCommand } from './app.js'
import { validateCommand } from './validate.js'

const program = new Command()

program
  .name('op2')
  .description('A cli tool for ONES platform V2')
  .version('1.0.0')

program
  .command('login')
  .description('Login to ONES platform and save credentials locally')
  .argument('[baseURL]', 'Environment base URL (e.g., https://ones.ai)')
  .option('-u, --username <username>', 'Username (email or phone number)')
  .option('-p, --password <password>', 'Password')
  .addHelpText('after', '\nExamples:\n  $ npx op2 login https://ones.ai -u user@example.com -p mypassword\n  $ npx op2 login  # Interactive mode')
  .action((baseURL, options) => login(baseURL, options))

program
  .command('app')
  .description('Manage ONES apps (install, enable, disable, uninstall)')
  .argument('<action>', 'Action to perform (install|enable|disable|uninstall)')
  .option('-a, --app-installation-id <id>', 'App installation ID (required for enable/disable/uninstall)')
  .option('-m, --manifest-url <url>', 'Manifest URL (required for install)')
  .addHelpText('after', '\nExamples:\n  $ npx op2 app install -m https://example.com/manifest.yaml\n  $ npx op2 app enable -a installation_12345\n  $ npx op2 app install  # Interactive mode')
  .action((action, options) => {
    if (!['install', 'enable', 'disable', 'uninstall'].includes(action)) {
      console.error(`❌ Invalid action: ${action}`)
      console.error('Valid actions: install, enable, disable, uninstall')
      process.exit(1)
    }
    appCommand(action as 'install' | 'enable' | 'disable' | 'uninstall', {
      appInstallationId: options.appInstallationId,
      manifestUrl: options.manifestUrl
    })
  })

program
  .command('validate')
  .description('Validate manifest.json file against ONES app schema')
  .option('-m, --manifest <path>', 'Path to manifest.json file')
  .option('-s, --schema <path>', 'Path to schema file (default: docs/app_manifest_schema.json)')
  .addHelpText('after', '\nExamples:\n  $ npx op2 validate -m ./manifest.json\n  $ npx op2 validate -m ./my-app/manifest.json -s ./custom-schema.json\n  $ npx op2 validate  # Interactive mode')
  .action((options) => validateCommand(options))

// 如果没有提供任何命令，显示帮助信息
if (process.argv.length <= 2) {
  program.help()
}

program.parse()