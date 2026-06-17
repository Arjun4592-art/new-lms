'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SectionHeading from '@/components/ui/SectionHeading'
import { ArrowRightIcon, ShieldIcon, HeartIcon } from '@/components/ui/Icons'

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
            entry.target.classList.add('is-visible')
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
        @keyframes float-preview {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes slow-spin {
          to { transform: rotate(360deg); }
        }
        .animate-float     { animation: float-preview 6s ease-in-out infinite; }
        .animate-slow-spin { animation: slow-spin 22s linear infinite; }

        /* Scroll-reveal */
        [data-animate] {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        [data-animate].is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        [data-animate][data-animate-delay="1"].is-visible { transition-delay: 0.1s; }
        [data-animate][data-animate-delay="2"].is-visible { transition-delay: 0.2s; }
        [data-animate][data-animate-delay="3"].is-visible { transition-delay: 0.3s; }
        [data-animate][data-animate-delay="4"].is-visible { transition-delay: 0.4s; }
        [data-animate][data-animate-delay="5"].is-visible { transition-delay: 0.5s; }
        [data-animate][data-animate-delay="6"].is-visible { transition-delay: 0.6s; }
      `}</style>

      <section ref={sectionRef} className='py-20 px-4 sm:px-6 bg-bg'>
        <div className='max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center'>
          {/* ── Visual side ── */}
          <div
            data-animate
            data-animate-delay='2'
            className='relative flex justify-center order-2 lg:order-1'
          >
            <div className='relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center'>
              {/* Spinning dashed ring */}
              <div className='animate-slow-spin absolute inset-0 rounded-full border border-dashed border-primary-accent scale-[1.14] pointer-events-none' />
              {/* Soft ring */}
              <div className='absolute inset-0 rounded-full border border-[#e8dfd0] scale-[1.04] pointer-events-none' />

              {/* ✅ Coach image — relative container with fill */}
              <div className='animate-float relative w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden z-10 border-2 border-surface shadow-[0_8px_32px_rgba(184,168,152,0.22)]'>
                <Image
                  src='/masuma.jpeg'
                  alt='Masuma – Life Transformational Coach'
                  fill
                  className='object-cover object-top'
                  sizes='(max-width: 640px) 288px, 320px'
                  priority
                />
              </div>

              {/* Float card — top right */}
              <div className='absolute -top-3 -right-4 sm:-right-8 rounded-xl p-3.5 z-20 bg-bg border border-surface shadow-[0_4px_16px_rgba(184,168,152,0.18)] min-w-[132px]'>
                <div className='w-7 h-7 rounded-full flex items-center justify-center mb-2 bg-surface'>
                  <ShieldIcon size={14} className='text-primary' />
                </div>
                <p className='text-[12px] font-semibold text-primary-dark'>
                  Certified Coach
                </p>
                <p className='text-[11px] text-primary-muted'>
                  3+ certifications
                </p>
              </div>

              {/* Float card — bottom left */}
              <div className='absolute -bottom-3 -left-4 sm:-left-8 rounded-xl p-3.5 z-20 bg-bg border border-surface shadow-[0_4px_16px_rgba(184,168,152,0.18)] min-w-[132px]'>
                <div className='w-7 h-7 rounded-full flex items-center justify-center mb-2 bg-surface'>
                  <HeartIcon size={14} className='text-primary-muted' />
                </div>
                <p className='text-[12px] font-semibold text-primary-dark'>
                  100+ People
                </p>
                <p className='text-[11px] text-primary-muted'>Transformed</p>
              </div>
            </div>
          </div>

          {/* ── Content side ── */}
          <div className='order-1 lg:order-2'>
            {/* Eyebrow */}
            <div
              data-animate
              data-animate-delay='1'
              className='inline-flex items-center gap-2 rounded-sm px-4 py-1.5 mb-5 bg-bg border border-surface'
            >
              <span className='w-1.5 h-1.5 rounded-full bg-primary-muted' />
              <span className='text-[10.5px] font-semibold tracking-widest uppercase text-primary'>
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
              className='text-[15px] leading-relaxed mt-4 mb-5 font-light text-primary-mid'
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
              className='text-[15px] leading-relaxed mb-8 font-light text-primary-mid'
            >
              This isn&apos;t just coaching. It&apos;s a journey of emotional
              freedom, self-respect, and generational healing.
            </p>

            {/* ✅ Certifications — opacity Tailwind se hataya, CSS se control ho raha hai */}
            <div
              data-animate
              data-animate-delay='5'
              className='rounded-lg p-5 mb-8 bg-surface border border-surface'
            >
              <p className='text-[10.5px] font-semibold uppercase tracking-widest mb-4 text-primary-muted'>
                Certifications
              </p>
              <ul className='space-y-3'>
                {CERTIFICATIONS.map((cert) => (
                  <li key={cert} className='flex items-center gap-2.5'>
                    <div className='w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-primary-light border border-surface'>
                      <ShieldIcon size={11} className='text-primary' />
                    </div>
                    <span className='text-[13.5px] font-light text-primary-mid'>
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
                className='inline-flex items-center gap-2 text-[14px] font-semibold no-underline text-primary border-b border-surface pb-0.5 transition-all duration-200 hover:gap-3.5'
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
