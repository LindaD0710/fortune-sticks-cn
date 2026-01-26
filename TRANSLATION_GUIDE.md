# 签文英文翻译指南

## 数据结构说明

每个签文现在包含以下字段：

### 中文字段（保留）
- `Level`: 签的等级（大吉、上吉、中吉、中平、下下等）
- `Content`: 签诗内容（中文古诗）
- `Detail1`: 详细解释1（文言文风格）- **海外版建议舍弃**
- `Detail2`: 详细解释2（白话文解释）
- `Story`: 典故名称（中文）
- `Story_Brief`: 故事情节（中文）
- `Items`: 分项判辞（中文）

### 英文字段（需要补全）
- `Level_EN`: 英文等级（已自动转换）
  - 大吉 → "Divine Favor"
  - 上吉 → "High Resonance"
  - 上上 → "Supreme Harmony"
  - 中吉 → "Balanced Fortune"
  - 中平 → "Neutral Path"
  - 下下 → "Challenging Phase"
  - 下 → "Warning Sign"

- `Content_EN`: 签诗英文诗意转译
  - **策略**: 弱化原件，强化意译
  - **要求**: 保持诗意，传达核心含义，不要直译
  - **示例**: "Ascending alone toward the clouds, First among a thousand in the jade hall..."

- `Detail2_EN`: 核心展示的英文翻译
  - **策略**: 这是海外版的核心展示内容
  - **要求**: 3-4句话，清晰易懂，传达签文的核心指引
  - **用途**: 在 Result 页面主要展示

- `Story_EN`: 典故英雄原型（英文）
  - **策略**: 转化为"英雄原型"，不要说具体人名
  - **要求**: 使用英文概念，如 "The Founder", "The Student", "The Pathfinder"
  - **示例**: 
    - "汉高祖入关" → "The Founder"
    - "张子房惜体" → "The Student"
    - "张骞通西域" → "The Pathfinder"

- `Story_Brief_EN`: 故事情节（英文）
  - **策略**: 简化故事情节，突出核心寓意
  - **要求**: 1-2句话，易于理解，传达故事的精神内核

- `Items_EN`: 分项判辞（英文，已自动转换）
  - **策略**: 使用现代词汇
  - **映射**:
    - 事业/功名 → Career/Achievement
    - 求财/财富 → Wealth
    - 婚姻/感情 → Relationships/Love
    - 疾病/健康 → Health
    - 诉讼 → Legal
    - 远行 → Travel

## 翻译原则

### 1. Level (吉凶) 转换
- ❌ 不要直译 "Big Lucky"
- ✅ 使用概念转换: "Divine Favor", "High Resonance"
- ✅ 将"凶"转化为"挑战"或"提醒": "Challenging Phase"

### 2. Content (签诗) 转译
- ❌ 不要字面翻译
- ✅ 保持诗意，传达神谕氛围
- ✅ 可以保留中文原件（增加异域美感）

### 3. Story (典故) 转换
- ❌ 不要说 "Zhang Qian"（张骞）
- ✅ 使用英雄原型: "The Pathfinder"（探路者）
- ✅ 突出故事的精神内核，而非历史细节

### 4. Items (分项) 优化
- ✅ 使用现代词汇: Career, Wealth, Relationships
- ✅ 保持简洁明了
- ✅ 已自动转换，但可以手动优化

## 当前进度

- ✅ 前5个签文：已完成示例翻译
- ⏳ 第6-100签：待补全

## 补全建议

1. **批量翻译**: 可以使用 AI 翻译 API（如 Google Translate, DeepL）先做基础翻译
2. **人工润色**: 对翻译结果进行诗意化处理和文化适应
3. **英雄原型**: 为每个典故创建对应的英文英雄原型名称
4. **分项优化**: 检查自动转换的 Items_EN，确保准确性

## 示例参考

查看 `lib/signs.json` 中前5个签文的完整翻译作为模板。
