# 🧹 清理历史兑换码数据指南

## 🤔 是否需要删除？

取决于你的需求：

### 情况 1：历史数据是测试数据
**建议：删除所有数据，重新开始**
- 使用方案三：`TRUNCATE TABLE redeem_codes;`

### 情况 2：历史数据包含已使用的真实兑换码
**建议：保留已使用的数据，只删除未使用的**
- 使用方案二：`DELETE FROM redeem_codes WHERE is_used = false;`
- 这样可以保留使用记录作为历史

### 情况 3：历史数据使用旧逻辑（expires_at 从生成日期计算）
**建议：删除未使用的旧数据**
- 使用方案五：删除 `expires_at IS NOT NULL` 且未使用的数据
- 保留新逻辑生成的数据（`expires_at IS NULL`）

---

## 📋 推荐操作步骤

### 第一步：查看当前数据情况

在 Supabase SQL Editor 中执行：

```sql
-- 查看数据统计
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_used = true) as used,
  COUNT(*) FILTER (WHERE is_used = false) as unused,
  COUNT(*) FILTER (WHERE expires_at IS NOT NULL AND is_used = false) as unused_with_expiry,
  COUNT(*) FILTER (WHERE expires_at IS NULL AND is_used = false) as unused_without_expiry
FROM redeem_codes;
```

**了解数据情况后，再决定删除策略。**

---

### 第二步：选择合适的删除方案

#### 方案 A：全新开始（推荐用于测试环境）

```sql
-- 清空整个表
TRUNCATE TABLE redeem_codes;
```

**优点：**
- ✅ 干净整洁
- ✅ 所有数据使用新逻辑

**缺点：**
- ❌ 会删除所有历史记录（包括已使用的）

---

#### 方案 B：保留已使用的，删除未使用的（推荐用于生产环境）

```sql
-- 只删除未使用的兑换码
DELETE FROM redeem_codes WHERE is_used = false;
```

**优点：**
- ✅ 保留使用记录作为历史
- ✅ 清理未使用的数据

**缺点：**
- ⚠️ 会删除未使用的旧数据（包括使用旧逻辑的）

---

#### 方案 C：只删除使用旧逻辑的未使用数据

```sql
-- 删除使用旧逻辑的未使用兑换码（expires_at 不为 NULL）
DELETE FROM redeem_codes 
WHERE is_used = false 
  AND expires_at IS NOT NULL;
```

**优点：**
- ✅ 保留新逻辑生成的数据
- ✅ 只删除旧逻辑的数据

**缺点：**
- ⚠️ 如果旧数据已使用，仍会保留

---

## 🎯 我的建议

### 如果是测试环境：
**使用方案 A：清空所有数据**
```sql
TRUNCATE TABLE redeem_codes;
```

### 如果是生产环境：
**使用方案 B：保留已使用的，删除未使用的**
```sql
DELETE FROM redeem_codes WHERE is_used = false;
```

---

## ⚠️ 注意事项

1. **删除前备份**（如果需要）：
   ```sql
   -- 导出数据（在 Table Editor 中点击 Export）
   -- 或使用 SQL：
   SELECT * FROM redeem_codes;
   ```

2. **确认删除范围**：
   - 执行删除前，先用 `SELECT` 查看会被删除的数据
   - 例如：`SELECT * FROM redeem_codes WHERE is_used = false;`

3. **删除后验证**：
   ```sql
   -- 确认删除结果
   SELECT COUNT(*) FROM redeem_codes;
   ```

---

## 📝 完整操作示例

```sql
-- 1. 查看当前数据
SELECT COUNT(*) as total FROM redeem_codes;

-- 2. 查看会被删除的数据（预览）
SELECT * FROM redeem_codes WHERE is_used = false;

-- 3. 执行删除（选择其中一个方案）
DELETE FROM redeem_codes WHERE is_used = false;

-- 4. 验证删除结果
SELECT COUNT(*) as remaining FROM redeem_codes;
```

---

**根据你的需求选择合适的方案，告诉我你的选择，我可以帮你确认！** 🚀
