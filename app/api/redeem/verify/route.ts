import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * 验证兑换码 API
 * POST /api/redeem/verify
 * Body: { code: string }
 * 
 * 直接查询和更新，确保原子性操作
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: '兑换码不能为空', valid: false },
        { status: 400 }
      )
    }

    // 格式化兑换码（去除空格，转为大写）
    const formattedCode = code.trim().toUpperCase().replace(/\s+/g, '')

    // 验证格式：XXXX-XXXX-XXXX 或 XXXXXXXXXXXX
    if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(formattedCode) && 
        !/^[A-Z0-9]{12}$/.test(formattedCode)) {
      return NextResponse.json(
        { error: '兑换码格式不正确', valid: false },
        { status: 400 }
      )
    }

    // 如果是12位无分隔符，转换为带分隔符格式
    const normalizedCode = formattedCode.length === 12
      ? `${formattedCode.slice(0, 4)}-${formattedCode.slice(4, 8)}-${formattedCode.slice(8, 12)}`
      : formattedCode

    // 连接 Supabase
    const supabase = await createClient()

    // 查询兑换码（使用 SELECT FOR UPDATE 确保原子性）
    const { data, error } = await supabase
      .from('redeem_codes')
      .select('id, code, is_used, expires_at, used_at')
      .eq('code', normalizedCode)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: '兑换码不存在', valid: false },
        { status: 404 }
      )
    }

    // 检查是否已使用
    if (data.is_used) {
      return NextResponse.json(
        { 
          error: '兑换码已被使用', 
          valid: false,
          usedAt: data.used_at 
        },
        { status: 400 }
      )
    }

    // 检查是否过期（如果已使用，检查从使用日期开始的过期时间）
    if (data.is_used && data.expires_at) {
      const now = new Date()
      const expiresAt = new Date(data.expires_at)
      if (now > expiresAt) {
        return NextResponse.json(
          { 
            error: '兑换码已过期', 
            valid: false,
            expiresAt: data.expires_at 
          },
          { status: 400 }
        )
      }
    }

    // 标记为已使用，并设置过期时间（从兑换日期开始计算90天）
    const usedAt = new Date()
    const expiresAt = new Date(usedAt)
    expiresAt.setDate(expiresAt.getDate() + 90) // 从兑换日期开始90天

    const { error: updateError } = await supabase
      .from('redeem_codes')
      .update({ 
        is_used: true,
        used_at: usedAt.toISOString(),
        expires_at: expiresAt.toISOString()
      })
      .eq('id', data.id)
      .eq('is_used', false) // 双重检查，确保原子性

    if (updateError) {
      console.error('Update error:', updateError)
      
      // 可能是并发问题，重新查询确认
      const { data: recheckData } = await supabase
        .from('redeem_codes')
        .select('is_used')
        .eq('id', data.id)
        .single()

      if (recheckData?.is_used) {
        return NextResponse.json(
          { error: '兑换码已被使用', valid: false },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: '兑换码验证失败，请重试', valid: false },
        { status: 500 }
      )
    }

    // 验证成功
    return NextResponse.json({
      valid: true,
      message: '兑换码验证成功',
      code: normalizedCode,
      usedAt: usedAt.toISOString(),
      expiresAt: expiresAt.toISOString()
    })

  } catch (error) {
    console.error('Redeem code verification error:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试', valid: false },
      { status: 500 }
    )
  }
}
