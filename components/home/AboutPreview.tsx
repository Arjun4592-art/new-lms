'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import SectionHeading from '@/components/ui/SectionHeading'
import {
  ArrowRightIcon,
  ShieldIcon,
  SparkleIcon,
  HeartIcon,
} from '@/components/ui/Icons'

const CERTIFICATIONS = [
  'Puja Punnet Life by Design',
  'Coaching Mastery Certification',
  'Coaching Certification',
]

export default function AboutPreview() {
  const sectionRef = useRef<HTMLDivElement>(null)

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
      { threshold: 0.12 },
    )
    els.forEach((el: Element) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        [data-animate] {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.65s ease, transform 0.65s ease;
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

        @keyframes float-about {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slow-spin {
          to { transform: rotate(360deg); }
        }
        .about-float { animation: float-about 6s ease-in-out infinite; }
        .about-spin-ring { animation: slow-spin 22s linear infinite; }

        .about-link-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: gap 0.2s ease, border-color 0.2s ease;
        }
        .about-link-cta:hover {
          gap: 14px;
        }

        .about-cert-item {
          opacity: 0;
          transform: translateX(-10px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .about-cert-item.animate-in {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      <section
        ref={sectionRef}
        className='py-20 px-4 sm:px-6'
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <div className='max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center'>
          {/* ── Visual side ── */}
          <div
            data-animate
            data-animate-delay='2'
            className='relative flex justify-center order-2 lg:order-1'
          >
            <div className='relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center'>
              {/* Spinning dashed ring */}
              <div
                className='about-spin-ring absolute inset-0 rounded-full pointer-events-none'
                style={{
                  border: '1.5px dashed var(--color-primary-accent)',
                  transform: 'scale(1.14)',
                }}
              />

              {/* Second soft ring */}
              <div
                className='absolute inset-0 rounded-full pointer-events-none'
                style={{
                  border: '1px solid var(--color-surface)',
                  transform: 'scale(1.04)',
                }}
              />

              {/* Main circle */}
              <div
                className='about-float relative w-72 h-72 sm:w-80 sm:h-80 rounded-full flex flex-col items-center justify-center gap-2 z-10'
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1.5px solid var(--color-surface-border)',
                }}
              >
                {/* Icon */}
                <div
                  className='w-12 h-12 rounded-full flex items-center justify-center mb-1'
                  style={{
                    backgroundColor: 'var(--color-primary-light)',
                    border: '1px solid var(--color-surface-border)',
                  }}
                >
                  <SparkleIcon
                    size={22}
                    style={{ color: 'var(--color-primary)' }}
                  />
                </div>
                <p
                  className='font-serif text-[22px] font-medium'
                  style={{ color: 'var(--color-text)' }}
                >
                  Masuma
                </p>
                <p
                  className='text-[12px] font-light tracking-wide text-center px-6'
                  style={{ color: 'var(--color-primary)' }}
                >
                  Life Transformational Coach
                </p>
              </div>

              {/* Float card — top right */}
              <div
                className='absolute -top-3 -right-4 sm:-right-8 rounded-xl p-3.5 z-20'
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-surface-border)',
                  boxShadow: '0 4px 16px rgba(184,168,152,0.18)',
                  minWidth: '132px',
                }}
              >
                <div
                  className='w-7 h-7 rounded-full flex items-center justify-center mb-2'
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <ShieldIcon
                    size={14}
                    style={{ color: 'var(--color-primary)' }}
                  />
                </div>
                <p
                  className='text-[12px] font-semibold'
                  style={{ color: 'var(--color-text)' }}
                >
                  Certified Coach
                </p>
                <p
                  className='text-[11px]'
                  style={{ color: 'var(--color-primary-muted)' }}
                >
                  3+ certifications
                </p>
              </div>

              {/* Float card — bottom left */}
              <div
                className='absolute -bottom-3 -left-4 sm:-left-8 rounded-xl p-3.5 z-20'
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-surface-border)',
                  boxShadow: '0 4px 16px rgba(184,168,152,0.18)',
                  minWidth: '132px',
                }}
              >
                <div
                  className='w-7 h-7 rounded-full flex items-center justify-center mb-2'
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <HeartIcon
                    size={14}
                    style={{ color: 'var(--color-primary-muted)' }}
                  />
                </div>
                <p
                  className='text-[12px] font-semibold'
                  style={{ color: 'var(--color-text)' }}
                >
                  500+ People
                </p>
                <p
                  className='text-[11px]'
                  style={{ color: 'var(--color-primary-muted)' }}
                >
                  Transformed
                </p>
              </div>
            </div>
          </div>

          {/* ── Content side ── */}
          <div className='order-1 lg:order-2'>
            {/* Eyebrow */}
            <div
              data-animate
              data-animate-delay='1'
              className='inline-flex items-center gap-2 rounded-sm px-4 py-1.5 mb-5'
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-surface-border)',
              }}
            >
              <span
                className='w-1.5 h-1.5 rounded-full'
                style={{ backgroundColor: 'var(--color-primary-muted)' }}
              />
              <span
                className='text-[10.5px] font-semibold tracking-widest uppercase'
                style={{ color: 'var(--color-primary)' }}
              >
                Meet Your Coach
              </span>
            </div>

            <SectionHeading
              eyebrow=''
              title='Hi, I am Masuma'
              subtitle='Life Transformational Coach helping individuals heal their past, reclaim their worth, and rise into their power.'
            />

            <p
              data-animate
              data-animate-delay='3'
              className='text-[15px] leading-relaxed mt-4 mb-5 font-light'
              style={{ color: 'var(--color-primary-mid)' }}
            >
              My journey began with my own experiences of emotional overwhelm,
              people-pleasing, and silent pressure to &ldquo;hold everything
              together.&rdquo; Through deep inner work, healing, and learning, I
              transformed my pain into purpose — and now I help people do the
              same.
            </p>

            <p
              data-animate
              data-animate-delay='4'
              className='text-[15px] leading-relaxed mb-8 font-light'
              style={{ color: 'var(--color-primary-mid)' }}
            >
              This isn&apos;t just coaching. It&apos;s a journey of emotional
              freedom, self-respect, and generational healing.
            </p>

            {/* Certifications */}
            <div
              data-animate
              data-animate-delay='5'
              className='rounded-lg p-5 mb-8'
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-surface-border)',
              }}
            >
              <p
                className='text-[10.5px] font-semibold uppercase tracking-widest mb-4'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                Certifications
              </p>
              <ul className='space-y-3'>
                {CERTIFICATIONS.map((cert, i) => (
                  <li
                    key={cert}
                    className='about-cert-item animate-in flex items-center gap-2.5'
                    style={{ transitionDelay: `${0.55 + i * 0.1}s` }}
                  >
                    <div
                      className='w-5 h-5 rounded-full flex items-center justify-center shrink-0'
                      style={{
                        backgroundColor: 'var(--color-primary-light)',
                        border: '1px solid var(--color-surface-border)',
                      }}
                    >
                      <ShieldIcon
                        size={11}
                        style={{ color: 'var(--color-primary)' }}
                      />
                    </div>
                    <span
                      className='text-[13.5px] font-light'
                      style={{ color: 'var(--color-primary-mid)' }}
                    >
                      {cert}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Link */}
            <div data-animate data-animate-delay='6'>
              <Link
                href='/about'
                className='about-link-cta text-[14px] font-semibold no-underline'
                style={{
                  color: 'var(--color-primary)',
                  borderBottom: '1px solid var(--color-surface-border)',
                  paddingBottom: '2px',
                }}
              >
                Read my full story
                <ArrowRightIcon size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
