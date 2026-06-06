'use client'

import { useState } from 'react'
import FadeIn from '@/components/landing/FadeIn'
import { Tag } from '@/components/landing/UI'

const faqs = [
  {
    icon: '❤️',
    q: "I've tried therapy. How is this different?",
    a: 'This is coaching, not therapy. We focus on your future, not just your past. We take action — not just awareness.',
  },
  {
    icon: '🔒',
    q: "I'm very private. Will this be safe?",
    a: '100%. Everything shared in sessions stays between us. No recordings shared without your permission.',
  },
  {
    icon: '✨',
    q: 'Will this actually work for me?',
    a: 'If you show up and do the work — yes. Every person who has committed to these 4 weeks has walked away transformed.',
  },
  {
    icon: '⏱️',
    q: 'How much time do I need each week?',
    a: '1 live session per week (60 min) + optional journaling. Designed for busy people.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className='bg-[#faf8f4] px-6 py-20 text-center'>
      <div className='max-w-[700px] mx-auto'>
        <FadeIn>
          <Tag>❓ Before you decide</Tag>
          <h2 className='font-serif text-[clamp(26px,4vw,40px)] font-medium text-text mb-3'>
            Frequently Asked Questions
          </h2>
          <p className='text-primary-muted font-sans text-[15px] mb-12'>
            Real questions, honest answers
          </p>
        </FadeIn>

        <FadeIn delay={80}>
          <div className='bg-white border border-surface-border rounded-[16px] overflow-hidden'>
            {faqs.map(({ icon, q, a }, i) => (
              <div
                key={i}
                className='border-b border-surface-border last:border-b-0'
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className='w-full flex justify-between items-center gap-4 px-7 py-5 text-left font-sans text-[15px] font-semibold text-text cursor-pointer transition-colors duration-200 hover:text-primary bg-transparent border-none'
                >
                  <div className='flex items-center gap-4'>
                    <div
                      className='w-9 h-9 rounded-[10px] flex items-center justify-center text-[16px] flex-shrink-0'
                      style={{
                        background: '#e8dfd0',
                        border: '1px solid #d8cebc',
                      }}
                    >
                      {icon}
                    </div>
                    <span>{q}</span>
                  </div>
                  <div
                    className='w-7 h-7 rounded-full flex items-center justify-center text-lg flex-shrink-0 font-sans font-medium transition-all duration-300'
                    style={{
                      background: open === i ? '#2c2218' : '#e8dfd0',
                      color: open === i ? '#faf8f4' : '#5c4a38',
                      transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
                    }}
                  >
                    +
                  </div>
                </button>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: open === i ? '1fr' : '0fr',
                    transition:
                      'grid-template-rows 0.38s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  <div className='overflow-hidden'>
                    <p className='px-7 pb-5 pl-[72px] text-[14px] text-primary font-sans leading-[1.85]'>
                      {a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
