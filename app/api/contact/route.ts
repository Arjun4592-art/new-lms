import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { db } from '@/lib/firebase/config'
import { collection, addDoc } from 'firebase/firestore'
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
    const { name, email, message, interest } = await req.json()

    if (!name || !email || !message)
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )

    await addDoc(collection(db, 'contact_messages'), {
      name,
      email,
      interest: interest ?? '',
      message,
      createdAt: new Date().toISOString(),
    })

    await transporter.sendMail({
      from: `"Contact Form" <${process.env.GMAIL_USER}>`,
      to: 'masuma26coach@gmail.com',
      subject: 'New Contact Form Submission',
      html: `
        <div style="font-family:sans-serif;max-width:720px;margin:auto;padding:20px;">
          <h2 style="color:#2D1B5E;">New contact form submission</h2>
          <div style="background:#F9F5FF;border:1px solid #EDE9FE;border-radius:12px;padding:16px;">
            <p><b>Name:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Interest:</b> ${interest ?? ''}</p>
            <p><b>Message:</b></p>
            <p style="color:#6B5B8B;white-space:pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact submit error:', err)
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 },
    )
  }
}
