# 📝 兑换码系统设置 - 分步指导（使用现有 Supabase 项目）

## ✅ 第一步：选择现有 Supabase 项目

1. **登录 Supabase Dashboard**
   - 访问 https://supabase.com
   - 登录你的账户

2. **选择一个现有的项目**
   - 在项目列表中，选择一个你正在使用的项目
   - 点击进入该项目

3. **确认项目信息**
   - 记下项目的 URL（稍后需要用到）
   - 例如：`https://xxxxx.supabase.co`

---

## 🗄️ 第二步：在现有项目中创建兑换码表

### 2.1 打开 SQL Editor

1. 在左侧菜单中，点击 **"SQL Editor"**（SQL 编辑器图标）
2. 点击右上角的 **"New Query"** 按钮（或按 `Cmd+N` / `Ctrl+N`）

### 2.2 执行 SQL 脚本

1. **打开项目文件**：`SUPABASE_REDEEM_CODES_TABLE.sql`
2. **复制整个 SQL 代码**（从 `-- 创建 redeem_codes 表` 开始，到最后的注释结束）
3. **粘贴到 SQL Editor** 中
4. **点击 "Run" 按钮**（或按 `Cmd+Enter` / `Ctrl+Enter`）

### 2.3 确认执行成功

你应该看到：
- ✅ 绿色提示："Success. No rows returned"
- ✅ 或者看到多个 "Success" 提示

如果看到错误：
- ❌ 检查错误信息
- ❌ 确认是否已经存在 `redeem_codes` 表（如果是，可以跳过这一步）

### 2.4 验证表是否创建成功

在 SQL Editor 中运行以下查询：

```sql
SELECT * FROM redeem_codes LIMIT 1;
```

**预期结果：**
- ✅ 看到空结果（没有错误） = 表创建成功！
- ❌ 看到错误 = 需要检查问题

---

## 🔑 第三步：获取项目环境变量

### 3.1 获取 Supabase 项目信息

1. 在 Supabase Dashboard 中，点击左侧菜单 **"Settings"**（齿轮图标）
2. 选择 **"API"**
3. 找到以下信息：

   **Project URL:**
   ```
   https://xxxxx.supabase.co
   ```
   复制这个 URL

   **anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   复制这个 key（以 `eyJ` 开头的长字符串）

### 3.2 更新环境变量

1. **打开项目根目录的 `.env.local` 文件**

2. **检查或更新以下变量：**

```bash
# Supabase 配置（使用现有项目的 URL 和 Key）
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 兑换码管理 API Key（可选，用于保护管理后台）
REDEEM_CODE_API_KEY=your_secret_key_here
```

**重要：**
- 将 `https://xxxxx.supabase.co` 替换为你刚才复制的 Project URL
- 将 `eyJ...` 替换为你刚才复制的 anon public key
- `REDEEM_CODE_API_KEY` 可以设置任何随机字符串（例如：`my_secret_key_2024`）

3. **保存文件**

---

## 🧪 第四步：测试系统

### 4.1 启动开发服务器

在终端中运行：

```bash
npm run dev
```

等待服务器启动（应该看到 "Ready on http://localhost:3001"）

### 4.2 生成第一批兑换码

1. **打开浏览器**，访问：`http://localhost:3001/admin/redeem-codes`

2. **如果设置了 `REDEEM_CODE_API_KEY`**：
   - 在页面顶部的 "API Key" 输入框中输入你设置的密钥
   - 例如：`my_secret_key_2024`

3. **生成兑换码**：
   - 在 "生成兑换码" 区域
   - 输入数量：`5`（或任何你想要的数字，1-100）
   - 点击 **"生成"** 按钮

4. **复制生成的兑换码**：
   - 应该会看到一个弹窗，显示生成的兑换码
   - 复制其中一个，例如：`A3B7-C9D2-E4F8`

### 4.3 测试用户验证流程

1. **访问首页**：`http://localhost:3001`

2. **输入兑换码**：
   - 在兑换码输入框中输入刚才生成的兑换码
   - 例如：`A3B7-C9D2-E4F8`

3. **点击 "开启对话" 按钮**

4. **预期结果**：
   - ✅ 看到 "验证中..." 提示
   - ✅ 然后成功跳转到 `/ask` 页面
   - ✅ 说明验证成功！

### 4.4 测试重复使用验证

1. **返回首页**：`http://localhost:3001`

2. **再次输入同一个兑换码**

3. **点击 "开启对话" 按钮**

4. **预期结果**：
   - ❌ 看到错误提示："兑换码已被使用"
   - ✅ 说明防重复使用功能正常！

### 4.5 查看统计信息

1. **访问管理后台**：`http://localhost:3001/admin/redeem-codes`

2. **查看统计卡片**：
   - 总数：应该显示你生成的兑换码数量
   - 已使用：应该显示 1（刚才使用的那个）
   - 未使用：应该显示剩余数量

---

## ✅ 完成检查清单

完成以下所有步骤后，你的兑换码系统就完全设置好了：

- [ ] 在现有 Supabase 项目中创建了 `redeem_codes` 表
- [ ] 验证了表创建成功（`SELECT * FROM redeem_codes LIMIT 1;` 无错误）
- [ ] 更新了 `.env.local` 文件中的 Supabase 配置
- [ ] （可选）设置了 `REDEEM_CODE_API_KEY`
- [ ] 成功生成了第一批兑换码
- [ ] 测试了用户验证流程（成功跳转到 `/ask`）
- [ ] 测试了重复使用验证（显示"已被使用"错误）
- [ ] 查看了管理后台统计信息

---

## 🐛 常见问题排查

### 问题 1: SQL 执行失败，提示表已存在

**解决方法：**
- 如果表已经存在，可以跳过创建表的步骤
- 或者先删除旧表：`DROP TABLE IF EXISTS redeem_codes;`
- 然后重新执行 SQL 脚本

### 问题 2: 管理后台无法生成兑换码

**可能原因：**
- API Key 未设置或错误
- Supabase 连接失败

**解决方法：**
1. 检查 `.env.local` 文件中的 `REDEEM_CODE_API_KEY` 是否已设置
2. 在管理后台页面输入正确的 API Key
3. 检查浏览器控制台（F12）是否有错误信息
4. 确认 Supabase 环境变量配置正确

### 问题 3: 用户验证失败，提示"兑换码不存在"

**可能原因：**
- 环境变量未正确配置
- Supabase 连接失败
- 兑换码格式错误

**解决方法：**
1. 检查 `.env.local` 文件中的 Supabase 配置
2. 确认使用的是正确的项目 URL 和 Key
3. 确认兑换码格式为 `XXXX-XXXX-XXXX`
4. 重启开发服务器：`npm run dev`

### 问题 4: 客户端查询失败

**可能原因：**
- RLS 策略未正确设置
- Supabase 环境变量未配置

**解决方法：**
1. 确认 SQL 脚本中的 RLS 策略已执行：
   ```sql
   CREATE POLICY "Anyone can view redeem codes for verification"
     ON redeem_codes
     FOR SELECT
     USING (true);
   ```
2. 检查 `.env.local` 文件
3. 重启开发服务器

---

## 🎉 完成！

如果所有测试都通过，恭喜你！兑换码系统已经成功设置并可以正常使用了！

**下一步：**
- 生成更多兑换码用于实际销售
- 部署到生产环境（Vercel）
- 开始使用！

---

**需要帮助？** 如果遇到任何问题，请告诉我具体的错误信息，我会帮你解决！
