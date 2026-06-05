import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
export const dynamic = 'force-dynamic'
// Firebase Admin (Firestore) for saving contact messages
function getAdminDb() {
  const adminApp = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      })

  return getFirestore(adminApp)
}

const adminDb = getAdminDb()

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

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 },
      )
    }

    // 1) Save to Firebase/Firestore
    await adminDb.collection('contact_messages').add({
      name,
      email,
      interest: interest ?? '',
      message,
      createdAt: new Date().toISOString(),
    })

    // 2) Send email notification
    await transporter.sendMail({
      from: `"Contact Form" <${process.env.GMAIL_USER}>`,
      to: 'masuma26coach@gmail.com',
      subject: 'New Contact Form Submission',
      html: `
        <div style="font-family:sans-serif;max-width:720px;margin:auto;padding:20px;">
          <h2 style="color:#2D1B5E;margin-bottom:8px;">New contact form submission</h2>
          <p style="color:#4A3570;margin-bottom:16px;">A new message has been submitted from your website.</p>

          <div style="background:#F9F5FF;border:1px solid #EDE9FE;border-radius:12px;padding:16px;">
            <p style="margin:6px 0;"><b>Name:</b> ${name}</p>
            <p style="margin:6px 0;"><b>Email:</b> ${email}</p>
            <p style="margin:6px 0;"><b>Interest:</b> ${interest ?? ''}</p>
            <p style="margin:6px 0;"><b>Message:</b></p>
            <p style="margin:6px 0;color:#6B5B8B;white-space:pre-wrap;">${message}</p>
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
