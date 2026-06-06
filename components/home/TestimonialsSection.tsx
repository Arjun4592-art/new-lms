'use client'

import { useEffect, useRef, useState } from 'react'
import SectionHeading from '@/components/ui/SectionHeading'
import { QuoteIcon } from '@/components/ui/Icons'

const TESTIMONIALS = [
  {
    name: 'Priya S.',
    role: 'Programme Graduate',
    avatar: 'P',
    quote:
      'Masuma helped me set boundaries I never thought were possible. I stopped people-pleasing and finally started choosing myself. This coaching changed my life completely.',
    result: 'Set boundaries without guilt',
  },
  {
    name: 'Rania M.',
    role: '4-Week Healing Programme',
    avatar: 'R',
    quote:
      "I came in carrying so much generational pain. Through this programme, I released what wasn't mine to carry. I feel lighter, freer, and more myself than ever before.",
    result: 'Released generational pressure',
  },
  {
    name: 'Aisha K.',
    role: 'Masterclass Participant',
    avatar: 'A',
    quote:
      'I used to feel like I was drowning in my own emotions. Now I have tools, clarity, and the confidence to face anything. Masuma is truly gifted at what she does.',
    result: 'Emotional resilience built',
  },
  {
    name: 'Fatima L.',
    role: '5-Day Challenge Alumni',
    avatar: 'F',
    quote:
      "Just 5 days with Masuma's guidance shifted something deep inside me. I learned to recognize my emotional patterns and stopped letting them run my life.",
    result: 'Recognised emotional patterns',
  },
  {
    name: 'Sana R.',
    role: 'Self-Boundaries Course',
    avatar: 'S',
    quote:
      'For the first time in years, I feel worthy of love and respect — starting with my own. The self-boundaries course was exactly what I needed. Highly recommend.',
    result: 'Rebuilt self-worth',
  },
  {
    name: 'Noor H.',
    role: 'Programme Graduate',
    avatar: 'N',
    quote:
      'Masuma creates such a safe, judgment-free space. I shared things I had never told anyone. The healing that followed was profound and lasting.',
    result: 'Deep emotional healing',
  },
]

