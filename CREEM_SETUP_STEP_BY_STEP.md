# Creem 支付集成 - 一步一步指南

## 📋 第一步：在 Supabase 中创建支付表

### 1.1 登录 Supabase Dashboard

1. 访问 [https://supabase.com](https://supabase.com)
2. 登录你的账户
3. 选择你的项目（`yhfkwyoehnazuytwijbb`）

### 1.2 创建 payments 表

1. 在左侧菜单中，点击 **"SQL Editor"**
2. 点击 **"New Query"** 按钮
3. 打开项目中的文件：`SUPABASE_PAYMENTS_TABLE.sql`
4. **复制整个 SQL 代码**，粘贴到 SQL Editor 中
5. 点击 **"Run"** 按钮（或按 `Cmd+Enter` / `Ctrl+Enter`）
6. 确认看到 "Success" 提示

### 1.3 验证表是否创建成功

在 SQL Editor 中运行：
```sql
SELECT * FROM payments LIMIT 1;
```

如果看到空结果（没有错误），说明表创建成功！

---

## 📋 第二步：获取 Creem API 信息

### 2.1 访问 Creem 平台

1. **打开 Creem 网站**
   - 访问 Creem 的官方网站
   - 登录你的 Creem 账户

2. **找到 API 设置**
   - 在账户设置中查找：
     - "API"、"Developer"、"Integration"
     - 或 "Settings" → "API Keys"

### 2.2 获取 API 密钥

通常需要以下信息：
- **API Key**（公钥）
- **Secret Key**（私钥）
- **Webhook Secret**（用于验证回调，可选）

### 2.3 查找 API 文档

查找以下信息：
- **创建支付的 API URL**（例如：`https://api.creem.com/v1/payments/create`）
- **查询支付状态的 API URL**（例如：`https://api.creem.com/v1/payments/{id}`）
- **Webhook URL**（如果需要）
- **API 认证方式**（Bearer Token、API Key 等）

---

## 📋 第三步：配置环境变量

### 3.1 本地环境变量（.env.local）

在项目根目录的 `.env.local` 文件中添加：

```bash
# Creem Payment API
CREEM_API_KEY=your_creem_api_key_here
CREEM_SECRET_KEY=your_creem_secret_key_here
# CREEM_WEBHOOK_SECRET=your_webhook_secret_here  # 如果需要
```

### 3.2 Vercel 环境变量

1. 访问 [Vercel Dashboard](https://vercel.com)
2. 选择你的项目
3. 进入 **"Settings"** → **"Environment Variables"**
4. 添加以下变量：
   - `CREEM_API_KEY` = `your_creem_api_key_here`
   - `CREEM_SECRET_KEY` = `your_creem_secret_key_here`
5. 选择环境：**Production**、**Preview**、**Development**（全选）
6. 点击 **"Save"**

---

## 📋 第四步：更新 API 路由代码

### 4.1 根据 Creem API 文档调整代码

我已经创建了基础的 API 路由：
- `/app/api/payment/create/route.ts` - 创建支付
- `/app/api/payment/callback/route.ts` - 处理支付回调
- `/app/api/payment/status/route.ts` - 查询支付状态

**你需要做的：**

1. 查看 Creem API 文档
2. 找到创建支付的 API 端点
3. 告诉我 API 的具体格式，我会帮你更新代码

**或者，如果你有 Creem API 文档链接，直接发给我，我会帮你完成！**

---

## 📋 第五步：更新前端支付按钮

我会在下一步更新 `/app/result-en/page.tsx` 中的支付按钮，集成 Creem 支付流程。

---

## ❓ 如果你找不到 Creem 的信息

请告诉我：
1. **Creem 的网站地址是什么？**
2. **你是如何注册/使用 Creem 的？**
3. **Creem 是否有提供开发者文档？**

或者，如果你有 Creem 的 API 文档链接，直接发给我！

---

## ✅ 当前进度

- [x] 创建支付 API 路由框架
- [x] 创建 Supabase 数据库表 SQL
- [ ] 获取 Creem API 信息
- [ ] 配置环境变量
- [ ] 更新 API 代码（根据 Creem 文档）
- [ ] 更新前端支付按钮
- [ ] 测试支付流程

---

## 🚀 下一步

**请先完成第一步：在 Supabase 中创建 payments 表**

完成后告诉我，我们继续下一步！
