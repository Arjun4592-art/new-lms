import { NextRequest, NextResponse } from 'next/server'

// POST /api/enroll
// Creates a Razorpay order for course enrollment
// Body: { courseId, amount, userId, userEmail, userName }

export async function POST(request: NextRequest) {
  try {
    const { courseId, amount, userId, userEmail, userName } =
      await request.json()

    if (!courseId || !amount || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: courseId, amount, userId' },
        { status: 400 },
      )
    }

    // ── Razorpay integration ──────────────────────────────────────────────────
    // Install: npm install razorpay
    // Then uncomment below and remove the mock response

    /*
    const Razorpay = (await import('razorpay')).default
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${courseId}_${userId}_${Date.now()}`,
      notes: { courseId, userId, userEmail: userEmail ?? '', userName: userName ?? '' },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
    */

    // ── Mock response (remove once Razorpay keys are set up) ─────────────────
    return NextResponse.json({
      orderId: `mock_order_${Date.now()}`,
      amount: amount * 100,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID ?? 'rzp_test_placeholder',
    })
  } catch (error) {
    console.error('Enroll API error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 },
    )
  }
}
