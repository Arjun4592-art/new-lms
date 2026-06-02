export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false)
    if ((window as any).Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill: { name: string; email: string }
  theme: { color: string }
  handler: (response: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }) => void
  modal?: { ondismiss?: () => void }
}

export function openRazorpay(options: RazorpayOptions) {
  const rzp = new (window as any).Razorpay(options)
  rzp.open()
  return rzp
}

// ── Full enroll flow ───────────────────────────────────────────────────────
// Call this from your EnrollButton for paid courses

export async function initiateRazorpayEnrollment({
  courseId,
  amount,
  userName,
  userEmail,
  courseName,
  onSuccess,
  onError,
}: {
  courseId: string
  amount: number
  userName: string
  userEmail: string
  courseName: string
  onSuccess: () => void
  onError: (msg: string) => void
}) {
  const loaded = await loadRazorpayScript()
  if (!loaded) {
    onError('Failed to load payment gateway')
    return
  }

  // Step 1 — Create order
  const orderRes = await fetch('/api/enroll', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseId, amount }),
  })

  if (!orderRes.ok) {
    const data = await orderRes.json()
    onError(data.error ?? 'Failed to create order')
    return
  }

  const { orderId, keyId } = await orderRes.json()

  // Step 2 — Open Razorpay checkout
  openRazorpay({
    key: keyId,
    amount: amount * 100,
    currency: 'INR',
    name: 'Pain to Power',
    description: courseName,
    order_id: orderId,
    prefill: { name: userName, email: userEmail },
    theme: { color: '#7C5CBF' },
    handler: async (response) => {
      // Step 3 — Verify payment + enroll
      const verifyRes = await fetch('/api/enroll', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...response, courseId, amount }),
      })
      if (verifyRes.ok) {
        onSuccess()
      } else {
        const data = await verifyRes.json()
        onError(data.error ?? 'Payment verification failed')
      }
    },
    modal: { ondismiss: () => onError('Payment cancelled') },
  })
}
