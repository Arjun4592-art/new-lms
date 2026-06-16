import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { adminDb } from '@/lib/firebase-admin'
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

    // 1. Firebase Admin se save — reliable on server
    await adminDb.collection('contact_messages').add({
      name,
      email,
      interest: interest ?? '',
      message,
      createdAt: new Date().toISOString(),
    })

    // 2. Masuma ko notification
    await transporter.sendMail({
      from: `"Contact Form" <${process.env.GMAIL_USER}>`,
      to: 'masuma26coach@gmail.com',
      subject: `New Message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:720px;margin:auto;padding:20px;">
          <h2 style="color:#2D1B5E;">New contact form submission</h2>
          <div style="background:#F9F5FF;border:1px solid #EDE9FE;border-radius:12px;padding:16px;">
            <p><b>Name:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Interest:</b> ${interest ?? 'Not specified'}</p>
            <p><b>Message:</b></p>
            <p style="color:#6B5B8B;white-space:pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    })

    // 3. User ko confirmation
    await transporter.sendMail({
      from: `"Masuma | Radiant Rise" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Thank you, ${name} 🌿`,
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px;color:#2c2218;">
          <h2 style="color:#7a6a58;margin-bottom:8px;">Thank you for reaching out, ${name}!</h2>
          <p style="color:#5c4a38;line-height:1.7;">
            I've received your message and will get back to you within <strong>24 hours</strong>.
          </p>
          <div style="background:#f5f0e8;border-left:3px solid #b8a898;padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0;">
            <p style="margin:0;font-size:13px;color:#9c8472;font-style:italic;white-space:pre-wrap;">${message}</p>
          </div>
          <p style="color:#5c4a38;line-height:1.7;">
            With love &amp; light,<br/>
            <strong>Masuma</strong><br/>
            <span style="font-size:13px;color:#9c8472;">Radiant Rise Coaching</span>
          </p>
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
