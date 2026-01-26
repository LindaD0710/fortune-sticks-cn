# Vercel 部署指南

## 🚀 快速开始

### 方法一：通过 Vercel 网页界面（推荐，最简单）

#### 步骤 1: 创建 Vercel 账户

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 点击右上角 "Sign Up"

2. **选择登录方式**
   - **推荐**：点击 "Continue with GitHub"（使用 GitHub 账户登录）
   - 这样可以直接连接你的 GitHub 仓库，无需额外配置

3. **授权 Vercel 访问 GitHub**
   - 点击 "Authorize Vercel"
   - 选择要授权的仓库（可以选择所有仓库，或只授权 `oriental-oracle`）

#### 步骤 2: 导入项目

1. **进入 Vercel Dashboard**
   - 登录后，点击 "Add New..." → "Project"

2. **选择仓库**
   - 在仓库列表中找到 `LindaD0710/oriental-oracle`
   - 点击 "Import"

3. **配置项目**
   - **Project Name**: `oriental-oracle`（或你喜欢的名字）
   - **Framework Preset**: Next.js（应该自动检测到）
   - **Root Directory**: `./`（保持默认）
   - **Build Command**: `npm run build`（自动填充）
   - **Output Directory**: `.next`（自动填充）
   - **Install Command**: `npm install`（自动填充）

#### 步骤 3: 配置环境变量

**重要**：在部署前必须配置环境变量！

1. **在项目配置页面，找到 "Environment Variables" 部分**

2. **添加以下环境变量**：

   ```
   OPENROUTER_API_KEY = your_openrouter_api_key_here
   ```

   ```
   OPENROUTER_MODEL = anthropic/claude-3.5-sonnet
   ```
   （可选，如果不设置会使用默认值）

   ```
   NEXT_PUBLIC_APP_URL = https://your-app-name.vercel.app
   ```
   （可选，部署后会自动生成，可以之后再更新）

3. **点击 "Add" 添加每个变量**

4. **选择环境**：
   - 勾选 "Production"（生产环境）
   - 勾选 "Preview"（预览环境，可选）
   - 勾选 "Development"（开发环境，可选）

#### 步骤 4: 部署

1. **点击 "Deploy" 按钮**

2. **等待构建完成**
   - 通常需要 1-3 分钟
   - 可以在构建日志中查看进度

3. **部署成功**
   - 你会看到一个绿色的 "Success" 消息
   - Vercel 会提供一个 URL，例如：`https://oriental-oracle.vercel.app`

#### 步骤 5: 更新环境变量（如果需要）

部署完成后，你可能需要更新 `NEXT_PUBLIC_APP_URL`：

1. 进入项目设置：点击项目名称 → "Settings"
2. 找到 "Environment Variables"
3. 编辑 `NEXT_PUBLIC_APP_URL`，设置为你的实际部署 URL
4. 重新部署（Vercel 会自动触发，或手动点击 "Redeploy"）

---

### 方法二：使用 Vercel CLI（命令行）

如果你更喜欢使用命令行：

#### 步骤 1: 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 步骤 2: 登录 Vercel

```bash
vercel login
```

这会打开浏览器让你登录。

#### 步骤 3: 在项目目录中部署

```bash
cd "/Users/lindadong/Desktop/小创意/【破局】AI编程出海/签筒抽签解读"

# 首次部署
vercel

# 按照提示操作：
# - Set up and deploy? Yes
# - Which scope? 选择你的账户
# - Link to existing project? No（首次部署）
# - Project name? oriental-oracle
# - Directory? ./
# - Override settings? No
```

#### 步骤 4: 配置环境变量

```bash
# 添加环境变量
vercel env add OPENROUTER_API_KEY
# 输入你的 API key，选择 Production

vercel env add OPENROUTER_MODEL
# 输入模型名称（如：anthropic/claude-3.5-sonnet），选择 Production

# 查看环境变量
vercel env ls
```

