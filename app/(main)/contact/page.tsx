'use client'

import { useEffect, useRef, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import {
  MailIcon,
  InstagramIcon,
  YoutubeIcon,
  WhatsAppIcon,
  ArrowRightIcon,
} from '@/components/ui/Icons'

const iconStyle = (color: string): React.CSSProperties => ({ color })

const CONTACT_ITEMS = [
  {
    icon: <MailIcon size={20} style={iconStyle('var(--color-primary)')} />,
    label: 'Email',
    value: 'masuma26coach@gmail.com',
    href: 'mailto:masuma26coach@gmail.com',
  },
  {
    icon: <InstagramIcon size={20} style={iconStyle('#E1306C')} />,
    label: 'Instagram',
    value: '@masuma_life_coach',
    href: 'https://instagram.com/masuma_life_coach',
  },
  {
    icon: <YoutubeIcon size={20} style={iconStyle('#FF0000')} />,
    label: 'YouTube',
    value: 'MasumaLifeCoach',
    href: 'https://www.youtube.com/@MasumaLifeCoach',
  },
  {
    icon: <WhatsAppIcon size={20} style={iconStyle('#25D366')} />,
    label: 'WhatsApp',
    value: 'Message on WhatsApp',
    href: 'https://wa.me/',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    interest: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [programmes, setProgrammes] = useState<string[]>([])

  const heroRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)

  function setupObserver(ref: React.RefObject<HTMLDivElement | null>) {
    const els = ref.current?.querySelectorAll('[data-anim]')
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
  }

  // Hero + info — once on mount
  useEffect(() => {
    const cleanups = [setupObserver(heroRef), setupObserver(infoRef)]
    return () => cleanups.forEach((fn) => fn?.())
  }, [])

  // Form — re-run when submitted changes so fresh elements get observed
  useEffect(() => {
    const cleanup = setupObserver(formRef)
    return () => cleanup?.()
  }, [submitted])

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const q = query(collection(db, 'courses'), orderBy('createdAt'))
        const snapshot = await getDocs(q)
        setProgrammes(
          snapshot.docs
            .filter((doc) => doc.data().published === true)
            .map((doc) => doc.data().title as string),
        )
      } catch (err) {
        console.error('Courses fetch error:', err)
      }
    }
    fetchProgrammes()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Failed to submit')
      setSubmitted(true)
    } catch (err) {
      console.error('Contact form submit error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        [data-anim] {
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        [data-anim].anim-in { opacity: 1; transform: translateY(0); }
        [data-anim][data-delay="1"] { transition-delay: 0.1s; }
        [data-anim][data-delay="2"] { transition-delay: 0.2s; }
        [data-anim][data-delay="3"] { transition-delay: 0.3s; }
        [data-anim][data-delay="4"] { transition-delay: 0.4s; }
        [data-anim][data-delay="5"] { transition-delay: 0.5s; }

        .contact-hero {
          background-color: var(--color-surface);
          border-bottom: 1px solid var(--color-surface-border);
        }
        .contact-eyebrow {
          display: inline-block;
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.13em;
          color: var(--color-primary);
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          padding: 5px 14px; border-radius: 9999px; margin-bottom: 20px;
        }
        .contact-main { background-color: var(--color-bg); }
        .contact-label {
          display: block; font-size: 13px; font-weight: 600;
          color: var(--color-primary-mid); margin-bottom: 6px;
        }
        .contact-input {
          width: 100%; padding: 12px 16px;
          border: 1px solid var(--color-surface-border);
          border-radius: 10px; font-size: 14px;
          color: var(--color-text);
          background-color: var(--color-bg);
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .contact-input::placeholder { color: var(--color-primary-muted); }
        .contact-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(122,106,88,0.12);
        }
        .contact-submit {
          width: 100%; padding: 14px;
          background-color: var(--color-primary);
          color: var(--color-bg);
          font-size: 14px; font-weight: 600; font-family: var(--font-sans);
          border: none; border-radius: 10px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background-color 0.2s, box-shadow 0.2s;
          box-shadow: 0 6px 20px rgba(122,106,88,0.22);
          letter-spacing: 0.04em; text-transform: uppercase;
        }
        .contact-submit:hover { background-color: var(--color-primary-hover); }
        .contact-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .contact-link-item {
          display: flex; align-items: center; gap: 16px;
          padding: 14px 16px;
          background-color: var(--color-surface);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; text-decoration: none;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .contact-link-item:hover {
          border-color: var(--color-primary);
          box-shadow: 0 4px 16px rgba(122,106,88,0.12);
          transform: translateY(-2px);
        }
        .contact-link-icon {
          width: 44px; height: 44px;
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .contact-link-label {
          font-size: 10.5px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--color-primary-muted);
        }
        .contact-link-value {
          font-size: 14px; font-weight: 500;
          color: var(--color-text); transition: color 0.2s;
        }
        .contact-link-item:hover .contact-link-value { color: var(--color-primary); }
        .free-call-card {
          background-color: var(--color-primary-dark);
          border-radius: 12px; padding: 28px;
        }
        .free-call-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background-color: var(--color-bg);
          color: var(--color-primary-dark);
          font-weight: 600; font-size: 13.5px;
          padding: 10px 20px; border-radius: 8px;
          text-decoration: none; transition: background-color 0.2s;
        }
        .free-call-btn:hover { background-color: var(--color-surface); }
        .success-card {
          background-color: var(--color-surface);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; padding: 40px 28px; text-align: center;
        }
      `}</style>

      {/* ── Hero ── */}
      <section className='contact-hero pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden'>
        <div
          className='absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none'
          style={{
            backgroundColor: 'var(--color-primary-light)',
            opacity: 0.4,
          }}
        />
        <div ref={heroRef} className='max-w-3xl mx-auto text-center relative'>
          <span data-anim data-delay='1' className='contact-eyebrow'>
            Get In Touch
          </span>
          <h1
            data-anim
            data-delay='2'
            className='font-serif text-[40px] sm:text-[52px] font-medium leading-tight mb-5'
            style={{ color: 'var(--color-text)' }}
          >
            Let&apos;s Start a{' '}
            <span
              style={{ color: 'var(--color-primary)', fontStyle: 'italic' }}
            >
              Conversation
            </span>
          </h1>
          <p
            data-anim
            data-delay='3'
            className='text-[17px] leading-relaxed font-light'
            style={{ color: 'var(--color-primary)' }}
          >
            Whether you have questions about a programme or just want to reach
            out — I&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ── Main ── */}
      <section className='contact-main py-16 px-4 sm:px-6'>
        <div className='max-w-5xl mx-auto grid lg:grid-cols-2 gap-12'>
          {/* ── Form column ── */}
          <div ref={formRef}>
            <h2
              data-anim
              data-delay='1'
              className='font-serif text-[24px] font-medium mb-6'
              style={{ color: 'var(--color-text)' }}
            >
              Send a Message
            </h2>

            {submitted ? (
              /* No data-anim on success card — seedha visible */
              <div className='success-card'>
                <div className='text-[48px] mb-4'>🌿</div>
                <h3
                  className='font-serif text-[22px] font-medium mb-2'
                  style={{ color: 'var(--color-text)' }}
                >
                  Message Received!
                </h3>
                <p
                  className='text-[15px] font-light'
                  style={{ color: 'var(--color-primary)' }}
                >
                  Thank you for reaching out. Masuma will get back to you within
                  24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-4'>
                {[
                  {
                    label: 'Your Name *',
                    type: 'text',
                    key: 'name',
                    placeholder: 'e.g. Priya Sharma',
                    required: true,
                  },
                  {
                    label: 'Email Address *',
                    type: 'email',
                    key: 'email',
                    placeholder: 'you@example.com',
                    required: true,
                  },
                ].map(({ label, type, key, placeholder, required }, i) => (
                  <div key={key} data-anim data-delay={`${i + 2}`}>
                    <label className='contact-label'>{label}</label>
                    <input
                      type={type}
                      required={required}
                      value={form[key as keyof typeof form]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      placeholder={placeholder}
                      className='contact-input'
                    />
                  </div>
                ))}

                <div data-anim data-delay='4'>
                  <label className='contact-label'>
                    I&apos;m interested in
                  </label>
                  <select
                    value={form.interest}
                    onChange={(e) =>
                      setForm({ ...form, interest: e.target.value })
                    }
                    className='contact-input cursor-pointer'
                  >
                    <option value=''>
                      {programmes.length === 0
                        ? 'Loading…'
                        : 'Select a programme…'}
                    </option>
                    {programmes.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                </div>

                <div data-anim data-delay='5'>
                  <label className='contact-label'>Your Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Tell me a little about where you are and what you're looking for…"
                    className='contact-input resize-none'
                  />
                </div>

                <div data-anim data-delay='5'>
                  <button
                    type='submit'
                    disabled={loading}
                    className='contact-submit'
                  >
                    {loading ? (
                      <svg
                        className='animate-spin w-5 h-5'
                        viewBox='0 0 24 24'
                        fill='none'
                      >
                        <circle
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                          className='opacity-25'
                        />
                        <path
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8v8H4z'
                          className='opacity-75'
                        />
                      </svg>
                    ) : (
                      <>
                        Send Message <ArrowRightIcon size={17} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ── Contact info column ── */}
          <div ref={infoRef}>
            <h2
              data-anim
              data-delay='1'
              className='font-serif text-[24px] font-medium mb-6'
              style={{ color: 'var(--color-text)' }}
            >
              Other Ways to Connect
            </h2>

            <div className='space-y-3 mb-8'>
              {CONTACT_ITEMS.map((item, i) => (
                <a
                  key={item.label}
                  data-anim
                  data-delay={`${i + 2}`}
                  href={item.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='contact-link-item'
                >
                  <div className='contact-link-icon'>{item.icon}</div>
                  <div>
                    <p className='contact-link-label'>{item.label}</p>
                    <p className='contact-link-value'>{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div data-anim data-delay='5' className='free-call-card'>
              <div className='text-[32px] mb-3'>☎️</div>
              <h3
                className='font-serif text-[20px] font-medium mb-2'
                style={{ color: 'var(--color-primary-light)' }}
              >
                Book a Free Exploration Call
              </h3>
              <p
                className='text-[14px] leading-relaxed mb-5 font-light'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                Not sure where to start? Let&apos;s talk for 30 minutes — no
                pressure, just a conversation about your journey.
              </p>
              <a href='/contact' className='free-call-btn'>
                Book Now <ArrowRightIcon size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
