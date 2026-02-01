# Result 页面字体排版分析

## Tailwind CSS 字号对照表
- `text-xs` = 0.75rem (12px)
- `text-sm` = 0.875rem (14px)
- `text-base` = 1rem (16px)
- `text-lg` = 1.125rem (18px)
- `text-xl` = 1.25rem (20px)
- `text-2xl` = 1.5rem (24px)
- `text-3xl` = 1.875rem (30px)
- `text-4xl` = 2.25rem (36px)
- `text-5xl` = 3rem (48px)
- `text-6xl` = 3.75rem (60px)

## 行高对照表
- `leading-relaxed` = 1.625
- `leading-[2.2]` = 2.2
- `leading-[2.5]` = 2.5
- `lineHeight: '1.8'` = 1.8

## 字间距对照表
- `tracking-wider` = 0.05em
- `tracking-widest` = 0.1em
- `tracking-[0.1em]` = 0.1em
- `tracking-[0.15em]` = 0.15em
- `letterSpacing: '0.3em'` = 0.3em

---

## 页面各部分字体排版详情

### 1. Seal（印章）组件 - 等级显示
- **字体**: `var(--font-serif-sc), serif` (中文字体)
- **字号**: `28px` (固定)
- **字重**: `bold` (700)
- **字间距**: 默认
- **行间距**: 默认
- **颜色**: `#FFFFFF` (白色)
- **位置**: 左侧固定

### 2. "第 X 签" 主标题
- **字体**: `"Playfair Display", "Cormorant Garamond", "EB Garamond", Georgia, serif`
- **字号**: 
  - 移动端: `text-2xl` (24px / 1.5rem)
  - sm: `text-3xl` (30px / 1.875rem)
  - md: `text-4xl` (36px / 2.25rem)
  - lg: `text-5xl` (48px / 3rem)
  - xl: `text-6xl` (60px / 3.75rem)
- **字重**: `font-bold` (700)
- **字间距**: 默认
- **行间距**: 默认（由浏览器自动计算）
- **颜色**: `#FFD700` (金色)
- **对齐**: 居中

### 3. "您的求问" 部分
- **字体**: `"Brush Script MT", "Lucida Handwriting", "Kalam", cursive, serif` (手写字体)
- **字号**: 
  - 移动端: `text-lg` (18px / 1.125rem)
  - sm: `text-xl` (20px / 1.25rem)
  - md: `text-2xl` (24px / 1.5rem)
- **字重**: 默认（手写字体通常为中等）
- **字间距**: 默认
- **行间距**: `leading-relaxed` (1.625)
- **颜色**: `text-white/95` (95% 不透明度白色)
- **样式**: `italic` (斜体)
- **对齐**: 居中

### 4. "签诗" 标题
- **字体**: 默认系统字体
- **字号**: 
  - 移动端: `text-xs` (12px / 0.75rem)
  - sm: `text-sm` (14px / 0.875rem)
  - md: `text-base` (16px / 1rem)
- **字重**: `font-semibold` (600)
- **字间距**: `tracking-wider` (0.05em)
- **行间距**: 默认
- **颜色**: `text-amber-300` (琥珀色)
- **样式**: `uppercase` (大写，但中文不受影响)
- **对齐**: 居中

### 5. 签诗内容（Content）
- **字体**: `"STXingkai", "Xingkai SC", "行楷", "KaiTi", "楷体", serif` (行楷字体)
- **字号**: 
  - 移动端: `text-lg` (18px / 1.125rem)
  - sm: `text-xl` (20px / 1.25rem)
  - md: `text-2xl` (24px / 1.5rem)
- **字重**: `font-light` (300)
- **字间距**: 
  - 移动端: `tracking-[0.1em]` (0.1em)
  - sm+: `tracking-[0.15em]` (0.15em)
- **行间距**: 
  - 移动端: `leading-[2.2]` (2.2)
  - sm+: `leading-[2.5]` (2.5)
- **颜色**: `#FFFFFF` (白色)
- **对齐**: 居中
- **阴影**: `0 2px 4px rgba(0, 0, 0, 0.3), 0 0 8px rgba(255, 215, 0, 0.15)`

### 6. "典故" 标题
- **字体**: 默认系统字体
- **字号**: 
  - 移动端: `text-xs` (12px / 0.75rem)
  - sm: `text-sm` (14px / 0.875rem)
  - md: `text-base` (16px / 1rem)
- **字重**: `font-semibold` (600)
- **字间距**: `tracking-wider` (0.05em)
- **行间距**: 默认
- **颜色**: `text-amber-300` (琥珀色)
- **样式**: `uppercase` (大写，但中文不受影响)
- **对齐**: 居中

### 7. 典故名称（Story）
- **字体**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` (系统无衬线字体)
- **字号**: 
  - 移动端: `text-lg` (18px / 1.125rem)
  - sm: `text-xl` (20px / 1.25rem)
- **字重**: `font-medium` (500)
- **字间距**: 默认
- **行间距**: 默认
- **颜色**: `#FFD700` (金色)
- **对齐**: 居中

### 8. 典故内容（Story_Brief）
- **字体**: 默认系统字体
- **字号**: 
  - 移动端: `text-sm` (14px / 0.875rem)
  - sm: `text-base` (16px / 1rem)
  - md: `text-lg` (18px / 1.125rem)
