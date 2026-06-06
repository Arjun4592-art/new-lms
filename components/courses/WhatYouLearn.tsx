import { CheckIcon } from '@/components/ui/Icons'

const LEARNINGS = [
  'How to recognise emotional patterns that hold you back',
  'How to set boundaries without guilt or fear',
  'How to let go of past pain and generational wounds',
  'How to build emotional resilience and inner strength',
  'How to choose yourself with confidence every day',
  'Tools and practices for daily emotional well-being',
]

export default function WhatYouLearn() {
  return (
    <div
      className='rounded-xl p-7'
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-surface-border)',
      }}
    >
      <h3
        className='font-serif text-[20px] font-medium mb-5'
        style={{ color: 'var(--color-text)' }}
      >
        What You Will Learn
      </h3>
      <div className='grid sm:grid-cols-2 gap-3'>
        {LEARNINGS.map((item) => (
          <div key={item} className='flex items-start gap-3'>
            <div
              className='w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5'
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <CheckIcon size={10} style={{ color: 'var(--color-bg)' }} />
            </div>
            <span
              className='text-[14px] leading-snug font-light'
              style={{ color: 'var(--color-primary-mid)' }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
