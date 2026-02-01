import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * 创建 PayPal 支付订单
 * 这个 API 会：
 * 1. 创建支付记录（存储在 Supabase）
 * 2. 调用 PayPal API 创建订单
 * 3. 返回支付批准链接给前端
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 获取请求数据
    const body = await request.json()
    const { amount = 1.99, currency = 'USD', stickNumber, question } = body

    // 2. 创建支付记录（存储在 Supabase）
    // 注意：已移除登录要求，user_id 使用匿名 ID 或 null
    const supabase = await createClient()
    const { data: paymentRecord, error: dbError } = await supabase
      .from('payments')
      .insert({
        user_id: null, // 不再需要用户登录
        amount,
        currency,
        status: 'pending',
        stick_number: stickNumber,
        question: question || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { 
          error: 'Database error. Please create the payments table in Supabase first.',
          details: dbError.message 
        },
        { status: 500 }
      )
    }

    // 4. 获取 PayPal API 凭证
    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
    const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox' // sandbox or live
    const PAYPAL_BASE_URL = PAYPAL_MODE === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com'

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { 
          error: 'PayPal API credentials not configured. Please add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to your environment variables.',
          // 开发模式：返回模拟支付 URL
          paymentUrl: `/payment/callback?payment_id=${paymentRecord.id}&status=success&mock=true`,
        },
        { status: 500 }
      )
    }

    // 5. 获取 PayPal Access Token
    const tokenResponse = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('PayPal token error:', errorData)
      return NextResponse.json(
        { error: 'Failed to authenticate with PayPal', details: errorData },
        { status: 500 }
      )
    }

    const { access_token } = await tokenResponse.json()

    // 6. 创建 PayPal 订单
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const orderResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
        'PayPal-Request-Id': paymentRecord.id, // 使用支付记录 ID 作为请求 ID
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: paymentRecord.id,
            description: `AI Deep Interpretation - Lot #${stickNumber}`,
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: 'Oriental Oracle',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${appUrl}/payment/callback?payment_id=${paymentRecord.id}`,
          cancel_url: `${appUrl}/result-en?payment=cancelled`,
        },
      }),
    })

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json()
      console.error('PayPal order creation error:', errorData)
      return NextResponse.json(
        { error: 'Failed to create PayPal order', details: errorData },
        { status: 500 }
      )
    }

    const orderData = await orderResponse.json()

    // 7. 更新支付记录，保存 PayPal 订单 ID
    await supabase
      .from('payments')
      .update({
        creem_payment_id: orderData.id, // 复用这个字段存储 PayPal 订单 ID
      })
      .eq('id', paymentRecord.id)

    // 8. 返回支付批准链接
    const approvalUrl = orderData.links?.find((link: any) => link.rel === 'approve')?.href

    if (!approvalUrl) {
      return NextResponse.json(
        { error: 'No approval URL found in PayPal response' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      paymentId: paymentRecord.id,
      orderId: orderData.id,
      paymentUrl: approvalUrl,
    })

  } catch (error: any) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment session', details: error.message },
      { status: 500 }
    )
  }
}
