import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { adminDb } from '@/lib/firebase-admin'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email)
      return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 10 * 60 * 1000
    const hashedOtp = hashOtp(otp)

    await adminDb
      .collection('otps')
      .doc(email)
      .set({ otp: hashedOtp, expiresAt })

    await transporter.sendMail({
      from: `"Pain to Power" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your verification code',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border-radius:12px;border:1px solid #D8CEBC;background:#F5F0E8;">
          <div style="text-align:center;margin-bottom:24px;">
            <span style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:#7A6A58;background:#E8DFD0;padding:5px 14px;border-radius:99px;border:1px solid #D8CEBC;">
              Pain to Power Coaching
            </span>
          </div>
          <h2 style="color:#2C2218;margin-bottom:8px;font-family:Georgia,serif;font-weight:500;font-size:22px;">
            Verify your email
          </h2>
          <p style="color:#5C4A38;margin-bottom:24px;font-size:14px;line-height:1.7;font-weight:300;">
            Use the code below to verify your account. It expires in 10 minutes.
          </p>
          <div style="background:#E8DFD0;border-radius:10px;padding:28px;text-align:center;border:1px solid #D8CEBC;">
            <span style="font-size:38px;font-weight:700;letter-spacing:10px;color:#2C2218;">${otp}</span>
          </div>
          <p style="color:#B8A898;font-size:12px;margin-top:24px;line-height:1.6;">
            If you didn't request this, you can safely ignore this email.
          </p>
          <hr style="border:none;border-top:1px solid #D8CEBC;margin:20px 0;" />
          <p style="color:#B8A898;font-size:11px;text-align:center;">
            © Pain to Power Coaching
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('OTP send error:', err)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}

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

    const { otp: storedHashedOtp, expiresAt } = docSnap.data()!

    if (Date.now() > expiresAt) {
      await adminDb.collection('otps').doc(email).delete()
      return NextResponse.json({ error: 'OTP expired' }, { status: 410 })
    }

    const hashedInput = hashOtp(otp)
    if (hashedInput !== storedHashedOtp)
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 })

    await adminDb.collection('otps').doc(email).delete()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('OTP verify error:', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
