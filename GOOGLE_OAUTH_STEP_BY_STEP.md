# Google OAuth 配置 - 一步一步指南

## 📋 准备工作

在开始之前，请确保：
- ✅ 你已经创建了 Supabase 项目
- ✅ 你已经获取了 Supabase 的 URL 和 API Key
- ✅ 你有一个 Google 账户

---

## 第一部分：在 Google Cloud Console 创建 OAuth 客户端

### 步骤 1: 访问 Google Cloud Console

1. **打开浏览器，访问**：
   ```
   https://console.cloud.google.com
   ```

2. **登录你的 Google 账户**
   - 使用你希望用于 OAuth 的 Google 账户登录

### 步骤 2: 创建或选择项目

**情况 A：如果你还没有项目**

1. 点击页面顶部的项目选择器（显示 "Select a project" 或项目名称）
2. 点击 "New Project"
3. 填写项目信息：
   - **Project name**: `Oriental Oracle`（或任何你喜欢的名字）
   - **Organization**: 保持默认（如果有）
   - **Location**: 保持默认
4. 点击 "Create"
5. 等待项目创建完成（几秒钟）

**情况 B：如果你已有项目**

1. 点击项目选择器
2. 选择你想要使用的项目
3. 或者创建一个新项目（推荐，更清晰）

### 步骤 3: 配置 OAuth 同意屏幕

1. **进入 OAuth 同意屏幕设置**
   - 在左侧菜单，找到 "APIs & Services"
   - 点击 "OAuth consent screen"

2. **选择用户类型**
   - 选择 **"External"**（外部用户）
   - 点击 "Create"

3. **填写应用信息**
   - **App name**: `Oriental Oracle`
   - **User support email**: 选择你的邮箱
   - **App logo**: （可选）可以跳过
   - **App domain**: （可选）可以跳过
   - **Application home page**: `https://your-app.vercel.app`（你的 Vercel 部署 URL，如果还没有可以先填 `https://localhost:3000`）
   - **Application privacy policy link**: （可选）可以跳过
   - **Application terms of service link**: （可选）可以跳过
   - **Authorized domains**: （可选）可以跳过
   - **Developer contact information**: 填写你的邮箱
   
   点击 "Save and Continue"

4. **配置 Scopes（权限范围）**
   - 保持默认设置（通常已经有 `email`, `profile`, `openid`）
   - 点击 "Save and Continue"

5. **添加测试用户**（重要！）
   - 在 "Test users" 部分，点击 "Add Users"
   - 添加你的 Google 邮箱地址
   - 点击 "Add"
   - 点击 "Save and Continue"

6. **完成配置**
   - 查看摘要
   - 点击 "Back to Dashboard"

### 步骤 4: 创建 OAuth 2.0 客户端 ID

1. **进入 Credentials（凭据）页面**
   - 在左侧菜单，点击 "APIs & Services" → "Credentials"

2. **创建 OAuth 客户端 ID**
   - 点击页面顶部的 "+ CREATE CREDENTIALS"
   - 选择 "OAuth client ID"

3. **选择应用类型**
   - **Application type**: 选择 **"Web application"**

4. **填写客户端信息**
   - **Name**: `Oriental Oracle Web Client`（或任何描述性名称）

5. **配置 Authorized JavaScript origins（授权的 JavaScript 来源）**
   
   点击 "Add URI" 按钮，添加以下 URL（每行一个）：
   ```
   http://localhost:3000
   https://your-app-name.vercel.app
   ```
   
   **重要**：将 `your-app-name.vercel.app` 替换为你的实际 Vercel 部署 URL
   
   **如何找到你的 Vercel URL**：
   - 进入 Vercel Dashboard
   - 选择你的项目
   - 在 Overview 页面，你会看到 "Production" 下的 URL

