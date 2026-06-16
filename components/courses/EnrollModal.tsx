'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldIcon } from '@/components/ui/Icons'

interface EnrollModalProps {
  courseId: string
  courseTitle: string
  price: number
  userId: string
  onClose: () => void
}

const TRUST_ITEMS = [
  'Safe, judgment-free space',
  'Open to all individuals',
  'Instalment options available',
  'Secure payment via Razorpay',
]

declare global {
  interface Window {
    Razorpay: any
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true)
    const script = document.createElement('script')
    script.id = 'razorpay-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function EnrollModal({
  courseId,
  courseTitle,
  price,
  userId,
  onClose,
}: EnrollModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const displayPrice = (price / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  })

  async function handlePayment() {
    setLoading(true)
    setError('')

    try {
      // Razorpay script load karo
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        setError('Payment gateway load nahi hua. Please try again.')
        setLoading(false)
        return
      }

      // Order create karo
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, userId }),
      })

      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        setError(orderData.error ?? 'Failed to create order')
        setLoading(false)
        return
      }

      // Razorpay checkout open karo
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Radiant Rise with Masuma',
        description: courseTitle,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Payment successful — verify karo
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId,
              userId,
              amount: orderData.amount,
            }),
          })

          const verifyData = await verifyRes.json()

          if (verifyRes.ok && verifyData.success) {
            onClose()
            router.push(`/dashboard/learn/${courseId}`)
            router.refresh()
          } else {
            setError(verifyData.error ?? 'Payment verification failed')
          }
        },
        prefill: {},
        theme: {
          color: '#7A6A58',
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        setError(response.error?.description ?? 'Payment failed')
        setLoading(false)
      })
      rzp.open()
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    // ── Backdrop ──
    <div
      className='fixed inset-0 z-50 flex items-center justify-center px-4'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className='w-full max-w-md rounded-2xl p-7 relative'
        style={{
          backgroundColor: 'var(--color-bg)',
          border: '1px solid var(--color-surface-border)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors'
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-primary-muted)',
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div className='mb-6'>
          <p
            className='text-[12px] font-semibold uppercase tracking-widest mb-2'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            Enroll Now
          </p>
          <h2
            className='font-serif text-[22px] font-medium leading-snug'
            style={{ color: 'var(--color-text)' }}
          >
            {courseTitle}
          </h2>
        </div>

        {/* Price */}
        <div
          className='rounded-xl p-5 mb-5 flex items-center justify-between'
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-surface-border)',
          }}
        >
          <div>
            <p
              className='text-[13px] mb-1'
              style={{ color: 'var(--color-primary-muted)' }}
            >
              Programme Fee
            </p>
            <p
              className='text-[32px] font-semibold font-serif'
              style={{ color: 'var(--color-text)' }}
            >
              {displayPrice}
            </p>
          </div>
          <div
            className='text-[11px] font-semibold px-3 py-1.5 rounded-full'
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-bg)',
            }}
          >
            One-time
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className='mb-4 text-[13px] px-4 py-3 rounded-xl'
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
            }}
          >
            {error}
          </div>
        )}

        {/* Pay button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className='w-full py-4 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all disabled:opacity-60'
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-bg)',
            boxShadow: '0 8px 24px rgba(122,106,88,0.25)',
          }}
          onMouseEnter={(e) =>
            !loading &&
            (e.currentTarget.style.backgroundColor =
              'var(--color-primary-hover)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'var(--color-primary)')
          }
        >
          {loading ? (
            <svg
              className='animate-spin w-5 h-5'
              viewBox='0 0 24 24'
              fill='none'
            >
              <circle
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
                className='opacity-25'
              />
              <path
                fill='currentColor'
                d='M4 12a8 8 0 018-8v8H4z'
                className='opacity-75'
              />
            </svg>
          ) : (
            <>Pay {displayPrice} Securely</>
          )}
        </button>

        {/* Trust items */}
        <div className='mt-5 space-y-2'>
          {TRUST_ITEMS.map((item) => (
            <div
              key={item}
              className='flex items-center gap-2 text-[13px] font-light'
              style={{ color: 'var(--color-primary-mid)' }}
            >
              <ShieldIcon
                size={13}
                style={{ color: 'var(--color-primary)', flexShrink: 0 }}
              />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
