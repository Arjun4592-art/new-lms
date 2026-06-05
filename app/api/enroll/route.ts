import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
export const dynamic = 'force-dynamic'
// ── Web Crypto signature verification (Turbopack safe) ────────────────────

async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const body = `${orderId}|${paymentId}`
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
  const hashHex = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return hashHex === signature
}

// ── POST /api/enroll — Create Razorpay order ──────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = req.cookies.get('session')?.value
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = await adminAuth.verifySessionCookie(session, true)
    const { courseId, amount } = await req.json()

    if (!courseId || !amount) {
      return NextResponse.json(
        { error: 'Missing courseId or amount' },
        { status: 400 },
      )
    }

    const courseDoc = await adminDb.collection('courses').doc(courseId).get()
    if (!courseDoc.exists) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const course = courseDoc.data()!
    if (course.price !== amount) {
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
    }

    const Razorpay = (await import('razorpay')).default
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${courseId}_${decoded.uid}_${Date.now()}`,
      notes: { courseId, userId: decoded.uid },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      courseName: course.title,
    })
  } catch (err) {
    console.error('Enroll API error:', err)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 },
    )
  }
}

// ── PUT /api/enroll — Verify payment + enroll ─────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    const session = req.cookies.get('session')?.value
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = await adminAuth.verifySessionCookie(session, true)

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      amount,
    } = await req.json()

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courseId
    ) {
      return NextResponse.json(
        { error: 'Missing payment fields' },
        { status: 400 },
      )
    }

    const isValid = await verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET!,
    )

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 },
      )
    }

    const uid = decoded.uid
    const enrollmentId = `${uid}_${courseId}`

    await adminDb.collection('enrollments').doc(enrollmentId).set({
      userId: uid,
      courseId,
      enrolledAt: new Date().toISOString(),
      price: amount,
      progress: 0,
      completedLessons: [],
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    })

    const userRef = adminDb.collection('users').doc(uid)
    const userSnap = await userRef.get()
    const existing: string[] = userSnap.data()?.enrolledCourses ?? []
    if (!existing.includes(courseId)) {
      await userRef.update({ enrolledCourses: [...existing, courseId] })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Payment verify error:', err)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 },
    )
  }
}
