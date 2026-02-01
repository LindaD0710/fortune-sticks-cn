import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * 处理 PayPal Webhook 事件
 * PayPal 会发送支付事件到这个端点
 * 这个 API 会：
 * 1. 验证 Webhook 签名（可选，但推荐）
 * 2. 处理支付完成事件
 * 3. 更新支付记录状态
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const eventType = body.event_type
    const resource = body.resource

    // 只处理支付完成相关的事件
    if (!eventType || !['PAYMENT.CAPTURE.COMPLETED', 'CHECKOUT.ORDER.COMPLETED'].includes(eventType)) {
      return NextResponse.json({ received: true })
    }

    // 获取订单 ID 或支付 ID
    const orderId = resource?.id || resource?.supplementary_data?.related_ids?.order_id
    const paymentId = resource?.supplementary_data?.related_ids?.capture_id

    if (!orderId && !paymentId) {
      console.error('No order ID or payment ID found in webhook')
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 })
    }

    const supabase = await createClient()

    // 查找对应的支付记录（通过 creem_payment_id 字段存储的 PayPal 订单 ID）
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('creem_payment_id', orderId || paymentId)
      .single()

    if (paymentError || !payment) {
      console.error('Payment not found:', paymentError)
      // Webhook 可能比回调先到达，这是正常的
      return NextResponse.json({ received: true })
    }

    // 如果支付已完成，不需要重复更新
    if (payment.status === 'completed') {
      return NextResponse.json({ received: true })
    }

    // 更新支付记录状态
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', payment.id)

    if (updateError) {
      console.error('Webhook update error:', updateError)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
