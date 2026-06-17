import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      userId,
      amount,
    } = await req.json()

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courseId ||
      !userId
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // ── Signature verify karo ──────────────────────────────────────
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

    // ── Enrollment save karo ───────────────────────────────────────
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

    // ── User enrolledCourses update karo ──────────────────────────
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
