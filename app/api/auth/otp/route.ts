import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { db } from '@/lib/firebase/config'
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore'
export const dynamic = 'force-dynamic'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email)
      return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 10 * 60 * 1000

    await setDoc(doc(db, 'otps', email), { otp, expiresAt })

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

export async function PUT(req: NextRequest) {
  try {
    const { email, otp } = await req.json()
    if (!email || !otp)
      return NextResponse.json(
        { error: 'Email and OTP required' },
        { status: 400 },
      )

    const docSnap = await getDoc(doc(db, 'otps', email))
    if (!docSnap.exists())
      return NextResponse.json({ error: 'OTP not found' }, { status: 404 })

    const { otp: storedOtp, expiresAt } = docSnap.data()

    if (Date.now() > expiresAt) {
      await deleteDoc(doc(db, 'otps', email))
      return NextResponse.json({ error: 'OTP expired' }, { status: 410 })
    }

    if (otp !== storedOtp)
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 })

    await deleteDoc(doc(db, 'otps', email))
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('OTP verify error:', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
