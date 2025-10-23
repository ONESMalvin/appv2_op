# OP2 CLI Tool

一个从ONES CLI工具链中提取的简化CLI工具，专门用于ONES平台的用户认证和应用管理。

## 功能特点

- ✅ 支持用户名/密码登录（邮箱或手机号）
- ✅ 交互式命令行界面
- ✅ 自动保存登录凭证到本地
- ✅ 移除了复杂的host-url和scope参数
- ✅ TypeScript编写，类型安全
- ✅ 支持npx直接使用
- ✅ 支持应用管理（install/enable/disable/uninstall）
- ✅ 支持 manifest.json 文件校验

## 安装和使用

### 本地开发安装
```bash
npm install
npm run build
npm link  # 全局链接到系统
```

### 使用方法

#### 交互式登录
```bash
npx @onesmalvin/op2 login
```

#### 指定环境URL
```bash
npx @onesmalvin/op2 login https://your-ones-platform.com
```

#### 命令行参数登录
```bash
npx @onesmalvin/op2 login https://your-ones-platform.com -u your-email@example.com -p your-password
```

#### 应用管理
```bash
# 安装应用
npx @onesmalvin/op2 app install -m <manifest-url>

# 启用应用
npx @onesmalvin/op2 app enable -a <app-installation-id>

# 禁用应用
npx @onesmalvin/op2 app disable -a <app-installation-id>

# 卸载应用
npx @onesmalvin/op2 app uninstall -a <app-installation-id>

# 交互式模式（不提供参数时会提示输入）
npx @onesmalvin/op2 app install
```

#### Manifest 校验
```bash
# 校验 manifest.json 文件
npx @onesmalvin/op2 validate -m ./manifest.json

# 指定自定义 schema 文件
npx @onesmalvin/op2 validate -m ./manifest.json -s ./custom-schema.json

# 交互式模式（不提供参数时会提示输入）
npx @onesmalvin/op2 validate
```

## 开发

```bash
# 开发模式运行
npm run dev login

# 构建
npm run build

# 本地测试
node dist/index.js login
```

## 配置文件

登录成功后，配置会保存到当前目录的 `.ones/simple-login.yaml`：

```yaml
platform:
  baseURL: https://your-ones-platform.com
  username: your-email@example.com
  token: your-auth-token
local:
  user_uuid: your-user-uuid
  organization_uuid: your-org-uuid
```

## 与原版的区别

相比原始的ONES CLI登录工具，此版本：

1. **移除了host-url参数** - 简化了本地调试URL配置
2. **移除了scope参数** - 去掉了复杂的scope管理逻辑
3. **简化了配置文件** - 只保留核心的认证信息
4. **独立项目** - 不依赖庞大的工具链，可独立使用
5. **添加了应用管理** - 支持安装、启用、禁用、卸载应用

## 应用管理功能

### 支持的操作
- `install` - 安装应用到指定团队
- `enable` - 启用已安装的应用
- `disable` - 禁用已启用的应用  
- `uninstall` - 卸载应用

### 参数说明
- `-m, --manifest-url <url>` - Manifest URL（install操作必需）
- `-a, --app-installation-id <id>` - 应用安装ID（enable/disable/uninstall操作必需）

### 使用示例
```bash
# 使用真实的manifest URL和installation ID
npx @onesmalvin/op2 app install -m https://your-manifest-url
npx @onesmalvin/op2 app enable -a install_your-installation-id
```

## Manifest 校验功能

### 功能说明
- 验证 manifest.json 文件是否符合 ONES 应用清单规范
- 使用 JSON Schema 进行严格验证
- 支持自定义 schema 文件
- 提供详细的错误信息和修复建议

### 支持的参数
- `-m, --manifest <path>` - manifest.json 文件路径
- `-s, --schema <path>` - 自定义 schema 文件路径（可选，默认使用 `docs/app_manifest_schema.json`）

### 使用场景
- 开发 ONES 应用时验证清单文件格式
- CI/CD 流程中自动校验
- 应用发布前的格式检查

### 校验规则
基于 `docs/app_manifest_schema.json` 中定义的规范：
- 必需字段验证（id, name, version, base_url, auth, lifecycle_callback）
- 字段格式验证（URL格式、版本号格式、ID格式等）
- 数据类型验证
- 枚举值验证

## 技术栈

- TypeScript
- Commander.js (CLI框架)
- Inquirer.js (交互式命令行)
- Axios (HTTP客户端)
- js-yaml (YAML处理)
- AJV (JSON Schema验证)