6. **配置 Authorized redirect URIs（授权的重定向 URI）**
   
   点击 "Add URI" 按钮，添加以下 URL（每行一个）：
   ```
   http://localhost:3000/auth/callback
   https://your-app-name.vercel.app/auth/callback
   https://xxxxx.supabase.co/auth/v1/callback
   ```
   
   **重要**：
   - 将 `your-app-name.vercel.app` 替换为你的实际 Vercel 部署 URL
   - 将 `xxxxx` 替换为你的 Supabase 项目 ID（在 Supabase Dashboard 的 URL 中可以看到）

7. **创建客户端**
   - 点击 "Create" 按钮

8. **保存凭据信息**（非常重要！）
   
   会弹出一个对话框，显示：
   - **Your Client ID**: 一长串以 `xxxxx.apps.googleusercontent.com` 结尾的字符串
   - **Your Client Secret**: 一长串以 `GOCSPX-` 开头的字符串
   
   **立即复制这两个值并保存到安全的地方！**
   
   ⚠️ **警告**：Client Secret 只显示一次，如果丢失需要重新创建！

---

## 第二部分：在 Supabase 中配置 Google OAuth

### 步骤 5: 进入 Supabase 项目设置

1. **打开 Supabase Dashboard**
   - 访问 https://supabase.com/dashboard
   - 登录你的账户

2. **选择你的项目**
   - 在项目列表中找到 `oriental-oracle`（或你创建的项目名）
   - 点击进入项目

### 步骤 6: 找到 Auth 设置

1. **进入 Settings**
   - 点击左侧菜单的 "Settings"（齿轮图标）

2. **进入 Auth 设置**
   - 在 Settings 菜单中，点击 "Auth"

3. **找到 Auth Providers**
   - 向下滚动，找到 "Auth Providers" 部分

### 步骤 7: 启用 Google Provider

1. **找到 Google 选项**
   - 在 Provider 列表中，找到 "Google"
   - 你会看到一个开关按钮

2. **启用 Google Provider**
   - 点击开关，将其打开（变为启用状态）

3. **填写 OAuth 信息**
   
   现在会显示两个输入框：
   
   - **Client ID (for OAuth)**: 
     - 粘贴你从 Google Cloud Console 复制的 **Client ID**
     - 格式类似：`123456789-abcdefghijklmnop.apps.googleusercontent.com`
   
   - **Client Secret (for OAuth)**: 
     - 粘贴你从 Google Cloud Console 复制的 **Client Secret**
     - 格式类似：`GOCSPX-xxxxxxxxxxxxxxxxxxxxx`
   
   **重要**：
   - 确保没有多余的空格
   - 确保完整复制（不要遗漏任何字符）

4. **保存配置**
   - 点击 "Save" 按钮
   - 等待保存成功（通常会显示成功消息）

---

## 第三部分：配置环境变量

### 步骤 8: 获取 Supabase 信息

1. **在 Supabase Dashboard 中**
   - 确保你在项目页面
   - 点击 "Settings" → "API"

2. **复制以下信息**：
   - **Project URL**: 例如 `https://xxxxx.supabase.co`
   - **anon public key**: 一长串以 `eyJ` 开头的字符串

### 步骤 9: 配置本地环境变量

1. **在项目根目录创建或编辑 `.env.local` 文件**

2. **添加以下内容**：
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...（你的完整 anon key）
   
   # OpenRouter (如果还没有)
   OPENROUTER_API_KEY=your_openrouter_api_key
   OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **替换占位符**：
   - 将 `xxxxx` 替换为你的 Supabase 项目 ID
   - 将 `eyJ...` 替换为你的完整 anon key

4. **保存文件**

### 步骤 10: 配置 Vercel 环境变量

1. **进入 Vercel Dashboard**
   - 访问 https://vercel.com/dashboard
   - 选择你的项目

2. **进入环境变量设置**
   - 点击 "Settings" → "Environment Variables"

