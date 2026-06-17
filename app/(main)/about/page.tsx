'use client'

import { useEffect, useRef } from 'react'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'
import {
  ShieldIcon,
  HeartIcon,
  SparkleIcon,
  ArrowRightIcon,
} from '@/components/ui/Icons'
import Image from 'next/image'

const CERTIFICATIONS = [
  'Puja Punnet Life by Design',
  'Coaching Mastery Certification',
  'Coaching Certification',
]

const VALUES = [
  {
    icon: (
      <HeartIcon size={22} style={{ color: 'var(--color-primary-muted)' }} />
    ),
    title: 'Compassion',
    desc: 'A deeply safe and non-judgmental space where you are fully seen and heard.',
  },
  {
    icon: <ShieldIcon size={22} style={{ color: 'var(--color-primary)' }} />,
    title: 'Empowerment',
    desc: 'Equipping you with real tools and practices to reclaim your worth.',
  },
  {
    icon: (
      <SparkleIcon size={22} style={{ color: 'var(--color-primary-mid)' }} />
    ),
    title: 'Transformation',
    desc: 'Going beyond surface-level — creating deep, lasting change from within.',
  },
]

const JOURNEY_STEPS = [
  {
    year: 'The Beginning',
    title: 'My Own Pain',
    desc: 'Like many of the people I work with, I experienced emotional overwhelm, people-pleasing, and the silent pressure to hold everything together.',
  },
  {
    year: 'The Turning Point',
    title: 'Choosing Myself',
    desc: 'Through deep inner work, therapy, and transformational coaching, I made the courageous decision to stop surviving and start truly living.',
  },
  {
    year: 'The Learning',
    title: 'Becoming a Coach',
    desc: 'I invested in my growth, earned multiple coaching certifications, and discovered my true calling — helping individuals do the same inner work I had done.',
  },
  {
    year: 'Today',
    title: 'Your Guide',
    desc: 'Now I walk alongside people on their own journeys — from pain to power, from self-doubt to unshakeable confidence, from silence to voice.',
  },
]

const CERTIFICATES = [
  { id: 1, title: 'Puja Punnet Life by Design', src: '' },
  { id: 2, title: 'Coaching Mastery Certification', src: '' },
  { id: 3, title: 'Coaching Certification', src: '' },
]

function useScrollAnim(selector: string, dep?: any) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const els = ref.current?.querySelectorAll(selector)
    if (!els?.length) return
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('anim-in')
            observer.unobserve(e.target)
          }
        }),
      { threshold: 0.08 },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep])
  return ref
}

