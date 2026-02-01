# PayPal 支付集成 - 一步一步指南

## 📋 为什么选择 PayPal？

✅ **个人卖家友好**：最近开放了个人卖家账户  
✅ **设置简单**：比 Creem 更直观  
✅ **文档完善**：中文支持好，社区资源多  
✅ **快速集成**：API 清晰，集成时间短  

---

## 第一步：创建 PayPal 开发者账户

### 步骤 1：访问 PayPal 开发者平台

1. **打开 PayPal 开发者网站**
   - 访问：**https://developer.paypal.com/**
   - 点击右上角 **"Log In"** 或 **"Sign Up"**

2. **登录/注册**
   - 如果已有 PayPal 账户，直接登录
   - 如果没有，点击 **"Sign Up"** 注册（可以使用个人账户）

---

### 步骤 2：创建应用（App）

1. **进入 Dashboard**
   - 登录后，点击 **"Dashboard"** 或 **"My Apps & Credentials"**

2. **创建新应用**
   - 点击 **"Create App"** 或 **"New App"** 按钮
   - **应用名称**：例如 "Oriental Oracle"
   - **选择环境**：
     - **Sandbox**（测试环境）- 先选择这个
     - **Live**（生产环境）- 稍后再创建

3. **保存应用**
   - 点击 **"Create App"**
   - 应用创建成功后，你会看到应用详情

---

### 步骤 3：获取 API 凭证

1. **查看应用凭证**
   - 在应用详情页面，你会看到：
     - **Client ID**（客户端 ID）
     - **Secret**（密钥）
   - **复制这两个值**（稍后需要）

2. **测试环境 vs 生产环境**
   - **Sandbox（测试）**：用于开发和测试，不会产生真实费用
   - **Live（生产）**：用于真实交易，需要验证账户

---

### 步骤 4：创建测试账户（可选，用于测试）

1. **进入 Sandbox 账户**
   - 在 Dashboard 中，点击 **"Sandbox"** → **"Accounts"**
   - 点击 **"Create Account"**

2. **创建买家测试账户**
   - 选择 **"Personal"**（个人账户）
   - 填写测试账户信息（邮箱、密码等）
   - 创建后，可以用这个账户测试支付流程

---

## ✅ 完成标志

当你获取到以下信息时，说明第一步完成了：

- ✅ **Client ID**（格式：`AeA1QIZXiflr1_-...`）
- ✅ **Secret**（格式：`ECYY...`）
- ✅ **环境**：Sandbox（测试）或 Live（生产）

---

## 📝 记录你的信息

请记录以下信息（不要分享给我，只记录在本地）：

```
# PayPal Sandbox (测试环境)
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_secret_here
PAYPAL_MODE=sandbox

# PayPal Live (生产环境) - 稍后配置
# PAYPAL_CLIENT_ID=your_live_client_id
# PAYPAL_CLIENT_SECRET=your_live_secret
# PAYPAL_MODE=live
```

---

## 🚀 完成第一步后

**完成第一步后，告诉我：**
- ✅ "我已经获取了 PayPal Client ID 和 Secret"
- 或者告诉我你在哪一步遇到了问题

然后我们继续第二步：配置环境变量和更新代码！

---

## ❓ 如果遇到问题

### 问题 1：找不到创建应用的按钮
- **解决**：在 Dashboard 页面，查找 **"My Apps & Credentials"** 或 **"Apps"** 菜单

### 问题 2：不知道选择哪个环境
- **解决**：先选择 **Sandbox（测试环境）**，测试成功后再创建 Live 应用

### 问题 3：账户验证问题
- **解决**：测试环境不需要验证，生产环境需要验证 PayPal 账户

---

## 💡 提示

- **先测试**：建议先用 Sandbox 环境测试，确保一切正常后再切换到 Live
- **保存凭证**：Client ID 和 Secret 只显示一次，请妥善保存
- **个人账户**：PayPal 现在支持个人卖家账户，不需要企业账户