#### 步骤 5: 部署到生产环境

```bash
vercel --prod
```

---

## 🔧 部署后配置

### 1. 自定义域名（可选）

1. 进入项目设置 → "Domains"
2. 添加你的域名（如：`oracle.yourdomain.com`）
3. 按照提示配置 DNS 记录

### 2. 自动部署设置

- **默认行为**：每次推送到 `main` 分支会自动部署
- **预览部署**：推送到其他分支会创建预览部署
- **Pull Request**：创建 PR 时会自动创建预览部署

### 3. 环境变量管理

- **Production**: 生产环境使用的变量
- **Preview**: 预览/分支环境使用的变量
- **Development**: 本地开发环境使用的变量

**建议**：
- 在 Vercel Dashboard 中管理所有环境变量
- 不要将敏感信息提交到 Git
- 使用不同的 API key 用于生产和开发环境

---

## 📋 部署检查清单

在部署前，确保：

- [ ] 代码已推送到 GitHub
- [ ] `.env.local` 文件已添加到 `.gitignore`（✅ 已完成）
- [ ] 所有环境变量已在 Vercel 中配置
- [ ] `package.json` 包含所有依赖
- [ ] 项目可以在本地正常运行（`npm run build` 成功）

---

## 🐛 常见问题

### 问题 1: 构建失败

**可能原因**：
- 缺少环境变量
- 依赖安装失败
- TypeScript 错误

**解决方法**：
1. 检查构建日志中的错误信息
2. 确保所有环境变量已配置
3. 在本地运行 `npm run build` 检查错误

### 问题 2: API 路由返回 500 错误

**可能原因**：
- 环境变量未正确配置
- API key 无效

**解决方法**：
1. 检查 Vercel 环境变量设置
2. 验证 API key 是否正确
3. 查看 Vercel 函数日志

### 问题 3: 页面显示空白

**可能原因**：
- 构建错误
- 路由配置问题

**解决方法**：
1. 检查浏览器控制台错误
2. 查看 Vercel 部署日志
3. 确保所有页面文件正确

### 问题 4: 环境变量不生效

**解决方法**：
1. 确保环境变量已添加到正确的环境（Production/Preview）
2. 重新部署项目
3. 检查变量名称是否正确（区分大小写）

---

## 🔍 验证部署

部署成功后，测试以下功能：

1. **首页加载**
   - 访问你的 Vercel URL
   - 检查页面是否正常显示

2. **抽签功能**
   - 测试抽签流程
   - 验证结果页面显示

3. **AI 解读功能**
   - 测试 AI 解读生成
   - 检查 API 是否正常工作

4. **响应式设计**
   - 在不同设备上测试
   - 检查移动端显示

---

## 📊 监控和分析

### Vercel Analytics（可选）

1. 进入项目设置 → "Analytics"
2. 启用 Vercel Analytics（可能需要升级到 Pro 计划）
3. 查看访问统计和性能指标

### 函数日志

1. 进入项目 → "Deployments"
2. 点击某个部署
3. 查看 "Functions" 标签页
4. 检查 API 路由的日志

---

## 🔄 更新部署

### 自动更新

每次推送到 GitHub 的 `main` 分支，Vercel 会自动：
1. 检测更改
2. 运行构建
3. 部署新版本

### 手动重新部署

1. 进入 Vercel Dashboard
2. 选择项目
3. 进入 "Deployments"
4. 点击某个部署右侧的 "..." 菜单
5. 选择 "Redeploy"

---

## 🎉 完成！

部署成功后，你的应用就可以通过 Vercel 提供的 URL 访问了！

**下一步建议**：
- 配置自定义域名
- 设置监控和告警
- 优化性能（如果需要）
- 继续开发新功能

---

## 📚 相关资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Vercel 环境变量文档](https://vercel.com/docs/concepts/projects/environment-variables)

---

**需要帮助？** 查看 Vercel 支持或项目 Issues
