import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * 处理 PayPal 支付回调
 * PayPal 支付成功后会重定向到这个页面
 * 这个 API 会：
 * 1. 验证支付状态（通过 PayPal API）
 * 2. 捕获订单（完成支付）
 * 3. 更新支付记录状态
 * 4. 重定向到解读页面
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const paymentId = searchParams.get('payment_id')
    const token = searchParams.get('token') // PayPal 返回的 token
    const payerId = searchParams.get('PayerID') // PayPal 返回的 PayerID
    const mock = searchParams.get('mock') === 'true' // 开发模式标志

    if (!paymentId) {
      return NextResponse.redirect(new URL('/?error=missing_payment_id', request.url))
    }

    const supabase = await createClient()

    // 如果是开发模式的模拟支付，直接更新状态
    if (mock) {
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', paymentId)

      if (updateError) {
        console.error('Update payment error:', updateError)
      }

      return NextResponse.redirect(new URL('/interpret', request.url))
    }

    // 生产模式：验证并捕获 PayPal 订单
    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
    const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox'
    const PAYPAL_BASE_URL = PAYPAL_MODE === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com'

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return NextResponse.redirect(new URL('/?error=paypal_not_configured', request.url))
    }

    // 1. 获取支付记录
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single()

    if (paymentError || !payment) {
      return NextResponse.redirect(new URL('/?error=payment_not_found', request.url))
    }

    // 2. 如果已经有 PayPal 订单 ID，使用它；否则使用 token
    const orderId = payment.creem_payment_id || token

    if (!orderId) {
      return NextResponse.redirect(new URL('/?error=missing_order_id', request.url))
    }

    // 3. 获取 PayPal Access Token
    const tokenResponse = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    })

    if (!tokenResponse.ok) {
      return NextResponse.redirect(new URL('/?error=paypal_auth_failed', request.url))
    }

    const { access_token } = await tokenResponse.json()

    // 4. 捕获订单（完成支付）
    const captureResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
    })

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json()
      console.error('PayPal capture error:', errorData)
      return NextResponse.redirect(new URL('/?error=payment_capture_failed', request.url))
    }

    const captureData = await captureResponse.json()

    // 5. 检查支付状态
    if (captureData.status === 'COMPLETED') {
      // 更新支付记录
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          creem_payment_id: captureData.id, // 保存最终的订单 ID
        })
        .eq('id', paymentId)

      if (updateError) {
        console.error('Update payment error:', updateError)
      }

      // 重定向到解读页面
      return NextResponse.redirect(new URL('/interpret', request.url))
    }

    // 支付未完成
    return NextResponse.redirect(new URL('/?error=payment_not_completed', request.url))

  } catch (error: any) {
    console.error('Payment callback error:', error)
    return NextResponse.redirect(new URL('/?error=callback_error', request.url))
  }
}
