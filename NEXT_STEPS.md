# 🚀 下一步操作指南（兑换码系统设置）

## 📋 第一步：在 Supabase 中创建数据库表

### 1.1 登录 Supabase
1. 访问 [https://supabase.com](https://supabase.com)
2. 登录你的账户（如果没有账户，先注册）
3. 选择你的项目（如果没有项目，先创建一个新项目）

### 1.2 打开 SQL Editor
1. 在左侧菜单中，点击 **"SQL Editor"**
2. 点击 **"New Query"** 按钮（或按 `Cmd+N` / `Ctrl+N`）

### 1.3 执行 SQL 脚本
1. 打开项目中的文件：`SUPABASE_REDEEM_CODES_TABLE.sql`
2. **复制整个 SQL 代码**（从 `CREATE TABLE` 到最后的注释）
3. 粘贴到 Supabase SQL Editor 中
4. 点击 **"Run"** 按钮（或按 `Cmd+Enter` / `Ctrl+Enter`）
5. 确认看到 "Success" 提示

### 1.4 验证表是否创建成功
在 SQL Editor 中运行：
```sql
SELECT * FROM redeem_codes LIMIT 1;
```
如果看到空结果（没有错误），说明表创建成功！✅

---

## 🔑 第二步：检查环境变量配置

### 2.1 检查 Supabase 配置
确保你的 `.env.local` 文件中有以下配置：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**如何获取这些值：**
1. 在 Supabase Dashboard 中，点击左侧菜单 **"Settings"** → **"API"**
2. 复制 **"Project URL"** → 粘贴到 `NEXT_PUBLIC_SUPABASE_URL`
3. 复制 **"anon public"** key → 粘贴到 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2.2 配置管理 API Key（可选，但推荐）
在 `.env.local` 文件中添加：

```bash
# 兑换码管理 API Key（用于保护管理后台）
REDEEM_CODE_API_KEY=your_secret_key_here
```

**生成一个安全的密钥：**
- 可以使用任何随机字符串，例如：`my_secret_redeem_code_key_2024`
- 或者使用在线工具生成：https://randomkeygen.com/

---

## 🎯 第三步：启动开发服务器并测试

### 3.1 启动开发服务器
```bash
npm run dev
```

### 3.2 访问管理后台
1. 打开浏览器，访问：`http://localhost:3000/admin/redeem-codes`
2. 如果设置了 `REDEEM_CODE_API_KEY`，在页面顶部输入 API Key
3. 在 "生成兑换码" 区域：
   - 输入数量（例如：`5`）
   - 点击 "生成" 按钮
4. 复制生成的兑换码（例如：`A3B7-C9D2-E4F8`）

### 3.3 测试用户流程
1. 访问首页：`http://localhost:3000`
2. 在兑换码输入框中输入刚才生成的兑换码
3. 点击 "开启对话" 按钮
4. 应该看到 "验证中..." 然后成功跳转到 `/ask` 页面 ✅

### 3.4 验证兑换码已被使用
1. 再次访问首页
2. 输入同一个兑换码
3. 应该看到错误提示："兑换码已被使用" ✅

---

## 📊 第四步：查看统计信息

1. 访问管理后台：`http://localhost:3000/admin/redeem-codes`
2. 查看顶部的统计卡片：
   - 总数：应该显示你生成的兑换码数量
   - 已使用：应该显示已使用的数量
   - 未使用：应该显示未使用的数量

---

## 🚢 第五步：部署到生产环境（Vercel）

### 5.1 配置 Vercel 环境变量
1. 访问 [Vercel Dashboard](https://vercel.com)
2. 选择你的项目
3. 进入 **"Settings"** → **"Environment Variables"**
4. 添加以下环境变量：

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
REDEEM_CODE_API_KEY = your_secret_key_here
```

5. 环境选择：勾选 **Production**, **Preview**, **Development**
6. 点击 **"Save"**

### 5.2 重新部署
1. 在 Vercel Dashboard 中，点击 **"Deployments"**
2. 找到最新的部署，点击 **"..."** → **"Redeploy"**
3. 等待部署完成

### 5.3 测试生产环境
1. 访问你的生产网站
2. 重复第三步的测试流程
3. 确认一切正常工作 ✅

---

## ✅ 检查清单

完成以下所有步骤后，你的兑换码系统就完全设置好了：

- [ ] 在 Supabase 中创建了 `redeem_codes` 表
- [ ] 配置了 `NEXT_PUBLIC_SUPABASE_URL` 环境变量
- [ ] 配置了 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 环境变量
- [ ] （可选）配置了 `REDEEM_CODE_API_KEY` 环境变量
- [ ] 成功生成了第一批兑换码
- [ ] 测试了用户验证流程（成功）
- [ ] 测试了重复使用验证（失败提示）
- [ ] 查看了管理后台统计信息
- [ ] （如果部署）配置了 Vercel 环境变量
- [ ] （如果部署）测试了生产环境

---

## 🐛 常见问题排查

### 问题 1: "兑换码不存在"
**可能原因：**
- 数据库表未创建
- 环境变量未配置
- 兑换码格式错误

**解决方法：**
1. 检查 Supabase 中是否有 `redeem_codes` 表
2. 检查 `.env.local` 文件中的 Supabase 配置
3. 确认兑换码格式为 `XXXX-XXXX-XXXX`

### 问题 2: 管理后台无法生成兑换码
**可能原因：**
- API Key 未配置或错误
- Supabase 连接失败

**解决方法：**
1. 检查 `REDEEM_CODE_API_KEY` 是否已设置
2. 在管理后台页面输入正确的 API Key
3. 检查浏览器控制台是否有错误信息

### 问题 3: 客户端查询失败
**可能原因：**
- `NEXT_PUBLIC_SUPABASE_URL` 或 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 未配置
- RLS 策略未正确设置

**解决方法：**
1. 检查 `.env.local` 文件
2. 确认 Supabase SQL 脚本中的 RLS 策略已执行
3. 重启开发服务器：`npm run dev`

---

## 📞 需要帮助？

如果遇到问题：
1. 检查浏览器控制台的错误信息
2. 检查 Supabase Dashboard 的日志
3. 查看 `REDEEM_CODE_SETUP.md` 文件获取详细说明

---

**完成以上步骤后，你的兑换码系统就可以正式使用了！** 🎉