- **字重**: 默认 (400)
- **字间距**: 默认
- **行间距**: `leading-relaxed` (1.625)
- **颜色**: `text-white/90` (90% 不透明度白色)
- **对齐**: 居中

### 9. "启示" 标题
- **字体**: 默认系统字体
- **字号**: 
  - 移动端: `text-xs` (12px / 0.75rem)
  - sm: `text-sm` (14px / 0.875rem)
  - md: `text-base` (16px / 1rem)
- **字重**: `font-semibold` (600)
- **字间距**: `tracking-wider` (0.05em)
- **行间距**: 默认
- **颜色**: `text-amber-300` (琥珀色)
- **样式**: `uppercase` (大写，但中文不受影响)
- **对齐**: 居中

### 10. 启示内容（Detail1 和 Detail2）
- **字体**: `Georgia, "Times New Roman", serif` (衬线字体)
- **字号**: 
  - 移动端: `text-base` (16px / 1rem)
  - sm: `text-lg` (18px / 1.125rem)
- **字重**: 默认 (400)
- **字间距**: 默认
- **行间距**: `leading-relaxed` (1.625)
- **颜色**: `text-white/90` (90% 不透明度白色)
- **对齐**: 左对齐

### 11. "AI解读" 主标题
- **字体**: `"Playfair Display", "Cormorant Garamond", "EB Garamond", Georgia, serif`
- **字号**: 
  - 移动端: `text-xl` (20px / 1.25rem)
  - sm: `text-2xl` (24px / 1.5rem)
  - md: `text-3xl` (30px / 1.875rem)
- **字重**: `font-bold` (700)
- **字间距**: 默认
- **行间距**: 默认
- **颜色**: `text-amber-300` (琥珀色)
- **对齐**: 居中

### 12. "核心洞察" 标题
- **字体**: 默认系统字体
- **字号**: 
  - 移动端: `text-xs` (12px / 0.75rem)
  - sm: `text-sm` (14px / 0.875rem)
  - md: `text-base` (16px / 1rem)
- **字重**: `font-semibold` (600)
- **字间距**: `tracking-wider` (0.05em)
- **行间距**: 默认
- **颜色**: `text-amber-300` (琥珀色)
- **样式**: `uppercase` (大写，但中文不受影响)
- **对齐**: 左对齐

### 13. 核心洞察内容
- **字体**: 默认系统字体
- **字号**: 
  - 移动端: `text-sm` (14px / 0.875rem)
  - sm: `text-base` (16px / 1rem)
  - md: `text-lg` (18px / 1.125rem)
- **字重**: 默认 (400)
- **字间距**: 默认
- **行间距**: `lineHeight: '1.8'` (1.8，通过内联样式)
- **颜色**: `text-white/90` (90% 不透明度白色)
- **对齐**: 左对齐

### 14. "行动指引" 标题
- **字体**: 默认系统字体
- **字号**: 
  - 移动端: `text-sm` (14px / 0.875rem)
  - sm: `text-base` (16px / 1rem)
- **字重**: `font-semibold` (600)
- **字间距**: `tracking-wider` (0.05em)
- **行间距**: 默认
- **颜色**: `text-amber-300` (琥珀色)
- **样式**: `uppercase` (大写，但中文不受影响)
- **对齐**: 左对齐

### 15. 行动指引内容
- **字体**: 默认系统字体
- **字号**: 
  - 移动端: `text-sm` (14px / 0.875rem)
  - sm: `text-base` (16px / 1rem)
  - md: `text-lg` (18px / 1.125rem)
- **字重**: 默认 (400)
- **字间距**: 默认
- **行间距**: 
  - 外层: `lineHeight: '1.8'` (1.8，通过内联样式)
  - 内层: `leading-relaxed` (1.625)
- **颜色**: `text-white/90` (90% 不透明度白色)
- **对齐**: 左对齐
- **样式**: `whitespace-pre-wrap` (保留换行和空格)

### 16. "保存解读" 按钮文字
- **字体**: `"Playfair Display", "Cormorant Garamond", Georgia, serif`
- **字号**: `text-lg` (18px / 1.125rem)
- **字重**: `font-semibold` (600)
- **字间距**: 默认
- **行间距**: 默认
- **颜色**: `#FFD700` (金色，通过内联样式)
- **对齐**: 居中

### 17. 按钮辅助文字（"下载为图片并保存到收藏"）
- **字体**: 默认系统字体
- **字号**: `text-xs` (12px / 0.75rem)
- **字重**: 默认 (400)
- **字间距**: 默认
- **行间距**: 默认
- **颜色**: `text-white/40` (40% 不透明度白色)
- **对齐**: 居中

---

## 特殊说明

1. **响应式设计**: 大部分文字使用 Tailwind 的响应式类名（如 `text-sm sm:text-base md:text-lg`），会根据屏幕尺寸自动调整。

2. **高亮文字**: 在 AI 解读内容中，用 `**双星号**` 标记的文字会显示为金色加粗，使用 `HighlightedText` 组件处理。

3. **行高单位**: 
   - Tailwind 的 `leading-*` 类使用相对单位（倍数）
   - 内联样式的 `lineHeight` 也使用相对单位（倍数）

4. **字间距单位**: 
   - Tailwind 的 `tracking-*` 类使用 `em` 单位（相对于字体大小）
   - 内联样式的 `letterSpacing` 也使用 `em` 单位
