import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * 获取兑换码统计信息 API
 * GET /api/redeem/stats
 * 
 * 注意：这个 API 应该受到保护，只有管理员可以访问
 */
export async function GET(request: NextRequest) {
  try {
    // 简单的 API Key 验证
    const apiKey = request.headers.get('x-api-key')
    const expectedApiKey = process.env.REDEEM_CODE_API_KEY

    if (expectedApiKey && apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // 获取总数
    const { count: totalCount } = await supabase
      .from('redeem_codes')
      .select('*', { count: 'exact', head: true })

    // 获取已使用数量
    const { count: usedCount } = await supabase
      .from('redeem_codes')
      .select('*', { count: 'exact', head: true })
      .eq('is_used', true)

    // 获取未使用数量
    const { count: unusedCount } = await supabase
      .from('redeem_codes')
      .select('*', { count: 'exact', head: true })
      .eq('is_used', false)

    // 获取已过期但未使用的数量
    const now = new Date().toISOString()
    const { count: expiredUnusedCount } = await supabase
      .from('redeem_codes')
      .select('*', { count: 'exact', head: true })
      .eq('is_used', false)
      .lt('expires_at', now)

    // 获取最近7天的使用统计
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { count: recentUsedCount } = await supabase
      .from('redeem_codes')
      .select('*', { count: 'exact', head: true })
      .eq('is_used', true)
      .gte('used_at', sevenDaysAgo.toISOString())

    return NextResponse.json({
      success: true,
      stats: {
        total: totalCount || 0,
        used: usedCount || 0,
        unused: unusedCount || 0,
        expiredUnused: expiredUnusedCount || 0,
        recentUsed: recentUsedCount || 0, // 最近7天
        usageRate: totalCount ? ((usedCount || 0) / totalCount * 100).toFixed(2) : '0.00'
      }
    })

  } catch (error) {
    console.error('Redeem code stats error:', error)
    return NextResponse.json(
      { error: '获取统计信息失败', success: false },
      { status: 500 }
    )
  }
}
