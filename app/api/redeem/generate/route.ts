import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * 生成兑换码 API（批量生成）
 * POST /api/redeem/generate
 * Body: { count: number } (可选，默认 1)
 * 
 * 注意：这个 API 应该受到保护，只有管理员可以访问
 * 可以通过环境变量或 API Key 来保护
 */

// 生成单个兑换码
function generateRedeemCode(): string {
  // 字符集：大写字母和数字，排除易混淆的字符（0, O, 1, I）
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const segments: string[] = []
  
  for (let i = 0; i < 3; i++) {
    let segment = ''
    for (let j = 0; j < 4; j++) {
      segment += chars[Math.floor(Math.random() * chars.length)]
    }
    segments.push(segment)
  }
  
  return segments.join('-')
}

// 批量生成唯一兑换码
async function generateUniqueCodes(
  supabase: any,
  count: number,
  expiresInDays: number = 90
): Promise<string[]> {
  const codes: string[] = []
  const maxAttempts = count * 10 // 防止无限循环
  let attempts = 0

  while (codes.length < count && attempts < maxAttempts) {
    attempts++
    const code = generateRedeemCode()
    
    // 检查是否已存在
    const { data: existing } = await supabase
      .from('redeem_codes')
      .select('code')
      .eq('code', code)
      .single()

    if (!existing) {
      codes.push(code)
    }
  }

  if (codes.length < count) {
    throw new Error(`无法生成足够的唯一兑换码。已生成 ${codes.length}/${count} 个`)
  }

  // 计算过期时间（90天后）
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiresInDays)

  // 批量插入数据库
  const records = codes.map(code => ({
    code,
    expires_at: expiresAt.toISOString(),
    is_used: false
  }))

  const { error } = await supabase
    .from('redeem_codes')
    .insert(records)

  if (error) {
    throw new Error(`数据库插入失败: ${error.message}`)
  }

  return codes
}

export async function POST(request: NextRequest) {
  try {
    // 简单的 API Key 验证（可以通过环境变量配置）
    const apiKey = request.headers.get('x-api-key')
    const expectedApiKey = process.env.REDEEM_CODE_API_KEY

    if (expectedApiKey && apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const count = Math.min(Math.max(parseInt(body.count) || 1, 1), 100) // 限制在 1-100 之间

    // 连接 Supabase
    const supabase = await createClient()

    // 生成兑换码
    const codes = await generateUniqueCodes(supabase, count, 90)

    return NextResponse.json({
      success: true,
      count: codes.length,
      codes: codes,
      expiresInDays: 90,
      message: `成功生成 ${codes.length} 个兑换码`
    })

  } catch (error) {
    console.error('Redeem code generation error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '生成兑换码失败',
        success: false 
      },
      { status: 500 }
    )
  }
}
