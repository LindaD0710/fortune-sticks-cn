# Interpret 页面测试指南

## 📋 测试前准备

### 1. 启动开发服务器

```bash
npm run dev
```

服务器会在 `http://localhost:3000` 启动

### 2. 检查环境变量（可选）

如果你想测试真实的 AI API，需要设置环境变量：

```bash
# 在项目根目录创建 .env.local 文件
OPENROUTER_API_KEY=your_api_key_here
```

**注意**：如果没有设置 API Key，系统会自动使用 Mock 数据，这样也可以测试页面功能。

---

## 🧪 完整测试流程

### 步骤 1: 从首页开始

1. 打开浏览器访问 `http://localhost:3000`
2. 点击 "Start Your Journey" 或类似按钮进入 `/ask` 页面

### 步骤 2: 输入问题 (Ask 页面)

1. 在输入框中输入你的问题，例如：
   - "Should I change my job?"
   - "Does he/she actually like me?"
   - "What's holding me back from being happy?"
2. 或者点击建议的问题快速填充
3. 点击 "Continue" 或提交按钮
4. **检查点**：问题应该被保存到 `sessionStorage` 中

### 步骤 3: 摇签 (Toss 页面)

1. 页面会自动跳转到 `/toss`
2. 摇动设备或点击摇签按钮
3. 等待动画完成，系统会随机抽取一根签
4. **检查点**：签号应该被保存到 `sessionStorage` 中（key: `drawnStick`）

### 步骤 4: 查看结果 (Result 页面)

1. 页面会自动跳转到 `/result-en`
2. 查看签文信息：
   - Lot #（签号）
   - Level（等级，如 "Supreme Harmony"）
   - 中文签诗
   - 英文签诗
   - 英雄故事
   - 各维度指导
3. **检查点**：所有信息应该正确显示

### 步骤 5: 解锁深度解读 (Interpret 页面) ⭐

1. 滚动到页面底部
2. 找到 "Unlock the Deep Interpretation" 卡片
3. 点击 "Unlock for $1.99" 按钮
4. **页面应该跳转到 `/interpret`**

---

## 🔍 Interpret 页面详细测试

### 测试场景 1: 正常流程（Mock 数据）

**前提**：没有设置 `OPENROUTER_API_KEY`

1. **页面加载检查**：
   - ✅ 显示 "Deep Interpretation" 标题
   - ✅ 显示返回按钮（Back）
   - ✅ 显示用户的问题（手写风格字体）
   - ✅ 显示签文信息（Lot #, Level, 英文签诗）

2. **加载状态检查**：
   - ✅ 显示加载动画（旋转的 Loader2 图标）
   - ✅ 显示 "The Oracle is weaving your personalized revelation..." 文字
   - ✅ 加载时间应该很短（因为是 Mock 数据）

3. **内容展示检查**：
   - ✅ **The Resonance** 部分：
     - 应该包含 "The Silk has felt your query..." 开头
     - 文字清晰可读
     - 金色边框和半透明背景
   
   - ✅ **The Weaving** 部分：
     - 有金色丝绸纹理背景
     - 文字逐字显示（Typewriter 效果）
     - 有闪烁的光标
     - 动画流畅
   
   - ✅ **The Sacred Ritual** 部分：
     - 斜体字体
     - 金色光晕效果
     - 内容简洁（30-50 字）

### 测试场景 2: 真实 API（需要 API Key）

**前提**：设置了 `OPENROUTER_API_KEY`

1. 重复测试场景 1 的所有步骤
2. **额外检查**：
   - 加载时间可能更长（等待 AI 生成）
   - 内容应该更个性化，与用户问题相关
   - 三幕式内容应该完整且有意义

### 测试场景 3: 错误处理

1. **无签文数据**：
   - 直接访问 `/interpret`（没有经过抽签流程）
   - ✅ 应该自动跳转回 `/toss` 页面

2. **API 错误**（如果使用真实 API）：
   - 可以临时修改 API 路由，让它返回错误
   - ✅ 应该显示错误信息
   - ✅ 显示 "Try Again" 按钮
   - ✅ 点击按钮可以重试

### 测试场景 4: 响应式设计

1. **移动端测试**：
   - 打开浏览器开发者工具
   - 切换到移动设备视图（iPhone, iPad 等）
   - ✅ 所有文字应该可读
   - ✅ 卡片宽度应该自适应
   - ✅ 按钮大小适合触摸操作

2. **桌面端测试**：
   - ✅ 内容居中显示
   - ✅ 最大宽度限制（不会太宽）
   - ✅ 动画流畅

---

## 🐛 常见问题排查

### 问题 1: 页面空白或报错

**检查**：
- 打开浏览器控制台（F12），查看是否有错误
- 检查 `sessionStorage` 中是否有 `drawnStick` 和 `userQuestion`
- 确认所有依赖已安装：`npm install`

### 问题 2: API 调用失败

**检查**：
- 查看浏览器 Network 标签，检查 `/api/interpret` 请求
- 查看服务器终端日志，看是否有错误信息
- 确认 API Key 格式正确（如果有设置）

### 问题 3: Typewriter 动画不工作

**检查**：
- 确认 `interpretation.weaving` 有内容
- 检查浏览器控制台是否有 JavaScript 错误
- 尝试刷新页面

### 问题 4: 样式显示异常

**检查**：
- 确认 Tailwind CSS 已正确配置
- 检查 `globals.css` 是否包含必要的样式
- 清除浏览器缓存并刷新

---

## 📝 测试检查清单

### 功能测试
- [ ] 页面可以正常加载
- [ ] 用户问题正确显示
- [ ] 签文信息正确显示
- [ ] 加载状态正常显示
- [ ] 三幕式内容正确显示
- [ ] Typewriter 动画正常工作
- [ ] 返回按钮可以返回 result-en 页面
- [ ] 错误处理正常工作

### 视觉测试
- [ ] 深紫色背景正确显示
- [ ] 金色边框和半透明效果正确
- [ ] 丝绸纹理背景（The Weaving）正确显示
- [ ] 所有文字清晰可读
- [ ] 动画流畅自然
- [ ] 响应式设计在不同设备上正常

### 数据测试
- [ ] Mock 数据正确显示（无 API Key 时）
- [ ] 真实 API 数据正确显示（有 API Key 时）
- [ ] JSON 格式正确解析
- [ ] 三幕式结构完整（resonance, weaving, ritual）

---

## 🚀 快速测试命令

如果你想快速测试 API 路由，可以使用 curl：

```bash
curl -X POST http://localhost:3000/api/interpret \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Should I change my job?",
    "fortuneStick": {
      "number": 1,
      "levelEN": "Supreme Harmony",
      "contentEN": "Test poetry",
      "storyEN": "The Pathfinder",
      "storyBriefEN": "Test story",
      "detail2EN": "Test detail"
    }
  }'
```

---

## 💡 提示

1. **开发模式**：建议先用 Mock 数据测试，确保页面功能正常
2. **API 测试**：确认页面功能正常后，再测试真实 API
3. **性能测试**：注意 Typewriter 动画的速度，如果内容很长可能需要调整
4. **用户体验**：确保加载时间不会太长，考虑添加进度提示

---

## 📞 需要帮助？

如果遇到问题：
1. 检查浏览器控制台的错误信息
2. 检查服务器终端的日志
3. 确认所有文件都已正确创建
4. 尝试清除缓存并重新启动开发服务器
