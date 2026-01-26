# OpenRouter API Key 设置指南

## 📝 步骤 1: 获取 OpenRouter API Key

1. 访问 [OpenRouter 官网](https://openrouter.ai/)
2. 注册/登录账号
3. 进入 [API Keys 页面](https://openrouter.ai/keys)
4. 点击 "Create Key" 创建新的 API Key
5. 复制生成的 API Key（格式类似：`sk-or-v1-xxxxx...`）

## 📝 步骤 2: 配置环境变量

### 方法 1: 使用 .env.local 文件（推荐）

1. 在项目根目录创建 `.env.local` 文件：

```bash
# 在项目根目录执行
touch .env.local
```

2. 在 `.env.local` 文件中添加以下内容：

```env
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Specify a model if Claude is unavailable in your region
# Options: openai/gpt-4, openai/gpt-4-turbo, deepseek/deepseek-chat, openai/gpt-3.5-turbo
# If not set, the system will automatically try models in order:
# 1. anthropic/claude-3.5-sonnet
# 2. openai/gpt-4
# 3. openai/gpt-4-turbo
# 4. deepseek/deepseek-chat (recommended for regions with restrictions)
# 5. openai/gpt-3.5-turbo
OPENROUTER_MODEL=deepseek/deepseek-chat
```

**重要**：
- 将 `sk-or-v1-your-actual-api-key-here` 替换为你的实际 API Key
- `.env.local` 文件已经被添加到 `.gitignore`，不会被提交到 Git

### 方法 2: 使用系统环境变量（可选）

如果你不想使用文件，也可以直接在终端设置：

**macOS/Linux:**
```bash
export OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```

**Windows (PowerShell):**
```powershell
$env:OPENROUTER_API_KEY="sk-or-v1-your-actual-api-key-here"
```

## 📝 步骤 3: 重启开发服务器

设置环境变量后，**必须重启开发服务器**才能生效：

1. 停止当前运行的服务器（按 `Ctrl + C`）
2. 重新启动：
```bash
npm run dev
```

## ✅ 验证配置

### 方法 1: 检查服务器日志

启动服务器后，访问 `/interpret` 页面，如果看到：
- 加载时间较长（等待 AI 生成）
- 内容更个性化，与你的问题相关

说明 API Key 配置成功！

### 方法 2: 检查浏览器 Network

1. 打开浏览器开发者工具（F12）
2. 切换到 "Network" 标签
3. 访问 `/interpret` 页面
4. 找到 `/api/interpret` 请求
5. 查看 Response，如果返回的是 AI 生成的内容（而不是 Mock 数据），说明配置成功

### 方法 3: 检查服务器终端

如果 API Key 配置错误，服务器终端会显示错误信息：
```
OpenRouter API error: ...
```

## 🔧 故障排查

### 问题 1: 仍然使用 Mock 数据

**可能原因**：
- `.env.local` 文件位置不对（应该在项目根目录）
- 环境变量名称错误（应该是 `OPENROUTER_API_KEY`）
- 没有重启开发服务器

**解决方法**：
1. 确认 `.env.local` 文件在项目根目录
2. 检查文件内容，确保格式正确
3. 重启开发服务器

### 问题 2: API 调用失败

**可能原因**：
- API Key 无效或已过期
- API Key 格式错误
- 网络连接问题
- OpenRouter 服务暂时不可用

**解决方法**：
1. 检查 API Key 是否正确复制（不要有多余的空格）
2. 在 OpenRouter 网站确认 API Key 状态
3. 检查网络连接
4. 查看服务器终端的具体错误信息

### 问题 3: 环境变量不生效

**解决方法**：
1. 确认文件名是 `.env.local`（注意前面的点）
2. 确认文件在项目根目录（与 `package.json` 同级）
3. 重启开发服务器
4. 清除 Next.js 缓存：删除 `.next` 文件夹后重新启动

## 💰 OpenRouter 费用说明

- OpenRouter 使用按需付费模式
- Claude 3.5 Sonnet 的价格可以在 [OpenRouter 官网](https://openrouter.ai/models) 查看
- 建议设置使用限额，避免意外费用

## 🔒 安全提示

1. **永远不要**将 `.env.local` 文件提交到 Git
2. **永远不要**在代码中硬编码 API Key
3. 如果 API Key 泄露，立即在 OpenRouter 网站撤销并重新生成
4. 生产环境建议使用更安全的环境变量管理方式（如 Vercel Environment Variables）

## 📚 相关资源

- [OpenRouter 文档](https://openrouter.ai/docs)
- [Next.js 环境变量文档](https://nextjs.org/docs/basic-features/environment-variables)
- [Claude 3.5 Sonnet 模型信息](https://openrouter.ai/models/anthropic/claude-3.5-sonnet)
