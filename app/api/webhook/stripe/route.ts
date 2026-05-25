import { NextResponse } from 'next/server'

// This route is not in use — using Razorpay instead of Stripe
export async function POST() {
  return NextResponse.json({ received: true })
}
