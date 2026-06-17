import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { adminDb, adminAuth } from '@/lib/firebase-admin'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
  try {
    const { courseId, userId } = await req.json()

    if (!courseId || !userId) {
      return NextResponse.json(
        { error: 'courseId and userId required' },
        { status: 400 },
      )
    }

    // Course exist karta hai? aur price lo Firestore se
    const courseSnap = await adminDb.collection('courses').doc(courseId).get()
    if (!courseSnap.exists) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const courseData = courseSnap.data()!
    // Firestore mein price rupees mein store hai → paise mein convert karo
    const amount = Math.round(courseData.price * 100)

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
      amount: amount, // ✅ paise mein (rupees * 100)
      currency: 'INR',
      receipt: `rcpt_${userId}_${courseId}`.slice(0, 40),
      notes: { courseId, userId },
    })

    // Frontend "key", "amount", "currency", "orderId" expect karta hai
    return NextResponse.json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID, // ✅ "key" — frontend se match
      amount: order.amount,
      currency: order.currency,
    })
  } catch (err: any) {
    console.error('❌ Create order error:', err)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 },
    )
  }
}
