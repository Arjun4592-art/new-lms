'use client'

import { useEffect, useRef } from 'react'
import Button from '@/components/ui/Button'
import { ArrowRightIcon, SparkleIcon } from '@/components/ui/Icons'

const WHAT_YOU_LEARN = [
  'Recognise emotional patterns',
  'Set boundaries without guilt',
  'Let go of past pain',
  'Build emotional resilience',
  'Choose yourself with confidence',
]

export default function CTASection() {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('cta-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .cta-card {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .cta-card.cta-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cta-tag {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .cta-card.cta-visible .cta-tag {
          opacity: 1;
          transform: translateY(0);
        }
        .cta-tag:nth-child(1) { transition-delay: 0.35s; }
        .cta-tag:nth-child(2) { transition-delay: 0.42s; }
        .cta-tag:nth-child(3) { transition-delay: 0.49s; }
        .cta-tag:nth-child(4) { transition-delay: 0.56s; }
        .cta-tag:nth-child(5) { transition-delay: 0.63s; }

        .cta-btn-primary {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cta-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(44,34,24,0.25);
        }
      `}</style>

      <section
        className='py-20 px-4 sm:px-6'
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <div className='max-w-4xl mx-auto'>
          <div
            ref={cardRef}
            className='cta-card relative rounded-2xl p-8 sm:p-12 md:p-16 text-center overflow-hidden'
            style={{
              backgroundColor: 'var(--color-primary-dark)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Decorative circles */}
            <div
              className='absolute top-0 left-0 w-52 h-52 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2'
              style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
            />
            <div
              className='absolute bottom-0 right-0 w-72 h-72 rounded-full pointer-events-none translate-x-1/3 translate-y-1/3'
              style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            />
            {/* Subtle top accent line */}
            <div
              className='absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px'
              style={{
                backgroundColor: 'var(--color-primary-muted)',
                opacity: 0.5,
              }}
            />

            <div className='relative'>
              {/* Icon */}
              <div
                className='w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6'
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <SparkleIcon
                  size={26}
                  style={{ color: 'var(--color-primary-muted)' }}
                />
              </div>

              {/* Headline */}
              <h2
                className='font-serif text-[28px] sm:text-[36px] md:text-[42px] font-medium leading-tight mb-5'
                style={{ color: 'var(--color-primary-light)' }}
              >
                You are One Decision Away
                <br />
                <span
                  style={{
                    color: 'var(--color-primary-accent)',
                    fontStyle: 'italic',
                  }}
                >
                  from a Different Life
                </span>
              </h2>

              {/* Subtitle */}
              <p
                className='text-[15px] sm:text-[16px] leading-relaxed mb-10 max-w-xl mx-auto font-light'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                Stop waiting to feel &ldquo;ready.&rdquo; The individuals who
                transformed their lives started exactly where you are right now.
              </p>

              {/* Tags */}
              <div className='flex flex-wrap justify-center gap-2 mb-10'>
                {WHAT_YOU_LEARN.map((item) => (
                  <span
                    key={item}
                    className='cta-tag inline-flex items-center gap-2 text-[12.5px] px-3.5 py-1.5 rounded-full'
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      color: 'var(--color-primary-accent)',
                    }}
                  >
                    <svg
                      width='9'
                      height='9'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='var(--color-primary-muted)'
                      strokeWidth='3'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <polyline points='20 6 9 17 4 12' />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                <div className='cta-btn-primary w-full sm:w-auto'>
                  <Button
                    href='/courses'
                    size='lg'
                    variant='secondary'
                    className='w-full sm:w-auto'
                  >
                    Book a Free Exploration Call
                    <ArrowRightIcon size={18} />
                  </Button>
                </div>
                <Button
                  href='/courses'
                  size='lg'
                  variant='ghost'
                  className='w-full sm:w-auto'
                  style={{ color: 'var(--color-primary-accent)' }}
                >
                  Browse All Programs
                </Button>
              </div>

              {/* Trust line */}
              <p
                className='mt-7 text-[12px] tracking-wide'
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                🔒 Safe, judgment-free space &nbsp;·&nbsp; 100% confidential
                &nbsp;·&nbsp; Open to all individuals
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