3. **添加 Supabase 环境变量**
   
   点击 "Add Environment Variable"，添加：
   
   **变量 1**：
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://xxxxx.supabase.co`（你的 Supabase URL）
   - Environment: 勾选 Production, Preview, Development
   - 点击 "Save"
   
   **变量 2**：
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJ...`（你的完整 anon key）
   - Environment: 勾选 Production, Preview, Development
   - 点击 "Save"

4. **重新部署**
   - 进入 "Deployments" 页面
   - 点击最新部署的 "..." 菜单
   - 选择 "Redeploy"
   - 等待部署完成

---

## 第四部分：测试配置

### 步骤 11: 本地测试

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **访问应用**
   - 打开浏览器，访问 http://localhost:3000

3. **测试登录**
   - 点击右上角的 "Sign in with Google" 按钮
   - 应该会跳转到 Google 登录页面
   - 选择你的 Google 账户
   - 点击 "Allow" 授权
   - 应该会跳转回应用，并且显示你的用户信息

### 步骤 12: 生产环境测试

1. **访问你的 Vercel 部署 URL**
   - 例如：`https://oriental-oracle.vercel.app`

2. **测试登录**
   - 点击 "Sign in with Google"
   - 完成登录流程
   - 验证登录成功

---

## 🔍 常见问题排查

### 问题 1: "Redirect URI mismatch"

**错误信息**：`Error 400: redirect_uri_mismatch`

**原因**：Google OAuth 的 redirect URI 配置不正确

**解决方法**：
1. 检查 Supabase 的 redirect URI 格式
2. 在 Google Cloud Console → Credentials → 你的 OAuth 客户端
3. 确保 "Authorized redirect URIs" 中包含：
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```
   （`xxxxx` 是你的 Supabase 项目 ID）

### 问题 2: "Invalid client"

**错误信息**：`Error 401: invalid_client`

**原因**：Client ID 或 Client Secret 错误

**解决方法**：
1. 检查 Supabase 中的 Google OAuth 配置
2. 确保 Client ID 和 Client Secret 正确复制（没有多余空格）
3. 如果还是不行，在 Google Cloud Console 重新创建 OAuth 客户端

### 问题 3: "Access blocked"

**错误信息**：`Access blocked: This app's request is invalid`

**原因**：OAuth 同意屏幕未正确配置，或应用在测试模式

**解决方法**：
1. 确保在 OAuth 同意屏幕中添加了你的邮箱作为测试用户
2. 或者将应用发布到生产环境（需要验证）

### 问题 4: 登录后没有跳转

**原因**：`NEXT_PUBLIC_APP_URL` 配置不正确

**解决方法**：
1. 检查 `.env.local` 和 Vercel 中的 `NEXT_PUBLIC_APP_URL`
2. 确保 URL 格式正确（没有尾部斜杠）
3. 本地开发使用：`http://localhost:3000`
4. 生产环境使用你的 Vercel URL

---

## ✅ 配置检查清单

完成配置后，确认以下项目：

- [ ] Google Cloud Console 项目已创建
- [ ] OAuth 同意屏幕已配置
- [ ] OAuth 客户端 ID 已创建
- [ ] Authorized JavaScript origins 已添加（localhost 和 Vercel URL）
- [ ] Authorized redirect URIs 已添加（包括 Supabase callback）
- [ ] Supabase Google Provider 已启用
- [ ] Client ID 和 Client Secret 已添加到 Supabase
- [ ] 本地 `.env.local` 文件已配置
- [ ] Vercel 环境变量已配置
- [ ] 本地测试登录成功
- [ ] 生产环境测试登录成功

---

## 📚 需要帮助？

如果遇到问题：
1. 检查每个步骤是否都完成了
2. 查看错误信息，对照上面的常见问题
3. 检查 Google Cloud Console 和 Supabase 的日志
4. 告诉我具体的错误信息，我可以帮你解决

---

**下一步**：配置完成后，我们可以测试登录功能，然后继续集成支付系统！
