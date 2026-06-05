import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
export const dynamic = 'force-dynamic'
// ── Nodemailer transporter ────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

// ── POST /api/auth/otp — Send OTP ─────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email)
      return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    await adminDb.collection('otps').doc(email).set({ otp, expiresAt })

    await transporter.sendMail({
      from: `"Pain to Power" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your verification code',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border-radius:12px;border:1px solid #EDE9FE;">
          <h2 style="color:#2D1B5E;margin-bottom:8px;">Verify your email</h2>
          <p style="color:#4A3570;margin-bottom:24px;">Use the code below to verify your account. It expires in 10 minutes.</p>
          <div style="background:#F3EEFF;border-radius:8px;padding:24px;text-align:center;">
            <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#7C5CBF;">${otp}</span>
          </div>
          <p style="color:#8470A8;font-size:13px;margin-top:24px;">If you didn't request this, ignore this email.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('OTP send error:', err)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}

// ── PUT /api/auth/otp — Verify OTP ────────────────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    const { email, otp } = await req.json()
    if (!email || !otp)
      return NextResponse.json(
        { error: 'Email and OTP required' },
        { status: 400 },
      )

    const docSnap = await adminDb.collection('otps').doc(email).get()

    if (!docSnap.exists)
      return NextResponse.json({ error: 'OTP not found' }, { status: 404 })

    const { otp: storedOtp, expiresAt } = docSnap.data()!

    if (Date.now() > expiresAt) {
      await adminDb.collection('otps').doc(email).delete()
      return NextResponse.json({ error: 'OTP expired' }, { status: 410 })
    }

    if (otp !== storedOtp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 })
    }

    // OTP correct — delete it and mark user as verified
    await adminDb.collection('otps').doc(email).delete()

    const user = await adminAuth.getUserByEmail(email)
    await adminAuth.updateUser(user.uid, { emailVerified: true })
    await adminDb
      .collection('users')
      .doc(user.uid)
      .update({ emailVerified: true })

    return NextResponse.json({ success: true, uid: user.uid })
  } catch (err) {
    console.error('OTP verify error:', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
