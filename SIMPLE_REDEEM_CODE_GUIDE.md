# 🎯 简化版兑换码系统使用指南

## ✨ 优势

- ✅ **完全在 Supabase 中操作**，无需复杂代码
- ✅ **一键生成兑换码**，使用 SQL 函数
- ✅ **自动验证和标记使用**，使用 SQL 函数
- ✅ **直接在 Dashboard 查看和管理**，直观方便
- ✅ **代码更简单**，前端只需要调用验证函数

---

## 📋 第一步：执行 SQL 脚本

1. **登录 Supabase Dashboard**
   - 访问 https://supabase.com
   - 进入你的项目

2. **打开 SQL Editor**
   - 点击左侧菜单 "SQL Editor"
   - 点击 "New Query"

3. **执行完整脚本**
   - 打开项目文件：`SIMPLE_REDEEM_CODE_SETUP.sql`
   - 复制全部 SQL 代码
   - 粘贴到 SQL Editor
   - 点击 "Run" 执行

4. **验证是否成功**
   - 应该看到多个 "Success" 提示
   - 没有错误信息

---

## 🎲 第二步：生成兑换码（在 Supabase 中）

### 方法一：使用 SQL 函数（推荐）

在 SQL Editor 中执行：

```sql
-- 生成 10 个兑换码，有效期 90 天
SELECT * FROM generate_redeem_codes(10, 90);
```

**结果示例：**
```
code              | expires_at
------------------|----------------------------
A3B7-C9D2-E4F8   | 2024-05-01 12:00:00+00
B2C8-D1E9-F3A7   | 2024-05-01 12:00:00+00
...
```

### 方法二：直接在 Table Editor 中手动添加

1. **打开 Table Editor**
   - 点击左侧菜单 "Table Editor"
   - 选择 `redeem_codes` 表

2. **添加新行**
   - 点击 "Insert" → "Insert row"
   - 填写：
     - `code`: 输入兑换码（例如：`A3B7-C9D2-E4F8`）
     - `expires_at`: 选择过期时间（例如：90 天后）
     - `is_used`: 保持 `false`
   - 点击 "Save"

---

## 🔍 第三步：查看和管理兑换码

### 在 Table Editor 中查看

1. **打开 Table Editor**
   - 点击左侧菜单 "Table Editor"
   - 选择 `redeem_codes` 表

2. **查看所有兑换码**
   - 可以看到所有兑换码的详细信息
   - 包括：兑换码、是否已使用、使用时间、过期时间等

3. **筛选和排序**
   - 点击列标题可以排序
   - 使用筛选功能查看特定状态的兑换码

### 使用 SQL 查询统计信息

在 SQL Editor 中执行：

```sql
-- 查看统计信息
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_used = true) as used,
  COUNT(*) FILTER (WHERE is_used = false) as unused,
  COUNT(*) FILTER (WHERE is_used = false AND expires_at < NOW()) as expired_unused
FROM redeem_codes;
```

### 查看最近使用的兑换码

```sql
-- 查看最近使用的兑换码
SELECT code, used_at, expires_at
FROM redeem_codes
WHERE is_used = true
ORDER BY used_at DESC
LIMIT 10;
```

### 查看未使用的兑换码

```sql
-- 查看未使用的兑换码
SELECT code, expires_at
FROM redeem_codes
WHERE is_used = false AND expires_at > NOW()
ORDER BY created_at DESC;
```

---

## ✅ 第四步：验证兑换码（在 Supabase 中测试）

在 SQL Editor 中执行：

```sql
-- 验证兑换码
SELECT verify_redeem_code('A3B7-C9D2-E4F8');
```

**结果示例：**
- **成功**：
  ```json
  {
    "valid": true,
    "message": "兑换码验证成功",
    "code": "A3B7-C9D2-E4F8",
    "expires_at": "2024-05-01T12:00:00Z"
  }
  ```

- **失败**（已使用）：
  ```json
  {
    "valid": false,
    "error": "兑换码已被使用",
    "used_at": "2024-02-01T10:30:00Z"
  }
  ```

- **失败**（过期）：
  ```json
  {
    "valid": false,
    "error": "兑换码已过期",
    "expires_at": "2024-01-01T12:00:00Z"
  }
  ```

---

## 🔧 第五步：更新前端代码（简化）

前端只需要调用验证函数，不需要复杂的管理后台。

### 更新验证 API

我已经创建了简化版的验证 API，它会调用 Supabase 函数。

---

## 📊 常用 SQL 查询

### 生成兑换码
```sql
-- 生成 10 个兑换码
SELECT * FROM generate_redeem_codes(10, 90);
```

### 查看所有兑换码
```sql
SELECT * FROM redeem_codes ORDER BY created_at DESC;
```

### 查看统计
```sql
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_used = true) as used,
  COUNT(*) FILTER (WHERE is_used = false) as unused
FROM redeem_codes;
```

### 查看最近使用的
```sql
SELECT code, used_at 
FROM redeem_codes 
WHERE is_used = true 
ORDER BY used_at DESC 
LIMIT 10;
```

### 查看未使用的
```sql
SELECT code, expires_at 
FROM redeem_codes 
WHERE is_used = false AND expires_at > NOW() 
ORDER BY created_at DESC;
```

### 删除过期未使用的兑换码
```sql
DELETE FROM redeem_codes 
WHERE is_used = false AND expires_at < NOW();
```

---

## 🎯 工作流程

### 日常使用流程

1. **生成兑换码**（在 Supabase SQL Editor 中）
   ```sql
   SELECT * FROM generate_redeem_codes(10, 90);
   ```

2. **复制兑换码**（从查询结果中复制）

3. **分发给用户**（通过微信、邮件等）

4. **用户使用**（前端自动验证并标记为已使用）

5. **查看使用情况**（在 Supabase Table Editor 或 SQL Editor 中）

---

## ✅ 优势总结

| 功能 | 之前（复杂） | 现在（简化） |
|------|------------|------------|
| 生成兑换码 | 需要管理后台 + API | ✅ SQL 函数一键生成 |
| 查看兑换码 | 需要管理后台页面 | ✅ Table Editor 直接查看 |
| 统计信息 | 需要管理后台页面 | ✅ SQL 查询即可 |
| 代码复杂度 | 高（多个 API + 管理后台） | ✅ 低（只需验证 API） |
| 维护成本 | 高 | ✅ 低 |

---

## 🚀 下一步

1. ✅ 执行 `SIMPLE_REDEEM_CODE_SETUP.sql` 脚本
2. ✅ 测试生成兑换码：`SELECT * FROM generate_redeem_codes(5, 90);`
3. ✅ 测试验证兑换码：`SELECT verify_redeem_code('生成的兑换码');`
4. ✅ 更新前端代码（我会帮你简化）

**完成以上步骤后，你的兑换码系统就完全简化了！** 🎉
