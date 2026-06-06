'use client'

import { useEffect, useRef } from 'react'
import SectionHeading from '@/components/ui/SectionHeading'
import { CheckIcon, ArrowRightIcon } from '@/components/ui/Icons'

const PAIN_POINTS = [
  'Feeling emotionally overwhelmed and stuck',
  'People-pleasing and losing yourself',
  'Carrying guilt, shame & generational pressure',
  'Unable to set boundaries without fear',
  'Low self-worth and lack of confidence',
]

const TRANSFORMATIONS = [
  'Emotional freedom and inner peace',
  'Healthy boundaries with confidence',
  'Released past pain & generational wounds',
  'Unshakeable self-worth and clarity',
  'Stepping into your most powerful self',
]

export default function TransformationSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null)

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
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        [data-animate].animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        [data-animate-delay="1"] { transition-delay: 0.1s; }
        [data-animate-delay="2"] { transition-delay: 0.2s; }
        [data-animate-delay="3"] { transition-delay: 0.35s; }

        .list-item-anim {
          opacity: 0;
          transform: translateX(-10px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .list-item-anim.animate-in {
          opacity: 1;
          transform: translateX(0);
        }

        .journey-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .journey-card:hover {
          transform: translateY(-4px);
        }

        .cta-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: gap 0.2s ease, border-color 0.2s ease;
        }
        .cta-link:hover { gap: 14px; }

        .arrow-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
        }
        @media (max-width: 768px) {
          .arrow-divider { transform: rotate(90deg); }
        }
      `}</style>

      <section
        ref={sectionRef}
        className='py-20 px-4 sm:px-6'
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <div className='max-w-6xl mx-auto'>
          {/* Heading */}
          <div data-animate data-animate-delay='1'>
            <SectionHeading
              eyebrow='The Journey'
              title='From Pain to Power'
              subtitle='You deserve to move from where you are to where you are meant to be.'
              center
            />
          </div>

          {/* Cards */}
          <div className='mt-14 grid md:grid-cols-[1fr_auto_1fr] gap-4 max-w-4xl mx-auto items-center'>
            {/* Before card */}
            <div
              data-animate
              data-animate-delay='2'
              className='journey-card rounded-xl p-7 h-full'
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-surface-border)',
              }}
            >
              <div className='flex items-center gap-3 mb-6'>
                <div
                  className='w-9 h-9 rounded-full flex items-center justify-center shrink-0'
                  style={{
                    backgroundColor: 'var(--color-primary-light)',
                    border: '1px solid var(--color-surface-border)',
                  }}
                >
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='var(--color-primary-muted)'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
                    <line
                      x1='9'
                      y1='9'
                      x2='15'
                      y2='15'
                      stroke='var(--color-primary-muted)'
                      strokeWidth='2'
                    />
                    <line
                      x1='15'
                      y1='9'
                      x2='9'
                      y2='15'
                      stroke='var(--color-primary-muted)'
                      strokeWidth='2'
                    />
                  </svg>
                </div>
                <h3
                  className='font-serif text-[18px] font-medium'
                  style={{ color: 'var(--color-text)' }}
                >
                  Where You Are Now
                </h3>
              </div>
              <ul className='space-y-3'>
                {PAIN_POINTS.map((point, i) => (
                  <li
                    key={point}
                    className='list-item-anim animate-in flex items-start gap-3 text-[13.5px] font-light'
                    style={{
                      color: 'var(--color-primary)',
                      transitionDelay: `${0.2 + i * 0.08}s`,
                    }}
                  >
                    <span
                      className='w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5'
                      style={{
                        backgroundColor: 'var(--color-primary-light)',
                        border: '1px solid var(--color-surface-border)',
                      }}
                    >
                      <svg
                        width='8'
                        height='8'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='var(--color-primary-muted)'
                        strokeWidth='3'
                        strokeLinecap='round'
                      >
                        <line x1='18' y1='6' x2='6' y2='18' />
                        <line x1='6' y1='6' x2='18' y2='18' />
                      </svg>
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Arrow divider */}
            <div className='arrow-divider hidden md:flex'>
              <svg
                width='36'
                height='36'
                viewBox='0 0 24 24'
                fill='none'
                stroke='var(--color-primary-muted)'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='5' y1='12' x2='19' y2='12' />
                <polyline points='12 5 19 12 12 19' />
              </svg>
            </div>

            {/* After card */}
            <div
              data-animate
              data-animate-delay='3'
              className='journey-card rounded-xl p-7 relative overflow-hidden h-full'
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-surface-border)',
              }}
            >
              {/* Decorative blob */}
              <div
                className='absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2'
                style={{
                  backgroundColor: 'var(--color-primary-light)',
                  opacity: 0.5,
                }}
              />
              <div className='flex items-center gap-3 mb-6 relative'>
                <div
                  className='w-9 h-9 rounded-full flex items-center justify-center shrink-0'
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-surface-border)',
                  }}
                >
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='var(--color-primary)'
                    strokeWidth='1.8'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
                  </svg>
                </div>
                <h3
                  className='font-serif text-[18px] font-medium'
                  style={{ color: 'var(--color-text)' }}
                >
                  Where You Are Going
                </h3>
              </div>
              <ul className='space-y-3 relative'>
                {TRANSFORMATIONS.map((item, i) => (
                  <li
                    key={item}
                    className='list-item-anim animate-in flex items-start gap-3 text-[13.5px] font-light'
                    style={{
                      color: 'var(--color-primary-mid)',
                      transitionDelay: `${0.35 + i * 0.08}s`,
                    }}
                  >
                    <span
                      className='w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5'
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        border: '1px solid var(--color-primary)',
                      }}
                    >
                      <CheckIcon
                        size={10}
                        style={{ color: 'var(--color-bg)' }}
                      />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div
            data-animate
            data-animate-delay='3'
            className='flex justify-center mt-10'
          >
            <a
              href='/courses'
              className='cta-link text-[14px] font-semibold no-underline'
              style={{
                color: 'var(--color-primary)',
                borderBottom: '1px solid var(--color-surface-border)',
                paddingBottom: '2px',
              }}
            >
              Start your journey today
              <ArrowRightIcon size={17} />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
