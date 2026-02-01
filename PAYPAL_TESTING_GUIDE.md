# PayPal 支付测试指南

## 🧪 测试前准备

### 1. 确认 PayPal 环境变量已配置

#### 检查本地环境变量（.env.local）

在项目根目录的 `.env.local` 文件中，确保有以下变量：

```bash
# PayPal API
PAYPAL_CLIENT_ID=你的Client_ID
PAYPAL_CLIENT_SECRET=你的Secret
PAYPAL_MODE=sandbox  # 测试环境使用 sandbox
```

#### 如果没有配置

请先完成 PayPal 账户设置：
1. 查看 `PAYPAL_SETUP_STEP_BY_STEP.md` 获取详细步骤
2. 在 PayPal Developer Dashboard 创建应用
3. 获取 Client ID 和 Secret
4. 添加到 `.env.local` 文件

---

## 🚀 测试步骤

### 第一步：启动开发服务器

```bash
npm run dev
```

访问：http://localhost:3000

---

### 第二步：测试完整支付流程

#### 2.1 进入抽签流程

1. 访问首页：http://localhost:3000
2. 点击 "Ask a Question" 或直接进入 `/ask`
3. 输入一个问题（例如："What should I focus on this month?"）
4. 点击 "Toss the Sticks" 进入 `/toss`
5. 摇签后，进入 `/result-en` 页面

#### 2.2 登录 Google 账户

1. 在 `/result-en` 页面，找到 "Unlock the Deep Interpretation" 卡片
2. 点击 "Sign in with Google" 按钮
3. 完成 Google 登录

#### 2.3 测试支付

1. 登录后，点击 **"Unlock for $1.99"** 按钮
2. 应该会跳转到 PayPal 支付页面（Sandbox 环境）
3. 使用 PayPal 测试账户登录并完成支付

---

### 第三步：使用 PayPal 测试账户

#### 3.1 创建测试账户（如果还没有）

1. 访问 PayPal Developer Dashboard：https://developer.paypal.com/
2. 进入 **"Sandbox"** → **"Accounts"**
3. 点击 **"Create Account"**
4. 选择 **"Personal"**（个人账户）
5. 填写测试账户信息（邮箱、密码等）

#### 3.2 使用测试账户支付

1. 在 PayPal 支付页面，使用测试账户登录
2. 选择支付方式（测试账户余额或测试信用卡）
3. 完成支付
4. 应该会重定向回你的应用

---

### 第四步：验证支付结果

#### 4.1 检查是否跳转到解读页面

支付成功后，应该自动跳转到 `/interpret` 页面，显示深度解读内容。

#### 4.2 检查数据库记录

1. 访问 Supabase Dashboard：https://supabase.com/dashboard
2. 进入你的项目
3. 打开 **"Table Editor"** → **"payments"** 表
4. 查看是否有新的支付记录：
   - `status` 应该是 `completed`
   - `creem_payment_id` 应该包含 PayPal 订单 ID
   - `completed_at` 应该有时间戳

---

## 🐛 常见问题排查

### 问题 1：点击支付按钮没有反应

**可能原因：**
- 用户未登录
- JavaScript 错误

**解决方法：**
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签页，检查是否有错误
3. 确认用户已登录（检查右上角是否显示用户邮箱）

---

### 问题 2：提示 "PayPal API credentials not configured"

**可能原因：**
- 环境变量未配置
- 环境变量名称错误

**解决方法：**
1. 检查 `.env.local` 文件是否存在
2. 确认变量名正确：
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_MODE`
3. **重启开发服务器**（重要！）
   ```bash
   # 停止服务器（Ctrl+C），然后重新启动
   npm run dev
   ```

---

### 问题 3：PayPal 支付页面显示错误

**可能原因：**
- Client ID 或 Secret 错误
- PayPal 应用配置问题

**解决方法：**
1. 检查 PayPal Developer Dashboard 中的应用设置
2. 确认使用的是 Sandbox 环境的凭证
3. 检查 `.env.local` 中的值是否正确（没有多余空格）

---

### 问题 4：支付完成后没有跳转

**可能原因：**
- 回调 URL 配置错误
- 网络问题

**解决方法：**
1. 检查 `NEXT_PUBLIC_APP_URL` 环境变量是否正确
2. 本地测试时，应该是：`http://localhost:3000`
3. 检查浏览器控制台是否有错误

---

### 问题 5：数据库中没有支付记录

**可能原因：**
- Supabase 连接问题
- 表未创建

**解决方法：**
1. 确认 `payments` 表已创建（参考 `SUPABASE_PAYMENTS_TABLE.sql`）
2. 检查 Supabase 环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. 查看服务器日志（终端输出）是否有错误

---

## 📊 测试检查清单

完成以下检查，确保一切正常：

- [ ] PayPal 环境变量已配置（.env.local）
- [ ] 开发服务器已启动
- [ ] 用户已登录（Google 账户）
- [ ] 点击支付按钮后跳转到 PayPal
- [ ] 使用测试账户完成支付
- [ ] 支付成功后跳转到 `/interpret` 页面
- [ ] Supabase 中有支付记录（status = 'completed'）
- [ ] 解读页面正常显示内容

---

## 🎯 下一步

如果测试成功，你可以：

1. **切换到生产环境**
   - 在 PayPal Developer Dashboard 创建 Live 应用
   - 更新环境变量（`PAYPAL_MODE=live`）
   - 在 Vercel 中配置生产环境变量

2. **配置 PayPal Webhook**（可选）
   - 在 PayPal Dashboard 中添加 Webhook URL
   - 用于接收支付事件通知

3. **部署到 Vercel**
   - 确保 Vercel 环境变量已配置
   - 部署后再次测试

---

## 💡 提示

- **测试环境**：使用 Sandbox 环境，不会产生真实费用
- **测试账户**：PayPal 提供测试账户，可以模拟各种支付场景
- **日志查看**：开发时查看终端输出和浏览器控制台，有助于排查问题

---

## 📞 需要帮助？

如果遇到问题，告诉我：
- 具体的错误信息
- 在哪一步出现问题
- 浏览器控制台的错误（如果有）

我会帮你解决！
