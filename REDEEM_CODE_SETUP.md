# 兑换码系统设置指南

## 📋 第一步：在 Supabase 中创建兑换码表

### 1.1 登录 Supabase Dashboard

1. 访问 [https://supabase.com](https://supabase.com)
2. 登录你的账户
3. 选择你的项目

### 1.2 创建 redeem_codes 表

1. 在左侧菜单中，点击 **"SQL Editor"**
2. 点击 **"New Query"** 按钮
3. 打开项目中的文件：`SUPABASE_REDEEM_CODES_TABLE.sql`
4. **复制整个 SQL 代码**，粘贴到 SQL Editor 中
5. 点击 **"Run"** 按钮（或按 `Cmd+Enter` / `Ctrl+Enter`）
6. 确认看到 "Success" 提示

### 1.3 验证表是否创建成功

在 SQL Editor 中运行：
```sql
SELECT * FROM redeem_codes LIMIT 1;
```

如果看到空结果（没有错误），说明表创建成功！

---

## 🔑 第二步：配置环境变量（可选，用于保护管理 API）

### 2.1 本地环境变量（.env.local）

在项目根目录的 `.env.local` 文件中添加：

```bash
# 兑换码管理 API Key（可选，用于保护管理功能）
REDEEM_CODE_API_KEY=your_secret_api_key_here
```

**注意**：如果不设置这个环境变量，管理 API 将不受保护（不推荐用于生产环境）。

### 2.2 Vercel 环境变量

1. 访问 [Vercel Dashboard](https://vercel.com)
2. 选择你的项目
3. 进入 **"Settings"** → **"Environment Variables"**
4. 添加：
   ```
   REDEEM_CODE_API_KEY = your_secret_api_key_here
   ```
5. 环境选择：勾选 Production, Preview, Development
6. 点击 **"Save"**
7. 重新部署项目

---

## 🎯 第三步：使用兑换码系统

### 3.1 生成兑换码

#### 方法一：通过管理后台（推荐）

1. 访问 `/admin/redeem-codes`
2. 在 "生成兑换码" 区域输入数量（1-100）
3. 点击 "生成" 按钮
4. 复制生成的兑换码

#### 方法二：通过 API

```bash
curl -X POST http://localhost:3000/api/redeem/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{"count": 10}'
```

### 3.2 用户使用兑换码

1. 用户在首页输入兑换码
2. 点击 "开启对话" 按钮
3. 系统自动验证兑换码：
   - 检查是否存在
   - 检查是否已使用
   - 检查是否过期（90天）
4. 验证成功后，用户可以继续使用应用

### 3.3 查看统计和管理

访问 `/admin/redeem-codes` 可以：
- 查看所有兑换码
- 查看使用统计
- 筛选（全部/已使用/未使用/已过期）
- 搜索兑换码
- 导出 CSV
- 批量生成新兑换码

---

## 📊 API 端点说明

### 1. 验证兑换码
- **端点**：`POST /api/redeem/verify`
- **请求体**：`{ "code": "XXXX-XXXX-XXXX" }`
- **响应**：`{ "valid": true/false, "error": "..." }`
- **权限**：公开（任何人都可以验证）

### 2. 生成兑换码
- **端点**：`POST /api/redeem/generate`
- **请求体**：`{ "count": 10 }`
- **响应**：`{ "success": true, "codes": [...], "count": 10 }`
- **权限**：需要 API Key（通过 `x-api-key` header）

### 3. 获取统计信息
- **端点**：`GET /api/redeem/stats`
- **响应**：`{ "success": true, "stats": {...} }`
- **权限**：需要 API Key

### 4. 获取兑换码列表
- **端点**：`GET /api/redeem/list?page=1&limit=50&filter=all`
- **响应**：`{ "success": true, "data": [...], "pagination": {...} }`
- **权限**：需要 API Key

---

## 🔒 安全建议

1. **设置 API Key**：在生产环境中，务必设置 `REDEEM_CODE_API_KEY` 环境变量
2. **限制访问**：管理后台页面 `/admin/redeem-codes` 应该添加额外的访问控制（如 IP 白名单、密码保护等）
3. **监控使用**：定期检查兑换码使用情况，发现异常及时处理

---

## ✅ 测试步骤

### 1. 测试生成兑换码

```bash
# 生成 5 个兑换码
curl -X POST http://localhost:3000/api/redeem/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{"count": 5}'
```

### 2. 测试验证兑换码

```bash
# 验证兑换码（使用上面生成的其中一个）
curl -X POST http://localhost:3000/api/redeem/verify \
  -H "Content-Type: application/json" \
  -d '{"code": "A3B7-C9D2-E4F8"}'
```

### 3. 测试前端流程

1. 访问首页
2. 输入一个有效的兑换码
3. 点击 "开启对话"
4. 应该成功跳转到 `/ask` 页面

---

## 🐛 常见问题

### 问题 1: "兑换码不存在"

**原因**：兑换码格式错误或数据库中不存在

**解决**：
- 检查兑换码格式是否为 `XXXX-XXXX-XXXX`
- 确认兑换码已正确生成并保存到数据库

### 问题 2: "兑换码已被使用"

**原因**：该兑换码已经被使用过

**解决**：生成新的兑换码

### 问题 3: "兑换码已过期"

**原因**：兑换码已超过 90 天有效期

**解决**：生成新的兑换码

### 问题 4: 管理 API 返回 "未授权访问"

**原因**：API Key 未设置或错误

**解决**：
- 检查环境变量 `REDEEM_CODE_API_KEY` 是否已设置
- 在管理后台页面输入正确的 API Key

---

## 📝 兑换码格式说明

- **格式**：`XXXX-XXXX-XXXX`（12 位字符，3 组，每组 4 位）
- **字符集**：大写字母 A-Z 和数字 2-9（排除易混淆的 0, O, 1, I）
- **示例**：`A3B7-C9D2-E4F8`
- **有效期**：90 天（从创建时间开始计算）
- **使用限制**：每个兑换码只能使用一次

---

**需要帮助？** 查看 Supabase Dashboard 的日志或联系支持