export default function AboutPage() {
  const heroRef = useScrollAnim('[data-anim]')
  const storyRef = useScrollAnim('[data-anim]')
  const timeRef = useScrollAnim('[data-anim]')
  const valRef = useScrollAnim('[data-anim]')
  const certRef = useScrollAnim('[data-anim]')
  const ctaRef = useScrollAnim('[data-anim]')

  return (
    <>
      <style>{`
        [data-anim] {
          opacity: 0; transform: translateY(22px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        [data-anim].anim-in { opacity: 1; transform: translateY(0); }
        [data-delay="1"] { transition-delay: 0.1s; }
        [data-delay="2"] { transition-delay: 0.2s; }
        [data-delay="3"] { transition-delay: 0.3s; }
        [data-delay="4"] { transition-delay: 0.4s; }
        [data-delay="5"] { transition-delay: 0.5s; }
        [data-delay="6"] { transition-delay: 0.6s; }

        @keyframes float-about { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin-slow { to{transform:rotate(360deg)} }
        .about-circle-float { animation: float-about 6s ease-in-out infinite; }
        .about-spin { animation: spin-slow 22s linear infinite; }

        .about-hero   { background-color: var(--color-surface); border-bottom: 1px solid var(--color-surface-border); }
        .about-white  { background-color: var(--color-bg); }
        .about-tinted { background-color: var(--color-surface); }
        .about-cta    { background-color: var(--color-primary-dark); }

        .about-eyebrow {
          display: inline-block;
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.13em;
          color: var(--color-primary);
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          padding: 5px 14px; border-radius: 9999px; margin-bottom: 20px;
        }

        .timeline-step { display:flex; gap:20px; align-items:flex-start; }
        .timeline-dot {
          width:40px; height:40px; border-radius:50%; flex-shrink:0;
          background-color:var(--color-primary); color:var(--color-bg);
          display:flex; align-items:center; justify-content:center;
          font-size:13px; font-weight:600;
        }
        .timeline-line {
          width:2px; min-height:32px; flex:1;
          background-color:var(--color-surface-border); margin-top:8px; margin-left:19px;
        }
        .timeline-card {
          background-color:var(--color-bg);
          border:1px solid var(--color-surface-border);
          border-radius:12px; padding:20px 22px; flex:1; margin-bottom:8px;
        }

        .value-card {
          background-color:var(--color-surface);
          border:1px solid var(--color-surface-border);
          border-radius:12px; padding:28px; text-align:center;
          transition:transform 0.3s ease, box-shadow 0.3s ease;
        }
        .value-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(44,34,24,0.10); }
        .value-icon-wrap {
          width:48px; height:48px; border-radius:10px;
          background-color:var(--color-bg);
          border:1px solid var(--color-surface-border);
          display:flex; align-items:center; justify-content:center;
          margin:0 auto 16px;
        }

        .cert-photo-card {
          background-color:var(--color-bg);
          border:1px solid var(--color-surface-border);
          border-radius:12px; overflow:hidden;
          transition:transform 0.3s ease, box-shadow 0.3s ease;
        }
        .cert-photo-card:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(44,34,24,0.10); }
        .cert-photo-placeholder {
          width:100%; aspect-ratio:4/3;
          background-color:var(--color-surface);
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          gap:8px; border-bottom:1px solid var(--color-surface-border);
        }
        .cert-photo-img {
          width:100%; aspect-ratio:4/3; object-fit:cover;
          border-bottom:1px solid var(--color-surface-border);
        }
      `}</style>

      {/* ── Hero ── */}
      <section className='about-hero pt-28 pb-20 px-4 sm:px-6 relative overflow-hidden'>
        <div
          className='absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl pointer-events-none'
          style={{
            backgroundColor: 'var(--color-primary-light)',
            opacity: 0.5,
          }}
        />
        <div ref={heroRef} className='max-w-4xl mx-auto text-center relative'>
          <span data-anim data-delay='1' className='about-eyebrow'>
            Meet Your Coach
          </span>
          <h1
            data-anim
            data-delay='2'
            className='font-serif text-[44px] sm:text-[56px] font-medium leading-tight mb-6'
            style={{ color: 'var(--color-text)' }}
          >
            Hi, I am{' '}
            <span
              style={{ color: 'var(--color-primary)', fontStyle: 'italic' }}
            >
              Masuma
            </span>
          </h1>
          <p
            data-anim
            data-delay='3'
            className='text-[17px] sm:text-[19px] leading-relaxed max-w-2xl mx-auto font-light'
            style={{ color: 'var(--color-primary)' }}
          >
            Life Transformational Coach · Helping individuals heal their past,
            reclaim their worth, and rise into their power.
          </p>
        </div>
      </section>

      {/* ── Story ── */}
      <section className='about-white py-20 px-4 sm:px-6'>
        <div
          ref={storyRef}
          className='max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center'
        >
          {/* ✅ FIXED: Image visual */}
          <div
            data-anim
            data-delay='1'
            className='flex justify-center order-2 lg:order-1'
          >
            <div className='relative w-72 h-72 sm:w-80 sm:h-80'>
              {/* Spinning dashed ring */}
              <div
                className='about-spin absolute inset-0 rounded-4xl pointer-events-none'
                style={{
                  border: '1.5px dashed var(--color-primary-accent)',
                  transform: 'scale(1.13)',
                }}
              />
              {/* Floating image container */}
              <div
                className='about-circle-float relative w-full h-full rounded-3xl overflow-hidden z-10'
                style={{
                  border: '1.5px solid var(--color-surface-border)',
                }}
              >
                <Image
                  src='/masuma1.jpeg'
                  alt='Masuma – Life Transformational Coach'
                  fill
                  className='object-cover object-top'
                  sizes='(max-width: 640px) 288px, 320px'
                  priority
                />
              </div>

              {/* Badge */}
              <div
                className='absolute -bottom-4 -right-4 rounded-xl p-3.5 z-20'
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-surface-border)',
                  boxShadow: '0 4px 16px rgba(184,168,152,0.18)',
                }}
              >
                <p
                  className='text-[11px]'
                  style={{ color: 'var(--color-primary-muted)' }}
                >
                  Certified &amp;
                </p>
                <p
                  className='text-[14px] font-semibold'
                  style={{ color: 'var(--color-text)' }}
                >
                  Experienced
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='order-1 lg:order-2'>
            <div data-anim data-delay='1'>
              <SectionHeading
                eyebrow='My Story'
                title='From Overwhelm to Purpose'
              />
            </div>
            <div
              className='space-y-4 mt-4 font-light'
              style={{
                color: 'var(--color-primary-mid)',
                fontSize: '15.5px',
                lineHeight: '1.8',
              }}
            >
              <p data-anim data-delay='2'>
                My journey began with my own experiences of emotional overwhelm,
                people-pleasing, and the silent pressure to &ldquo;hold
                everything together.&rdquo; I know what it feels like to lose
                yourself, to shrink to make others comfortable, to carry pain
                you were never meant to carry.
              </p>
              <p data-anim data-delay='3'>
                Through deep inner work, healing, and learning, I transformed my
                pain into purpose. I discovered that healing is not just
                possible — it&apos;s your birthright.
              </p>
              <p data-anim data-delay='4'>
                Now I help people do the same. This isn&apos;t just coaching.
                It&apos;s a journey of emotional freedom, self-respect, and
                generational healing.
              </p>
            </div>

            {/* Certs */}
            <div
              data-anim
              data-delay='5'
              className='mt-8 rounded-xl p-5'
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-surface-border)',
              }}
            >
              <p
                className='text-[10.5px] font-semibold uppercase tracking-widest mb-3'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                Certifications
              </p>
              <ul className='space-y-2.5'>
                {CERTIFICATIONS.map((c) => (
                  <li
                    key={c}
                    className='flex items-center gap-2.5 text-[14px] font-light'
                    style={{ color: 'var(--color-primary-mid)' }}
                  >
                    <ShieldIcon
                      size={13}
                      style={{ color: 'var(--color-primary)', flexShrink: 0 }}
                    />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className='about-tinted py-20 px-4 sm:px-6'>
        <div ref={timeRef} className='max-w-4xl mx-auto'>
          <div data-anim data-delay='1'>
            <SectionHeading
              eyebrow='The Journey'
              title='How I Got Here'
              center
            />
          </div>
          <div className='mt-12'>
            {JOURNEY_STEPS.map((step, i) => (
              <div key={i} data-anim data-delay={`${Math.min(i + 2, 6)}`}>
                <div className='timeline-step'>
                  <div className='flex flex-col items-center'>
                    <div className='timeline-dot'>{i + 1}</div>
                    {i < JOURNEY_STEPS.length - 1 && (
                      <div className='timeline-line' />
                    )}
                  </div>
                  <div className='timeline-card'>
                    <p
                      className='text-[10.5px] font-semibold uppercase tracking-widest mb-1'
                      style={{ color: 'var(--color-primary-muted)' }}
                    >
                      {step.year}
                    </p>
                    <h3
                      className='font-serif text-[18px] font-medium mb-2'
                      style={{ color: 'var(--color-text)' }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className='text-[14.5px] font-light leading-relaxed'
                      style={{ color: 'var(--color-primary-mid)' }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className='about-white py-20 px-4 sm:px-6'>
        <div ref={valRef} className='max-w-5xl mx-auto'>
          <div data-anim data-delay='1'>
            <SectionHeading
              eyebrow='What I Stand For'
              title='My Coaching Values'
              center
            />
          </div>
          <div className='mt-10 grid sm:grid-cols-3 gap-6'>
            {VALUES.map((v, i) => (
              <div
                key={v.title}
                data-anim
                data-delay={`${i + 2}`}
                className='value-card'
              >
                <div className='value-icon-wrap'>{v.icon}</div>
                <h3
                  className='font-serif text-[18px] font-medium mb-2'
                  style={{ color: 'var(--color-text)' }}
                >
                  {v.title}
                </h3>
                <p
                  className='text-[13.5px] font-light leading-relaxed'
                  style={{ color: 'var(--color-primary)' }}
                >
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certificates ── */}
      <section className='about-tinted py-20 px-4 sm:px-6'>
        <div ref={certRef} className='max-w-5xl mx-auto'>
          <div data-anim data-delay='1' className='text-center mb-12'>
            <span
              className='about-eyebrow'
              style={{ marginBottom: '16px', display: 'inline-block' }}
            >
              Credentials
            </span>
            <h2
              className='font-serif text-[30px] sm:text-[36px] font-medium'
              style={{ color: 'var(--color-text)' }}
            >
              My Certifications
            </h2>
            <p
              className='text-[15px] font-light mt-3 max-w-xl mx-auto'
              style={{ color: 'var(--color-primary)' }}
            >
              Each certification represents a commitment to excellence and
              continuous growth in transformational coaching.
            </p>
          </div>

          <div className='grid sm:grid-cols-3 gap-6'>
            {CERTIFICATES.map((cert, i) => (
              <div
                key={cert.id}
                data-anim
                data-delay={`${i + 2}`}
                className='cert-photo-card'
              >
                {cert.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cert.src}
                    alt={cert.title}
                    className='cert-photo-img'
                  />
                ) : (
                  <div className='cert-photo-placeholder'>
                    <ShieldIcon
                      size={32}
                      style={{ color: 'var(--color-primary-muted)' }}
                    />
                    <p
                      className='text-[12px] font-light'
                      style={{ color: 'var(--color-primary-muted)' }}
                    >
                      Add photo here
                    </p>
                  </div>
                )}
                <div className='p-4'>
                  <p
                    className='text-[10px] font-semibold uppercase tracking-widest mb-1'
                    style={{ color: 'var(--color-primary-muted)' }}
                  >
                    Certificate {cert.id}
                  </p>
                  <p
                    className='text-[14px] font-medium'
                    style={{ color: 'var(--color-text)' }}
                  >
                    {cert.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className='about-cta py-16 px-4 sm:px-6'>
        <div ref={ctaRef} className='max-w-3xl mx-auto text-center'>
          <h2
            data-anim
            data-delay='1'
            className='font-serif text-[32px] sm:text-[38px] font-medium mb-4'
            style={{ color: 'var(--color-primary-light)' }}
          >
            Ready to Work Together?
          </h2>
          <p
            data-anim
            data-delay='2'
            className='text-[16px] mb-8 leading-relaxed font-light'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            Let&apos;s start with a free exploration call where we&apos;ll talk
            about where you are and where you want to go.
          </p>
          <div data-anim data-delay='3'>
            <Button href='/contact' size='lg' variant='secondary'>
              Book a Free Exploration Call <ArrowRightIcon size={18} />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
