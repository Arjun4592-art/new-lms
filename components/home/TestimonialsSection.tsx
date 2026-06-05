'use client'

import { useEffect, useRef, useState } from 'react'
import SectionHeading from '@/components/ui/SectionHeading'
import { QuoteIcon } from '@/components/ui/Icons'

const TESTIMONIALS = [
  {
    name: 'Priya S.',
    role: 'Programme Graduate',
    avatar: 'P',
    color: '#7C5CBF',
    quote:
      'Masuma helped me set boundaries I never thought were possible. I stopped people-pleasing and finally started choosing myself. This coaching changed my life completely.',
    result: 'Set boundaries without guilt',
  },
  {
    name: 'Rania M.',
    role: '4-Week Healing Programme',
    avatar: 'R',
    color: '#A67DD4',
    quote:
      "I came in carrying so much generational pain. Through this programme, I released what wasn't mine to carry. I feel lighter, freer, and more myself than ever before.",
    result: 'Released generational pressure',
  },
  {
    name: 'Aisha K.',
    role: 'Masterclass Participant',
    avatar: 'A',
    color: '#C084F5',
    quote:
      'I used to feel like I was drowning in my own emotions. Now I have tools, clarity, and the confidence to face anything. Masuma is truly gifted at what she does.',
    result: 'Emotional resilience built',
  },
  {
    name: 'Fatima L.',
    role: '5-Day Challenge Alumni',
    avatar: 'F',
    color: '#9B6FC8',
    quote:
      "Just 5 days with Masuma's guidance shifted something deep inside me. I learned to recognize my emotional patterns and stopped letting them run my life.",
    result: 'Recognised emotional patterns',
  },
  {
    name: 'Sana R.',
    role: 'Self-Boundaries Course',
    avatar: 'S',
    color: '#8B5CF6',
    quote:
      'For the first time in years, I feel worthy of love and respect — starting with my own. The self-boundaries course was exactly what I needed. Highly recommend.',
    result: 'Rebuilt self-worth',
  },
  {
    name: 'Noor H.',
    role: 'Programme Graduate',
    avatar: 'N',
    color: '#7C5CBF',
    quote:
      'Masuma creates such a safe, judgment-free space. I shared things I had never told anyone. The healing that followed was profound and lasting.',
    result: 'Deep emotional healing',
  },
]

const CARD_WIDTH = 480
const GAP = 16

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const total = TESTIMONIALS.length

  const next = () => setCurrent((prev) => (prev + 1) % total)
  const prev = () => setCurrent((prev) => (prev - 1 + total) % total)
  const goTo = (i: number) => setCurrent(i)

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(next, 3500)
    return () => clearInterval(timerRef.current!)
  }, [paused, current])

  // Sab cards same width — offset se center mein slide karo
  const offset = -(current * (CARD_WIDTH + GAP)) + CARD_WIDTH + GAP - 140

  return (
    <section className='py-20 px-4 bg-linear-to-br from-[#2D1B5E] to-[#4A2D8A] overflow-hidden relative'>
      <div className='absolute left-0 top-1/3 w-64 h-64 bg-[#7C5CBF]/20 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute right-0 bottom-1/3 w-64 h-64 bg-[#C084F5]/20 rounded-full blur-3xl pointer-events-none' />

      <div className='max-w-6xl mx-auto relative'>
        <SectionHeading
          eyebrow='Real Transformations'
          title='What Women Are Saying'
          subtitle="These aren't just testimonials — they are stories of real women who chose themselves."
          center
          light
        />

        <div
          className='mt-12 relative'
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Overflow container */}
          <div className='overflow-hidden'>
            {/* Sliding track */}
            <div
              className='flex items-center'
              style={{
                gap: GAP,
                transform: `translateX(${offset}px)`,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {TESTIMONIALS.map((t, idx) => {
                const isCenter = idx === current
                const isAdjacent =
                  idx === (current - 1 + total) % total ||
                  idx === (current + 1) % total

                return (
                  <div
                    key={idx}
                    onClick={() => !isCenter && goTo(idx)}
                    style={{
                      width: CARD_WIDTH,
                      flexShrink: 0,
                      transform: isCenter ? 'scale(1.04)' : 'scale(0.96)',
                      filter: isCenter ? 'none' : 'blur(1.5px)',
                      opacity: isCenter ? 1 : isAdjacent ? 0.5 : 0.15,
                      transition:
                        'transform 0.5s ease, opacity 0.5s ease, filter 0.5s ease',
                      cursor: isCenter ? 'default' : 'pointer',
                      boxShadow: isCenter
                        ? '0 25px 50px rgba(76,29,149,0.4)'
                        : 'none',
                    }}
                    className={`rounded-2xl p-6 border ${
                      isCenter
                        ? 'bg-white/15 border-white/30'
                        : 'bg-white/6 border-white/10'
                    }`}
                  >
                    {/* Stars */}
                    <div className='flex gap-0.5 mb-4'>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg
                          key={i}
                          width='14'
                          height='14'
                          viewBox='0 0 24 24'
                          fill='#F5A623'
                        >
                          <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
                        </svg>
                      ))}
                    </div>

                    <QuoteIcon size={22} className='text-purple-300 mb-3' />

                    <p className='text-[14px] text-purple-100 leading-relaxed mb-5 italic'>
                      "{t.quote}"
                    </p>

                    <div className='pt-4 border-t border-white/10 flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <div
                          className='w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0'
                          style={{ background: t.color }}
                        >
                          {t.avatar}
                        </div>
                        <div>
                          <p className='text-[13px] font-semibold text-white'>
                            {t.name}
                          </p>
                          <p className='text-[11px] text-purple-300'>
                            {t.role}
                          </p>
                        </div>
                      </div>
                      <span className='text-[11px] bg-[#7C5CBF]/40 text-purple-200 px-2.5 py-1 rounded-full border border-purple-400/30'>
                        ✓ {t.result}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Prev / Next buttons */}
          <button
            onClick={prev}
            className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2
                       w-10 h-10 rounded-full bg-white/10 border border-white/20
                       flex items-center justify-center text-white text-xl
                       hover:bg-white/20 transition-all z-20'
          >
            ‹
          </button>
          <button
            onClick={next}
            className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-2
                       w-10 h-10 rounded-full bg-white/10 border border-white/20
                       flex items-center justify-center text-white text-xl
                       hover:bg-white/20 transition-all z-20'
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className='flex justify-center gap-2 mt-8'>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-2 bg-purple-300'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
