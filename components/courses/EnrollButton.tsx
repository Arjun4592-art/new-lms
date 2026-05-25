'use client'

import { useState } from 'react'
import { ArrowRightIcon, ShieldIcon } from '@/components/ui/Icons'

interface EnrollButtonProps {
  courseTitle: string
  price?: string
}

export default function EnrollButton({
  courseTitle,
  price,
}: EnrollButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleEnroll() {
    setLoading(true)
    // TODO: integrate Razorpay checkout here
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    alert(`Redirecting to checkout for: ${courseTitle}`)
  }

  return (
    <div className='bg-white border border-purple-100 rounded-2xl p-6 sticky top-24'>
      {price && (
        <div className='mb-4'>
          <p className='text-[32px] font-bold text-[#2D1B5E]'>{price}</p>
          <p className='text-[13px] text-[#8470A8]'>
            One-time payment · Instalment options available
          </p>
        </div>
      )}

      <button
        onClick={handleEnroll}
        disabled={loading}
        className='w-full py-4 bg-[#7C5CBF] hover:bg-[#6A4DAD] text-white font-bold text-[16px] rounded-xl transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300 disabled:opacity-60 flex items-center justify-center gap-2'
      >
        {loading ? (
          <svg className='animate-spin w-5 h-5' viewBox='0 0 24 24' fill='none'>
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8v8H4z'
            />
          </svg>
        ) : (
          <>
            Enroll Now <ArrowRightIcon size={18} />
          </>
        )}
      </button>

      <button className='w-full mt-3 py-3 border-2 border-[#7C5CBF] text-[#7C5CBF] font-semibold rounded-xl hover:bg-[#F3EEFF] transition-colors'>
        Book a Free Call First
      </button>

      <div className='mt-5 space-y-2'>
        {[
          'Safe, judgment-free space',
          'Women only programme',
          'Secure Razorpay payment',
          'Instalment options available',
        ].map((item) => (
          <div
            key={item}
            className='flex items-center gap-2 text-[13px] text-[#6B5B8B]'
          >
            <ShieldIcon size={13} className='text-[#7C5CBF] shrink-0' />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
