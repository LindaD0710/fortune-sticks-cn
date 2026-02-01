# ⚡ 快速解决方案：使用现有 Supabase 项目

## 🎯 最简单的方法（推荐）

**你不需要创建新项目！** 只需要在现有的 Supabase 项目中添加兑换码表即可。

### 操作步骤：

1. **登录 Supabase Dashboard**
   - 访问 https://supabase.com
   - 选择一个你正在使用的项目

2. **在该项目中创建兑换码表**
   - 点击左侧菜单 "SQL Editor"
   - 点击 "New Query"
   - 打开项目文件：`SUPABASE_REDEEM_CODES_TABLE.sql`
   - 复制全部 SQL 代码并执行

3. **完成！**
   - 兑换码表是独立的，不会影响你现有的数据
   - 使用该项目的环境变量即可

**就这么简单！** 无需创建新项目，无需升级计划。

---

## ✅ 验证是否成功

在 SQL Editor 中运行：
```sql
SELECT * FROM redeem_codes LIMIT 1;
```

如果看到空结果（没有错误），说明成功！

---

## 🔑 使用该项目的环境变量

确保你的 `.env.local` 文件中使用的是该项目的 URL 和 Key：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co  # 该项目的 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...  # 该项目的 anon key
```

**如何获取：**
- Supabase Dashboard → Settings → API
- 复制 "Project URL" 和 "anon public" key

---

**完成以上步骤后，你的兑换码系统就可以正常工作了！** 🎉
