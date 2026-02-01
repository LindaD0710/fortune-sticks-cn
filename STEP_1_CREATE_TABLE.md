# 第一步：在 Supabase 中创建 payments 表

## 📋 详细步骤（带截图说明）

### 步骤 1：登录 Supabase Dashboard

1. 打开浏览器，访问：**https://supabase.com**
2. 点击右上角 **"Sign In"** 登录
3. 登录后，你会看到项目列表
4. 找到并点击你的项目（项目 URL：`yhfkwyoehnazuytwijbb.supabase.co`）

---

### 步骤 2：打开 SQL Editor

1. 在左侧菜单栏，找到并点击 **"SQL Editor"**（图标是 `</>` 或 "SQL"）
2. 点击右上角的 **"New Query"** 按钮
3. 你会看到一个空白的 SQL 编辑器

---

### 步骤 3：复制并执行 SQL 代码

1. **打开项目文件**
   - 在项目根目录找到文件：`SUPABASE_PAYMENTS_TABLE.sql`
   - 或者直接使用下面的 SQL 代码

2. **复制整个 SQL 代码**
   ```sql
   -- 创建 payments 表
   CREATE TABLE IF NOT EXISTS payments (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     amount DECIMAL(10, 2) NOT NULL,
     currency VARCHAR(10) DEFAULT 'USD',
     status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, cancelled
     stick_number INTEGER,
     question TEXT,
     creem_payment_id VARCHAR(255), -- Creem 返回的支付 ID
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     completed_at TIMESTAMP WITH TIME ZONE,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- 创建索引以提高查询性能
   CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
   CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
   CREATE INDEX IF NOT EXISTS idx_payments_creem_payment_id ON payments(creem_payment_id);

   -- 启用 Row Level Security (RLS)
   ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

   -- 创建策略：用户只能查看自己的支付记录
   CREATE POLICY "Users can view their own payments"
     ON payments
     FOR SELECT
     USING (auth.uid() = user_id);

   -- 创建策略：用户只能创建自己的支付记录
   CREATE POLICY "Users can insert their own payments"
     ON payments
     FOR INSERT
     WITH CHECK (auth.uid() = user_id);

   -- 创建 updated_at 自动更新触发器
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER update_payments_updated_at
     BEFORE UPDATE ON payments
     FOR EACH ROW
     EXECUTE FUNCTION update_updated_at_column();
   ```

3. **粘贴到 SQL Editor**
   - 将复制的代码粘贴到 SQL Editor 中

4. **执行 SQL**
   - 点击右下角的 **"Run"** 按钮（或按 `Cmd+Enter` / `Ctrl+Enter`）
   - 等待执行完成

---

### 步骤 4：验证表是否创建成功

1. **在 SQL Editor 中运行验证查询**
   ```sql
   SELECT * FROM payments LIMIT 1;
   ```

2. **检查结果**
   - 如果看到空结果（没有错误），说明表创建成功！✅
   - 如果看到错误信息，告诉我错误内容，我会帮你解决

---

### 步骤 5：检查表结构（可选）

如果你想确认表的所有字段都正确创建，可以运行：

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'payments'
ORDER BY ordinal_position;
```

---

## ✅ 完成标志

当你看到以下情况时，说明第一步完成了：

- ✅ SQL 执行成功，没有错误信息
- ✅ `SELECT * FROM payments LIMIT 1;` 返回空结果（没有错误）
- ✅ 在 Supabase Dashboard 的左侧菜单 **"Table Editor"** 中可以看到 `payments` 表

---

## ❓ 如果遇到问题

### 问题 1：提示 "relation already exists"
- **原因**：表已经存在
- **解决**：这是正常的，说明表已经创建过了，可以跳过这一步

### 问题 2：提示权限错误
- **原因**：可能是 RLS 策略的问题
- **解决**：告诉我具体的错误信息，我会帮你调整

### 问题 3：其他错误
- **解决**：把完整的错误信息发给我，我会帮你解决

---

## 🚀 完成第一步后

**完成第一步后，告诉我：**
- ✅ "表创建成功了"
- 或者告诉我遇到的任何问题

然后我们继续第二步：获取 Creem API 信息！
