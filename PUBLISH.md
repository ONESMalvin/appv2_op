# 发布 @onesmalvin/op2 到 NPM 指南

## 发布前准备

### 1. 注册 NPM 账号
如果还没有 NPM 账号，请前往 [npmjs.com](https://www.npmjs.com) 注册

### 2. 本地登录 NPM
```bash
npm login
# 输入用户名、密码和邮箱
```

### 3. 验证登录状态
```bash
npm whoami
# 应该显示你的用户名
```

## 发布步骤

### 1. 更新版本号
```bash
# 补丁版本 (1.0.0 -> 1.0.1)
npm version patch

# 小版本 (1.0.0 -> 1.1.0)
npm version minor

# 大版本 (1.0.0 -> 2.0.0)
npm version major
```

### 2. 构建项目
```bash
npm run build
```

### 3. 测试包内容
查看将要发布的文件：
```bash
npm pack --dry-run
```

### 4. 发布到 NPM
```bash
# 首次发布 (作用域包需要 --access public)
npm publish --access public

# 后续版本更新
npm publish
```

## 用户安装和使用

发布成功后，用户可以通过以下方式使用：

### 全局安装
```bash
npm install -g @onesmalvin/op2
op2 login https://your-ones-platform.com
```

### 通过 npx 使用（推荐）
```bash
# 无需安装，直接使用
npx @onesmalvin/op2 login https://your-ones-platform.com
npx @onesmalvin/op2 app install -m manifest-url
```

### 本地项目依赖
```bash
# 添加到项目依赖
npm install @onesmalvin/op2

# 在 package.json scripts 中使用
{
  "scripts": {
    "login": "op2 login",
    "deploy-app": "op2 app install -m $MANIFEST_URL"
  }
}
```

## 发布后验证

### 1. 检查包页面
访问: https://www.npmjs.com/package/@onesmalvin/op2

### 2. 测试安装
```bash
# 在另一个目录测试
cd /tmp
npx @onesmalvin/op2 --help
```

## 版本管理

- **Patch (1.0.x)**: Bug 修复，向后兼容
- **Minor (1.x.0)**: 新功能，向后兼容
- **Major (x.0.0)**: 破坏性改动，不向后兼容

## 注意事项

1. **包名冲突**: 如果 `@onesmalvin/op2` 被占用，需要改名
2. **README 重要性**: NPM 页面会显示 README.md 内容
3. **关键词优化**: package.json 中的 keywords 影响搜索排名
4. **版本号规范**: 遵循 [语义化版本](https://semver.org/lang/zh-CN/)

## 常见问题

### 发布失败
```bash
# 清理 npm 缓存
npm cache clean --force

# 检查 npm 配置
npm config list
```

### 更新发布
```bash
# 撤销发布（24小时内）
npm unpublish @onesmalvin/op2@1.0.0

# 标记过时版本
npm deprecate @onesmalvin/op2@1.0.0 "Please use version 1.0.1"
```