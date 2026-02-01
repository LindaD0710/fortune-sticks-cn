# 第二步：设置 Creem 账户并获取 API 信息

## 📋 详细步骤

### 步骤 1：创建/登录 Creem 账户

1. **访问 Creem 网站**
   - 打开：**https://www.creem.io/**
   - 点击右上角 **"Get started"** 或 **"Log in"**

2. **注册/登录账户**
   - 如果还没有账户，点击 **"Get started"** 注册
   - 如果已有账户，点击 **"Log in"** 登录

---

### 步骤 2：获取 API 密钥

1. **进入开发者设置**
   - 登录后，在账户设置中查找：
     - **"API"** 或 **"Developer"** 或 **"Settings"** → **"API Keys"**
     - 通常在左侧菜单或右上角设置中

2. **获取 API Key**
   - 找到 **"API Key"** 或 **"Secret Key"**
   - 格式通常是：`sk_live_...`（生产环境）或 `sk_test_...`（测试环境）
   - **复制这个密钥**（稍后需要）

3. **获取 Webhook Secret**（可选，但推荐）
   - 在同一个页面找到 **"Webhook Secret"**
   - **复制这个密钥**

---

### 步骤 3：创建产品（Product）

根据 Creem 的文档，你需要先创建一个产品，然后使用 `product_id` 来创建支付会话。

1. **进入产品管理**
   - 在 Creem Dashboard 中查找 **"Products"** 或 **"Store"**
   - 点击 **"Create Product"** 或 **"Add Product"**

2. **创建产品信息**
   - **产品名称**：例如 "AI Deep Interpretation"
   - **产品类型**：选择 **"One-time payment"**（单次支付）
   - **价格**：`$1.99`
   - **货币**：`USD`
   - **描述**：例如 "Unlock personalized AI-powered oracle interpretation"

3. **保存产品并获取 Product ID**
   - 创建后，Creem 会生成一个 **Product ID**
   - 格式通常是：`prod_...`
   - **复制这个 Product ID**（稍后需要）

---

### 步骤 4：配置 Webhook（可选，但推荐）

1. **进入 Webhook 设置**
   - 在 Creem Dashboard 中查找 **"Webhooks"** 或 **"Integrations"**
   - 点击 **"Add Webhook"** 或 **"Create Webhook"**

2. **设置 Webhook URL**
   - **Webhook URL**：`https://your-vercel-url.vercel.app/api/payment/webhook`
   - 替换 `your-vercel-url` 为你的 Vercel 部署 URL
   - **事件类型**：选择 `checkout.completed` 和 `payment.received`

3. **保存并获取 Webhook Secret**
   - 保存后，Creem 会生成一个 **Webhook Secret**
   - **复制这个 Secret**（稍后需要）

---

## ✅ 完成标志

当你获取到以下信息时，说明第二步完成了：

- ✅ **API Key**（格式：`sk_live_...` 或 `sk_test_...`）
- ✅ **Product ID**（格式：`prod_...`）
- ✅ **Webhook Secret**（可选，但推荐）

---

## 📝 记录你的信息

请记录以下信息（不要分享给我，只记录在本地）：

```
CREEM_API_KEY=sk_test_...
CREEM_PRODUCT_ID=prod_...
CREEM_WEBHOOK_SECRET=whsec_...
```

---

## 🚀 完成第二步后

**完成第二步后，告诉我：**
- ✅ "我已经获取了 API Key 和 Product ID"
- 或者告诉我你在哪一步遇到了问题

然后我们继续第三步：配置环境变量和更新代码！

---

## ❓ 如果遇到问题

### 问题 1：找不到 API Key 设置
- **解决**：在 Creem Dashboard 中查找 **"Settings"** → **"API"** 或 **"Developer"**

### 问题 2：不知道如何创建产品
- **解决**：告诉我你看到的界面，我会继续指导

### 问题 3：找不到 Webhook 设置
- **解决**：Webhook 是可选的，可以先跳过，稍后再配置

---

## 💡 提示

- **测试环境**：建议先使用测试环境的 API Key（`sk_test_...`）
- **产品 ID**：每个产品都有唯一的 ID，确保复制正确
- **Webhook**：如果暂时找不到，可以先跳过，稍后再配置
