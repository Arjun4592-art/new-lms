import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// ── POST — Order create karo ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { courseId, amount } = await req.json()

    if (!courseId || !amount) {
      return NextResponse.json(
        { error: 'courseId and amount required' },
        { status: 400 },
      )
    }

    // Session se user verify karo
    const session = req.cookies.get('session')?.value
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { adminAuth } = await import('@/lib/firebase-admin')
    const decoded = await adminAuth.verifyIdToken(session)
    const userId = decoded.uid

    // Course exist karta hai?
    const courseSnap = await adminDb.collection('courses').doc(courseId).get()
    if (!courseSnap.exists) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Already enrolled?
    const enrollSnap = await adminDb
      .collection('enrollments')
      .doc(`${userId}_${courseId}`)
      .get()

    if (enrollSnap.exists) {
      return NextResponse.json({ error: 'Already enrolled' }, { status: 400 })
    }

    // Razorpay order banao
    const order = await razorpay.orders.create({
      amount: amount * 100, // rupees → paise
      currency: 'INR',
      receipt: `rcpt_${userId}_${courseId}`.slice(0, 40),
      notes: { courseId, userId },
    })

    return NextResponse.json({
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err: any) {
    console.error('❌ Create order error:', err)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 },
    )
  }
}

// ── PUT — Payment verify + enroll karo ───────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
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
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Session se user verify karo
    const session = req.cookies.get('session')?.value
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { adminAuth } = await import('@/lib/firebase-admin')
    const decoded = await adminAuth.verifyIdToken(session)
    const userId = decoded.uid

    // ── Signature verify karo ─────────────────────────────────
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 },
      )
    }

    // ── Enrollment save karo ──────────────────────────────────
    await adminDb.collection('enrollments').doc(`${userId}_${courseId}`).set({
      userId,
      courseId,
      enrolledAt: FieldValue.serverTimestamp(),
      price: amount,
      progress: 0,
      completedLessons: [],
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    })

    // ── User enrolledCourses update karo ──────────────────────
    const userRef = adminDb.collection('users').doc(userId)
    const userSnap = await userRef.get()
    const existing: string[] = userSnap.data()?.enrolledCourses ?? []

    if (!existing.includes(courseId)) {
      await userRef.update({
        enrolledCourses: [...existing, courseId],
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('❌ Verify error:', err)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 },
    )
  }
}
