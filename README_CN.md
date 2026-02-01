# 签筒抽签解读 - 中文版

这是面向中国用户的签筒抽签解读应用的中文版本。

## 📋 项目说明

- **英文版**：`../签筒抽签解读` (端口 3000)
- **中文版**：`签筒抽签解读-中文版` (端口 3001)

两个版本可以同时运行，互不干扰。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 到 `.env.local`（如果存在），或创建新的 `.env.local` 文件：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenRouter API
OPENROUTER_API_KEY=your_openrouter_api_key

# PayPal (可选，用于支付)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
PAYPAL_MODE=sandbox

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问：**http://localhost:3001**

## 📝 开发计划

### 待完成的中文化工作：

1. **页面内容中文化**
   - [ ] 首页 (`app/page.tsx`)
   - [ ] 提问页面 (`app/ask/page.tsx`)
   - [ ] 摇签页面 (`app/toss/page.tsx`)
   - [ ] 结果页面 (`app/result/page.tsx`)
   - [ ] 解读页面 (`app/interpret/page.tsx`)
   - [ ] 历史记录页面 (`app/history/page.tsx`)

2. **组件中文化**
   - [ ] AuthButton 组件
   - [ ] 支付相关组件

3. **AI 提示词中文化**
   - [ ] 更新 `lib/ai-prompt.ts` 为中文提示词
   - [ ] 确保 AI 输出中文内容

4. **支付系统本地化**
   - [ ] 集成适合中国用户的支付方式（微信支付、支付宝等）
   - [ ] 价格显示为人民币

5. **其他优化**
   - [ ] 字体优化（中文字体）
   - [ ] UI/UX 适配中文用户习惯
   - [ ] SEO 优化（中文关键词）

## 🔧 技术栈

- **框架**：Next.js 14
- **样式**：Tailwind CSS
- **动画**：Framer Motion
- **认证**：Supabase Auth
- **数据库**：Supabase PostgreSQL
- **AI**：OpenRouter API
- **支付**：PayPal（待替换为国内支付方式）

## 📁 项目结构

```
.
├── app/                    # Next.js App Router 页面
│   ├── api/               # API 路由
│   ├── ask/               # 提问页面
│   ├── toss/              # 摇签页面
│   ├── result/            # 结果页面（中文版）
│   ├── result-en/         # 结果页面（英文版，保留）
│   ├── interpret/         # 深度解读页面
│   └── history/           # 历史记录页面
├── components/            # React 组件
├── lib/                   # 工具函数和配置
│   ├── fortune-sticks.ts  # 签筒数据
│   ├── ai-prompt.ts       # AI 提示词
│   └── supabase/          # Supabase 客户端
└── public/                # 静态资源
```

## 🎯 下一步

1. 开始中文化各个页面
2. 优化 AI 提示词，确保输出高质量的中文内容
3. 集成国内支付方式
4. 测试完整流程

---

**注意**：这是中文版项目，与英文版独立运行。两个版本共享相同的后端 API 和数据库，但前端界面和用户体验针对不同市场优化。
