'use client'

import { useEffect, useRef } from 'react'
import Button from '@/components/ui/Button'
import { ArrowRightIcon, SparkleIcon } from '@/components/ui/Icons'

const transformationItems = [
  'Release emotional pain & past wounds',
  'Set boundaries without fear or guilt',
  'Build unshakeable self-worth',
  'Step into your most powerful self',
]

const avatarLetters = ['S', 'P', 'R', 'M', 'A']

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('[data-animate]')
    if (!els) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        [data-animate] {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        [data-animate].animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        [data-animate-delay="1"] { transition-delay: 0.1s; }
        [data-animate-delay="2"] { transition-delay: 0.2s; }
        [data-animate-delay="3"] { transition-delay: 0.3s; }
        [data-animate-delay="4"] { transition-delay: 0.4s; }
        [data-animate-delay="5"] { transition-delay: 0.5s; }
        [data-animate-delay="6"] { transition-delay: 0.6s; }
        [data-animate-delay="7"] { transition-delay: 0.7s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .float-card {
          animation: float 6s ease-in-out infinite;
        }

        /* check-item: start hidden, animate in via JS */
        .check-item {
          opacity: 0;
          transform: translateX(-12px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .check-item.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .avatar-stack > div {
          transition: transform 0.3s ease;
        }
        .avatar-stack:hover > div {
          transform: translateX(4px);
        }
      `}</style>

      <section
        ref={sectionRef}
        className='relative min-h-screen flex items-center justify-center overflow-hidden pt-16'
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        {/* Background blobs */}
        <div
          className='absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl pointer-events-none'
          style={{
            backgroundColor:
              'color-mix(in srgb, var(--color-primary-light) 40%, transparent)',
          }}
        />
        <div
          className='absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none'
          style={{
            backgroundColor:
              'color-mix(in srgb, var(--color-surface-hover) 30%, transparent)',
          }}
        />
        <div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full blur-3xl pointer-events-none'
          style={{
            backgroundColor:
              'color-mix(in srgb, var(--color-surface) 40%, transparent)',
          }}
        />

        <div className='relative max-w-6xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-14 items-center'>
          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Eyebrow badge */}
            <div
              data-animate
              data-animate-delay='1'
              className='inline-flex items-center gap-2 rounded-sm px-4 py-1.5 mb-8'
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-surface-border)',
              }}
            >
              <SparkleIcon
                size={13}
                style={{ color: 'var(--color-primary-muted)' }}
              />
              <span
                className='text-[11.5px] font-semibold tracking-widest uppercase'
                style={{ color: 'var(--color-primary-mid)' }}
              >
                Transformational Life Coaching
              </span>
            </div>

            {/* Headline */}
            <h1
              data-animate
              data-animate-delay='2'
              className='font-serif text-[44px] sm:text-[52px] lg:text-[58px] font-medium leading-[1.15] mb-6'
              style={{ color: 'var(--color-text)' }}
            >
              Turn Your{' '}
              <span className='relative inline-block'>
                <span
                  className='relative z-10 italic'
                  style={{ color: 'var(--color-primary)' }}
                >
                  Pain
                </span>
                <svg
                  className='absolute -bottom-1 left-0 w-full'
                  viewBox='0 0 200 12'
                  fill='none'
                >
                  <path
                    d='M2 9 Q100 2 198 9'
                    stroke='var(--color-surface-hover)'
                    strokeWidth='3'
                    strokeLinecap='round'
                  />
                </svg>
              </span>{' '}
              Into{' '}
              <span
                className='italic'
                style={{ color: 'var(--color-primary-mid)' }}
              >
                Power.
              </span>
            </h1>

            {/* Subheadlines */}
            <p
              data-animate
              data-animate-delay='3'
              className='text-[17px] sm:text-[18px] leading-relaxed mb-4 font-light'
              style={{ color: 'var(--color-primary-mid)' }}
            >
              Heal, Grow, and Step Into the Strongest Version Of You.
            </p>
            <p
              data-animate
              data-animate-delay='4'
              className='text-[15px] leading-relaxed mb-10 max-w-lg font-light'
              style={{ color: 'var(--color-primary)' }}
            >
              A safe, supportive space for individuals to release emotional
              pain, set healthy boundaries, and create a life rooted in
              confidence, clarity, and self-worth.
            </p>

            {/* CTAs */}
            <div
              data-animate
              data-animate-delay='5'
              className='flex flex-wrap gap-4'
            >
              <Button href='/contact' size='lg' className='shadow-lg'>
                Book a Free Exploration Call
                <ArrowRightIcon size={18} />
              </Button>
              <Button href='/courses' variant='outline' size='lg'>
                Explore Programs
              </Button>
            </div>

            {/* Social proof */}
            <div
              data-animate
              data-animate-delay='6'
              className='mt-10 flex items-center gap-6'
            >
              <div className='flex -space-x-2 avatar-stack'>
                {avatarLetters.map((l, i) => (
                  <div
                    key={i}
                    className='w-9 h-9 rounded-full border-2 flex items-center justify-center text-[11px] font-semibold'
                    style={{
                      borderColor: 'var(--color-bg)',
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-bg)',
                      opacity: 0.6 + i * 0.08,
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <p
                  className='text-[13.5px] font-semibold'
                  style={{ color: 'var(--color-text)' }}
                >
                  100+ people transformed
                </p>
                <div className='flex items-center gap-0.5 mt-0.5'>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      width='13'
                      height='13'
                      viewBox='0 0 24 24'
                      fill='var(--color-primary-muted)'
                    >
                      <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
                    </svg>
                  ))}
                  <span
                    className='text-[12px] ml-1'
                    style={{ color: 'var(--color-primary-muted)' }}
                  >
                    5.0 rating
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT CARD ── */}
          <div
            data-animate
            data-animate-delay='4'
            className='relative flex justify-center'
          >
            <div className='relative w-full max-w-105 float-card'>
              {/* Decorative offset border */}
              <div
                className='absolute inset-0 translate-x-3 translate-y-3 rounded-sm pointer-events-none'
                style={{ border: '1px solid var(--color-surface-border)' }}
              />

              {/* Card body */}
              <div
                className='relative rounded-sm p-8'
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-surface)',
                }}
              >
                {/* Accent line */}
                <div
                  className='w-10 h-0.5 mb-6 mx-auto'
                  style={{ backgroundColor: 'var(--color-primary-muted)' }}
                />

                {/* Icon */}
                <div
                  className='w-14 h-14 rounded-full flex items-center justify-center mb-5 mx-auto'
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-surface-border)',
                  }}
                >
                  <SparkleIcon
                    size={24}
                    style={{ color: 'var(--color-primary)' }}
                  />
                </div>

                {/* Card heading */}
                <h3
                  className='font-serif text-[22px] font-medium text-center mb-2'
                  style={{ color: 'var(--color-text)' }}
                >
                  Your Transformation Awaits
                </h3>
                <p
                  className='text-[14px] text-center mb-7 leading-relaxed font-light'
                  style={{ color: 'var(--color-primary)' }}
                >
                  Join hundreds of people who have already reclaimed their
                  confidence and inner strength.
                </p>

                {/* Checklist — animated via IntersectionObserver */}
                <CheckList items={transformationItems} />

                {/* Footer */}
                <div
                  className='mt-7 pt-6 text-center'
                  style={{ borderTop: '1px solid var(--color-surface)' }}
                >
                  <div className='flex items-center justify-center gap-2 mb-1'>
                    <span className='relative flex h-2 w-2'>
                      <span
                        className='animate-ping absolute inline-flex h-full w-full rounded-full opacity-75'
                        style={{
                          backgroundColor: 'var(--color-primary-muted)',
                        }}
                      />
                      <span
                        className='relative inline-flex rounded-full h-2 w-2'
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      />
                    </span>
                    <p
                      className='text-[11px] uppercase tracking-widest'
                      style={{ color: 'var(--color-primary-muted)' }}
                    >
                      Only 5 spots open
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* Separate component so check-items animate correctly on mount */
function CheckList({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.check-item')
    if (!els) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className='space-y-3.5'>
      {items.map((item, i) => (
        <div
          key={item}
          className='check-item flex items-center gap-3'
          style={{ transitionDelay: `${0.1 + i * 0.12}s` }}
        >
          <div
            className='w-5 h-5 rounded-full flex items-center justify-center shrink-0'
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-surface-border)',
            }}
          >
            <svg
              width='9'
              height='9'
              viewBox='0 0 24 24'
              fill='none'
              stroke='var(--color-primary)'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <polyline points='20 6 9 17 4 12' />
            </svg>
          </div>
          <span
            className='text-[14px] font-light'
            style={{ color: 'var(--color-primary-mid)' }}
          >
            {item}
          </span>
        </div>
      ))}
    </div>
  )
}
