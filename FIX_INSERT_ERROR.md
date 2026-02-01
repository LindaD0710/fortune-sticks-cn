# 🔧 修复兑换码生成错误：RLS 策略问题

## ❌ 错误信息

```
生成失败:数据库插入失败: new row violates row-level security policy for table "redeem_codes"
```

## 🔍 问题原因

RLS (Row Level Security) 策略只允许查询（SELECT），但没有允许插入（INSERT）和更新（UPDATE）操作。

生成兑换码需要通过 API 插入数据到数据库，但当前的 RLS 策略阻止了这个操作。

---

## ✅ 解决方案

### 方法一：在 Supabase SQL Editor 中执行修复脚本（推荐）

1. **打开 Supabase SQL Editor**
   - 登录 Supabase Dashboard
   - 进入你的项目
   - 点击左侧菜单 "SQL Editor"
   - 点击 "New Query"

2. **执行修复 SQL**

   复制并执行以下 SQL 代码：

   ```sql
   -- 删除已存在的策略（如果存在）
   DROP POLICY IF EXISTS "Allow service role to insert redeem codes" ON redeem_codes;
   DROP POLICY IF EXISTS "Allow service role to update redeem codes" ON redeem_codes;

   -- 创建策略：允许服务端 API 插入兑换码（用于生成兑换码）
   CREATE POLICY "Allow service role to insert redeem codes"
     ON redeem_codes
     FOR INSERT
     WITH CHECK (true);

   -- 创建策略：允许服务端 API 更新兑换码（用于标记为已使用）
   CREATE POLICY "Allow service role to update redeem codes"
     ON redeem_codes
     FOR UPDATE
     USING (true)
     WITH CHECK (true);
   ```

3. **点击 "Run" 执行**

4. **验证是否成功**
   - 应该看到 "Success" 提示
   - 没有错误信息

---

### 方法二：使用项目中的修复文件

1. **打开项目文件**：`FIX_RLS_INSERT_POLICY.sql`
2. **复制 SQL 代码**
3. **在 Supabase SQL Editor 中执行**

---

## 🧪 测试修复

修复后，回到管理后台测试：

1. **访问管理后台**：`http://localhost:3001/admin/redeem-codes`

2. **生成兑换码**：
   - 输入数量（例如：`5`）
   - 点击 "生成" 按钮

3. **预期结果**：
   - ✅ 看到成功提示
   - ✅ 显示生成的兑换码列表
   - ✅ 统计卡片更新（总数增加）

---

## 📋 完整的 RLS 策略说明

修复后，`redeem_codes` 表将有以下策略：

1. **SELECT 策略**：允许所有人查询兑换码（用于验证）
2. **INSERT 策略**：允许服务端 API 插入兑换码（用于生成）
3. **UPDATE 策略**：允许服务端 API 更新兑换码（用于标记为已使用）

**安全性说明：**
- 客户端可以直接查询兑换码（用于验证）
- 但客户端不能直接插入或更新（必须通过服务端 API）
- 这确保了数据的安全性和一致性

---

## 🎯 下一步

修复完成后：

1. ✅ 测试生成兑换码功能
2. ✅ 测试用户验证流程
3. ✅ 查看统计信息

**如果还有问题，告诉我具体的错误信息！** 🚀
