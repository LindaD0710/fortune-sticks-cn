// Fortune stick data - 100 traditional Guandi Oracle Sticks (关帝灵签)
// Data source: https://github.com/dreamer2q/fortune_telling

import rawSignsData from './signs.json'

export interface FortuneStick {
  number: number
  level: string // 签的等级：大吉、上吉、中吉、中平、下下等
  levelEN?: string // 英文等级（转换为概念）
  content: string // 签诗内容（中文）
  contentEN?: string // 签诗英文诗意转译
  detail1: string // 详细解释1（文言文风格）- 海外版建议舍弃
  detail2: string // 详细解释2（白话文解释）
  detail2EN?: string // 核心展示的英文翻译
  text: string // 英文翻译（用于显示，优先使用 detail2EN）
  category: 'good' | 'neutral' | 'warning'
  story?: string // 典故名称（故事的核心原型，中文）
  storyEN?: string // 典故英雄原型（英文）
  storyBrief?: string // 故事情节（简述故事内容，中文）
  storyBriefEN?: string // 故事情节（英文）
  items?: string // 分项判辞（针对求财、婚姻、健康等具体维度的定论，中文）
  itemsEN?: string // 分项判辞（英文，使用现代词汇）
}

// Raw data structure from GitHub project (now includes number field and additional fields)
interface RawFortuneData {
  number: number // 签号（第几签）
  Level: string // 中文等级
  Level_EN?: string // 英文等级（转换为概念：Divine Favor / High Resonance 等）
  Content: string // 签诗内容（中文）
  Content_EN?: string // 签诗英文诗意转译
  Detail1: string // 详细解释1（文言文风格）- 海外版建议舍弃
  Detail2: string // 详细解释2（白话文解释）
  Detail2_EN?: string // 核心展示的英文翻译
  Story?: string // 典故名称（中文）
  Story_EN?: string // 典故英雄原型（英文，如 "The Pathfinder"）
  Story_Brief?: string // 故事情节（中文）
  Story_Brief_EN?: string // 故事情节（英文）
  Items?: string // 分项判辞（中文）
  Items_EN?: string // 分项判辞（英文，使用现代词汇：Career, Wealth, Relationships）
}

// Map Chinese level to category
function mapLevelToCategory(level: string): 'good' | 'neutral' | 'warning' {
  if (level.includes('大吉') || level.includes('上吉') || level.includes('上上')) {
    return 'good'
  }
  if (level.includes('下下') || level.includes('下')) {
    return 'warning'
  }
  return 'neutral'
}

// Convert raw data to our format
function convertRawData(rawData: RawFortuneData): FortuneStick {
  const level = rawData.Level
  const category = mapLevelToCategory(level)
  
  // For English text, we'll use Detail2 (白话文解释) as it's more accessible
  // In production, you might want to use a translation API or pre-translated data
  const englishText = rawData.Detail2 || rawData.Content
  
  return {
    number: rawData.number, // Use the number from the data
    level,
    levelEN: rawData.Level_EN || '', // 英文等级
    content: rawData.Content,
    contentEN: rawData.Content_EN || '', // 签诗英文诗意转译
    detail1: rawData.Detail1,
    detail2: rawData.Detail2,
    detail2EN: rawData.Detail2_EN || '', // 核心展示的英文翻译
    text: rawData.Detail2_EN || rawData.Detail2 || rawData.Content, // 优先使用英文翻译
    category,
    story: rawData.Story || '', // 典故名称（中文）
    storyEN: rawData.Story_EN || '', // 典故英雄原型（英文）
    storyBrief: rawData.Story_Brief || '', // 故事情节（中文）
    storyBriefEN: rawData.Story_Brief_EN || '', // 故事情节（英文）
    items: rawData.Items || '', // 分项判辞（中文）
    itemsEN: rawData.Items_EN || '', // 分项判辞（英文）
  }
}

// Convert all raw data to our format
const allFortuneSticks: FortuneStick[] = (rawSignsData as RawFortuneData[]).map((data) =>
  convertRawData(data)
)

// Get fortune stick by number
export function getFortuneStick(number: number): FortuneStick {
  if (number < 1 || number > allFortuneSticks.length) {
    // Fallback for invalid numbers
    const categories = ['good', 'neutral', 'warning'] as const
    const category = categories[(number - 1) % 3]
    
    return {
      number,
      level: '中平',
      content: `签诗 ${number}`,
      detail1: '此签待加载',
      detail2: '签诗数据加载中...',
      text: 'The fortune is being revealed. Wisdom unfolds in its own time.',
      category,
    }
  }
  
  return allFortuneSticks[number - 1]
}

// Export all fortune sticks
export const fortuneSticks: FortuneStick[] = allFortuneSticks
