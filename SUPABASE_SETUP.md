# Supabase 设置指南

## 📋 步骤 1: 创建 Supabase 项目

1. **访问 Supabase**
   - 打开 https://supabase.com
   - 点击 "Start your project" 或 "Sign in"

2. **创建账户**
   - 使用 GitHub 账户登录（推荐）
   - 或使用邮箱注册

3. **创建新项目**
   - 点击 "New Project"
   - 填写项目信息：
     - **Name**: `oriental-oracle`（或你喜欢的名字）
     - **Database Password**: 设置一个强密码（保存好，以后需要用到）
     - **Region**: 选择离你最近的区域（如 `Southeast Asia (Singapore)`）
     - **Pricing Plan**: 选择 "Free"（免费计划足够开始使用）
   - 点击 "Create new project"
   - 等待项目创建完成（通常需要 1-2 分钟）

## 🔑 步骤 2: 获取 API 密钥

1. **进入项目设置**
   - 项目创建完成后，点击左侧菜单的 "Settings"（齿轮图标）
   - 选择 "API"

2. **复制以下信息**：
   - **Project URL**: 例如 `https://xxxxx.supabase.co`
   - **anon public key**: 以 `eyJ...` 开头的长字符串

3. **保存这些信息**（稍后需要添加到环境变量）

## 🔐 步骤 3: 配置 Google OAuth

### 3.1 在 Google Cloud Console 创建 OAuth 客户端

1. **访问 Google Cloud Console**
   - 打开 https://console.cloud.google.com
   - 登录你的 Google 账户

2. **创建项目**（如果还没有）
   - 点击项目选择器
   - 点击 "New Project"
   - 输入项目名称：`Oriental Oracle`
   - 点击 "Create"

3. **启用 Google+ API**
   - 在左侧菜单选择 "APIs & Services" → "Library"
   - 搜索 "Google+ API" 或 "Google Identity"
   - 点击 "Enable"

4. **创建 OAuth 2.0 客户端 ID**
   - 进入 "APIs & Services" → "Credentials"
   - 点击 "Create Credentials" → "OAuth client ID"
   - 如果提示配置 OAuth 同意屏幕：
     - **User Type**: 选择 "External"
     - **App name**: `Oriental Oracle`
     - **User support email**: 你的邮箱
     - **Developer contact**: 你的邮箱
     - 点击 "Save and Continue"
     - Scopes: 保持默认，点击 "Save and Continue"
     - Test users: 可以添加你的邮箱，点击 "Save and Continue"
     - 点击 "Back to Dashboard"
   
   - 现在创建 OAuth 客户端：
     - **Application type**: 选择 "Web application"
     - **Name**: `Oriental Oracle Web Client`
     - **Authorized JavaScript origins**: 
       ```
       http://localhost:3000
       https://your-app.vercel.app
       ```
       （替换为你的实际域名）
     - **Authorized redirect URIs**:
       ```
       http://localhost:3000/auth/callback
       https://your-app.vercel.app/auth/callback
       https://xxxxx.supabase.co/auth/v1/callback
       ```
       （替换 `xxxxx` 为你的 Supabase 项目 ID）
     - 点击 "Create"
     - **重要**：复制 **Client ID** 和 **Client Secret**

### 3.2 在 Supabase 中配置 Google OAuth

1. **进入 Supabase 项目设置**
   - 在 Supabase Dashboard，点击 "Settings" → "Auth"
   - 滚动到 "Auth Providers"

2. **启用 Google Provider**
   - 找到 "Google" 选项
   - 点击启用开关

3. **填写 Google OAuth 信息**
   - **Client ID (for OAuth)**: 粘贴从 Google Cloud Console 复制的 Client ID
   - **Client Secret (for OAuth)**: 粘贴从 Google Cloud Console 复制的 Client Secret
   - 点击 "Save"

## 🌐 步骤 4: 配置环境变量

### 4.1 本地开发环境

在项目根目录的 `.env.local` 文件中添加：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...（你的 anon key）

# OpenRouter (已有)
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**重要**：替换 `xxxxx` 为你的 Supabase 项目 ID

### 4.2 Vercel 生产环境

1. **进入 Vercel 项目设置**
   - 打开你的 Vercel Dashboard
   - 选择项目 → "Settings" → "Environment Variables"

2. **添加 Supabase 环境变量**
   - 点击 "Add Environment Variable"
   - 添加以下变量：
     ```
     NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...（你的 anon key）
     ```
   - 环境选择：勾选 Production, Preview, Development
   - 点击 "Save"

3. **重新部署**
   - 进入 "Deployments"
   - 点击最新部署的 "..." 菜单
   - 选择 "Redeploy"

## ✅ 步骤 5: 验证设置

1. **本地测试**
   ```bash
   npm run dev
   ```
   - 访问 http://localhost:3000
   - 点击右上角的 "Sign in with Google"
   - 应该会跳转到 Google 登录页面
   - 登录后应该会跳转回应用

2. **生产环境测试**
   - 访问你的 Vercel 部署 URL
   - 测试登录功能

## 🔍 常见问题

### 问题 1: "Redirect URI mismatch"

**原因**：Google OAuth 的 redirect URI 配置不正确

**解决**：
1. 检查 Supabase 的 redirect URI 格式
2. 在 Google Cloud Console 中添加正确的 redirect URI：
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```

### 问题 2: "Invalid client"

**原因**：Client ID 或 Client Secret 错误

**解决**：
1. 检查 Supabase 中的 Google OAuth 配置
2. 确保 Client ID 和 Client Secret 正确复制（没有多余空格）

### 问题 3: 登录后没有跳转

**原因**：`NEXT_PUBLIC_APP_URL` 配置不正确

**解决**：
1. 检查 `.env.local` 和 Vercel 中的 `NEXT_PUBLIC_APP_URL`
2. 确保 URL 格式正确（没有尾部斜杠）

## 📚 相关资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)
- [Google OAuth 文档](https://developers.google.com/identity/protocols/oauth2)

---

**需要帮助？** 查看 Supabase Dashboard 的日志或联系支持
