# 🧪 测试新的有效期逻辑

## ✅ 验证更新是否成功

### 1. 检查表结构

在 Supabase SQL Editor 中执行：

```sql
-- 检查 expires_at 列是否允许 NULL
SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_name = 'redeem_codes' AND column_name = 'expires_at';
```

**预期结果：**
- `is_nullable` 应该是 `YES`

### 2. 检查函数是否更新

```sql
-- 检查生成函数
SELECT routine_name, routine_definition
FROM information_schema.routines
WHERE routine_name = 'generate_redeem_codes';

-- 检查验证函数
SELECT routine_name, routine_definition
FROM information_schema.routines
WHERE routine_name = 'verify_redeem_code';
```

---

## 🧪 测试步骤

### 测试 1：生成新兑换码（expires_at 应为 NULL）

```sql
-- 生成 3 个新兑换码
SELECT * FROM generate_redeem_codes(3);
```

**预期结果：**
- 返回兑换码列表
- 在 Table Editor 中查看，`expires_at` 列应该为 `NULL`

### 测试 2：验证兑换码（应该设置 expires_at）

```sql
-- 使用上面生成的其中一个兑换码
SELECT verify_redeem_code('生成的兑换码', 90);
```

**预期结果：**
```json
{
  "valid": true,
  "message": "兑换码验证成功",
  "code": "XXXX-XXXX-XXXX",
  "used_at": "2024-02-01T...",
  "expires_at": "2024-05-01T..."  // 应该是 used_at + 90天
}
```

### 测试 3：在 Table Editor 中验证

1. 打开 Table Editor
2. 选择 `redeem_codes` 表
3. 查看刚才验证的兑换码：
   - `is_used` 应该是 `true`
   - `used_at` 应该有时间戳
   - `expires_at` 应该是 `used_at + 90天`

### 测试 4：前端测试

1. **生成新兑换码**（在 Supabase 中）：
   ```sql
   SELECT * FROM generate_redeem_codes(1);
   ```

2. **复制兑换码**

3. **在浏览器中测试**：
   - 访问：`http://localhost:3001`
   - 输入兑换码
   - 点击 "开启对话"
   - 应该成功跳转

4. **验证有效期**（在 Supabase 中）：
   ```sql
   SELECT code, is_used, used_at, expires_at,
          expires_at - used_at as validity_period
   FROM redeem_codes
   WHERE code = '你的兑换码';
   ```

   **预期结果：**
   - `validity_period` 应该是 `90 days`
   - `expires_at` 应该是 `used_at + 90天`

---

## ✅ 验证清单

完成以下检查：

- [ ] 表结构已更新（`expires_at` 允许 NULL）
- [ ] 生成函数已更新（生成时 `expires_at` 为 NULL）
- [ ] 验证函数已更新（验证时设置 `expires_at = used_at + 90天`）
- [ ] 新生成的兑换码 `expires_at` 为 NULL
- [ ] 验证后 `expires_at` 正确设置为 `used_at + 90天`
- [ ] 前端验证功能正常工作

---

## 🎯 预期行为

### 场景 1：立即兑换
- 生成日期：2024-02-01
- 兑换日期：2024-02-01
- 过期日期：2024-05-01（兑换日期 + 90天）✅

### 场景 2：30天后兑换
- 生成日期：2024-02-01
- 兑换日期：2024-03-01
- 过期日期：2024-05-30（兑换日期 + 90天）✅
- **之前的问题**：如果从生成日期计算，过期日期会是 2024-05-01（只剩60天）
- **现在的优势**：无论何时兑换，都有完整的90天有效期 ✅

---

**完成测试后告诉我结果！** 🚀
