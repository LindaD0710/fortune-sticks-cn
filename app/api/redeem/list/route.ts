import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * 获取兑换码列表 API
 * GET /api/redeem/list?page=1&limit=50&filter=all|used|unused|expired
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50'), 1), 100)
    const filter = searchParams.get('filter') || 'all' // all, used, unused, expired
    const offset = (page - 1) * limit

    const supabase = await createClient()

    // 构建查询
    let query = supabase
      .from('redeem_codes')
      .select('id, code, is_used, used_at, expires_at, created_at', { count: 'exact' })

    // 应用过滤器
    const now = new Date().toISOString()
    if (filter === 'used') {
      query = query.eq('is_used', true)
    } else if (filter === 'unused') {
      query = query.eq('is_used', false).gte('expires_at', now)
    } else if (filter === 'expired') {
      query = query.eq('is_used', false).lt('expires_at', now)
    }

    // 排序：最新的在前
    query = query.order('created_at', { ascending: false })

    // 分页
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      filter
    })

  } catch (error) {
    console.error('Redeem code list error:', error)
    return NextResponse.json(
      { error: '获取兑换码列表失败', success: false },
      { status: 500 }
    )
  }
}
