# 🔧 修复策略已存在错误

## 问题说明

你遇到的错误：
```
ERROR: 42710: policy "Anyone can view redeem codes for verification" for table "redeem_codes" already exists
```

**原因：** 策略（policy）已经存在，可能是因为之前已经执行过部分 SQL。

---

## ✅ 解决方案

### 方法一：使用更新后的 SQL 脚本（推荐）

我已经更新了 `SUPABASE_REDEEM_CODES_TABLE.sql` 文件，添加了 `DROP POLICY IF EXISTS` 语句。

**操作步骤：**

1. **在 SQL Editor 中，删除当前的 SQL 代码**（或创建一个新标签页）

2. **重新复制更新后的 SQL 脚本**（从 `SUPABASE_REDEEM_CODES_TABLE.sql` 文件）

3. **粘贴并执行**

现在脚本会在创建策略之前先删除已存在的策略，不会报错了。

---

### 方法二：手动删除策略（快速修复）

如果你想快速修复，可以在 SQL Editor 中执行：

```sql
-- 删除已存在的策略
DROP POLICY IF EXISTS "Anyone can view redeem codes for verification" ON redeem_codes;

-- 重新创建策略
CREATE POLICY "Anyone can view redeem codes for verification"
  ON redeem_codes
  FOR SELECT
  USING (true);
```

然后点击 "Run" 执行。

---

### 方法三：直接验证表是否可用（如果策略已存在）

如果策略已经存在，说明表可能已经创建成功了。你可以：

1. **直接运行验证查询：**
   ```sql
   SELECT * FROM redeem_codes LIMIT 1;
   ```

2. **如果看到 "Success. No rows returned"**，说明表已经创建成功，可以继续下一步！

---

## 🎯 推荐操作

**最简单的方法：**

1. 在 SQL Editor 中，直接运行：
   ```sql
   SELECT * FROM redeem_codes LIMIT 1;
   ```

2. 如果看到 "Success. No rows returned"（没有错误），说明表已经创建成功！

3. 可以继续下一步：获取环境变量并测试系统。

---

## ✅ 验证表是否创建成功

运行以下查询来检查表的结构：

```sql
-- 检查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'redeem_codes';

-- 检查表的列
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'redeem_codes';

-- 检查策略是否存在
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'redeem_codes';
```

如果这些查询都返回结果，说明表已经创建成功了！

---

**告诉我验证结果，我继续指导下一步！** 🚀