const GAP = 16

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [cardWidth, setCardWidth] = useState(480)
  const [isMobile, setIsMobile] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const total = TESTIMONIALS.length

  const next = () => setCurrent((prev) => (prev + 1) % total)
  const prev = () => setCurrent((prev) => (prev - 1 + total) % total)
  const goTo = (i: number) => setCurrent(i)

  // Responsive card width
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      const mobile = w < 640
      setIsMobile(mobile)
      if (mobile) {
        setCardWidth(w - 48) // full width minus padding
      } else if (w < 1024) {
        setCardWidth(Math.min(w - 96, 420))
      } else {
        setCardWidth(480)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(next, 3500)
    return () => clearInterval(timerRef.current!)
  }, [paused, current])

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    setPaused(true)
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    setPaused(false)
  }

  // On mobile: simple centered scroll; on desktop: peek effect
  const offset = isMobile
    ? -(current * (cardWidth + GAP))
    : -(current * (cardWidth + GAP)) + cardWidth + GAP - 140

  return (
    <>
      <style>{`
        .testimonials-section {
          background-color: var(--color-primary-dark);
          position: relative;
          overflow: hidden;
        }
        .t-blob-left {
          position: absolute; left: 0; top: 33%;
          width: 260px; height: 260px; border-radius: 50%;
          background: color-mix(in srgb, var(--color-primary) 20%, transparent);
          filter: blur(60px); pointer-events: none;
        }
        .t-blob-right {
          position: absolute; right: 0; bottom: 33%;
          width: 260px; height: 260px; border-radius: 50%;
          background: color-mix(in srgb, var(--color-primary-muted) 20%, transparent);
          filter: blur(60px); pointer-events: none;
        }
        .t-nav-btn {
          position: absolute; top: 50%; z-index: 20;
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: var(--color-primary-light);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; cursor: pointer;
          transition: background 0.2s;
        }
        .t-nav-btn:hover { background: rgba(255,255,255,0.16); }
        .t-nav-prev { left: 0; transform: translate(-8px, -50%); }
        .t-nav-next { right: 0; transform: translate(8px, -50%); }
        .t-dot {
          border-radius: 9999px;
          transition: all 0.3s ease;
          border: none; cursor: pointer;
        }
        .t-dot-active {
          width: 24px; height: 8px;
          background: var(--color-primary-muted);
        }
        .t-dot-inactive {
          width: 8px; height: 8px;
          background: rgba(255,255,255,0.25);
        }
        .t-dot-inactive:hover { background: rgba(255,255,255,0.45); }
        .t-result-badge {
          font-size: 11px;
          background: color-mix(in srgb, var(--color-primary) 35%, transparent);
          color: var(--color-primary-accent);
          padding: 4px 10px; border-radius: 9999px;
          border: 1px solid color-mix(in srgb, var(--color-primary-muted) 40%, transparent);
        }
      `}</style>

      <section className='testimonials-section py-20 px-4 sm:px-6'>
        <div className='t-blob-left' />
        <div className='t-blob-right' />

        <div className='max-w-6xl mx-auto relative'>
          <SectionHeading
            eyebrow='Real Transformations'
            title='What People Are Saying'
            subtitle="These aren't just testimonials — they are stories of real individuals who chose themselves."
            center
            light
          />

          <div
            className='mt-12 relative'
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Slider track */}
            <div
              className='overflow-hidden'
              style={{ padding: isMobile ? '0' : '12px 0' }}
            >
              <div
                ref={trackRef}
                className='flex items-stretch'
                style={{
                  gap: GAP,
                  transform: `translateX(${offset}px)`,
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
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
                      className='rounded-xl p-5 sm:p-6'
                      style={{
                        width: cardWidth,
                        flexShrink: 0,
                        transform: isCenter
                          ? isMobile
                            ? 'scale(1)'
                            : 'scale(1.04)'
                          : 'scale(0.96)',
                        filter: isCenter || isMobile ? 'none' : 'blur(1.5px)',
                        opacity: isCenter
                          ? 1
                          : isMobile
                            ? 0
                            : isAdjacent
                              ? 0.5
                              : 0.15,
                        transition:
                          'transform 0.5s ease, opacity 0.5s ease, filter 0.5s ease',
                        cursor: isCenter ? 'default' : 'pointer',
                        boxShadow: isCenter
                          ? '0 20px 48px rgba(44,34,24,0.35)'
                          : 'none',
                        backgroundColor: isCenter
                          ? 'rgba(255,255,255,0.10)'
                          : 'rgba(255,255,255,0.04)',
                        border: isCenter
                          ? '1px solid rgba(255,255,255,0.20)'
                          : '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      {/* Stars */}
                      <div className='flex gap-0.5 mb-4'>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <svg
                            key={i}
                            width='14'
                            height='14'
                            viewBox='0 0 24 24'
                            fill='var(--color-primary-muted)'
                          >
                            <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
                          </svg>
                        ))}
                      </div>

                      <QuoteIcon
                        size={22}
                        style={{
                          color: 'var(--color-primary-muted)',
                          marginBottom: '10px',
                        }}
                      />

                      <p
                        className='text-[14px] leading-relaxed mb-5 italic font-light'
                        style={{ color: 'var(--color-primary-accent)' }}
                      >
                        &ldquo;{t.quote}&rdquo;
                      </p>

                      <div
                        className='pt-4 flex items-center justify-between flex-wrap gap-3'
                        style={{
                          borderTop: '1px solid rgba(255,255,255,0.10)',
                        }}
                      >
                        <div className='flex items-center gap-3'>
                          <div
                            className='w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold shrink-0'
                            style={{
                              backgroundColor: 'var(--color-primary)',
                              color: 'var(--color-bg)',
                            }}
                          >
                            {t.avatar}
                          </div>
                          <div>
                            <p
                              className='text-[13px] font-semibold'
                              style={{ color: 'var(--color-primary-light)' }}
                            >
                              {t.name}
                            </p>
                            <p
                              className='text-[11px]'
                              style={{ color: 'var(--color-primary-muted)' }}
                            >
                              {t.role}
                            </p>
                          </div>
                        </div>
                        <span className='t-result-badge'>✓ {t.result}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Nav buttons — desktop only */}
            {!isMobile && (
              <>
                <button onClick={prev} className='t-nav-btn t-nav-prev'>
                  ‹
                </button>
                <button onClick={next} className='t-nav-btn t-nav-next'>
                  ›
                </button>
              </>
            )}
          </div>

          {/* Dots */}
          <div className='flex justify-center gap-2 mt-8'>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`t-dot ${i === current ? 't-dot-active' : 't-dot-inactive'}`}
              />
            ))}
          </div>

          {/* Mobile swipe hint */}
          {isMobile && (
            <p
              className='text-center text-[11px] mt-4'
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              Swipe to see more
            </p>
          )}
        </div>
      </section>
    </>
  )
}
