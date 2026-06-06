'use client'

import { useRef, useState } from 'react'
import FadeIn from '@/components/landing/FadeIn'

interface FormSectionProps {
  formRef: React.RefObject<HTMLDivElement>
}

export default function FormSection({ formRef }: FormSectionProps) {
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      ref={formRef}
      className='px-6 py-20 text-center'
      style={{
        background:
          'linear-gradient(135deg, #1e1208 0%, #2c1a0a 40%, #1a0e06 100%)',
      }}
    >
      <div className='max-w-[520px] mx-auto'>
        <FadeIn>
          <h2
            className='font-serif font-medium leading-[1.1] mb-4'
            style={{ fontSize: 'clamp(28px,4vw,50px)', color: '#faf8f4' }}
          >
            Stop giving yourself away
            <br />
            <em style={{ color: '#c8a87a', fontStyle: 'italic' }}>for free.</em>
          </h2>
          <p
            className='text-[17px] font-light mb-2 font-sans'
            style={{ color: 'rgba(250,248,244,0.6)' }}
          >
            Start getting the life you deserve.
          </p>
          <p
            className='text-[13px] mb-12 font-sans tracking-[0.06em]'
            style={{ color: 'rgba(250,248,244,0.3)' }}
          >
            1:1 with Masuma
          </p>
        </FadeIn>

        {submitted ? (
          <FadeIn>
            <div
              className='rounded-[16px] p-12'
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <p
                className='font-serif text-[36px] mb-4'
                style={{ color: '#faf8f4' }}
              >
                ✦
              </p>
              <p
                className='font-serif text-[22px] font-medium mb-3'
                style={{ color: '#faf8f4' }}
              >
                You're in!
              </p>
              <p
                className='text-[15px] font-sans leading-[1.8]'
                style={{ color: 'rgba(250,248,244,0.75)' }}
              >
                Masuma will reach out within 24 hours to confirm your spot and
                schedule your first session.
              </p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={80}>
            <div
              className='rounded-[20px] p-10 sm:p-12'
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <form onSubmit={handleSubmit} className='flex flex-col gap-3.5'>
                {[
                  { key: 'name', type: 'text', placeholder: 'Your full name' },
                  { key: 'phone', type: 'tel', placeholder: 'WhatsApp number' },
                  { key: 'email', type: 'email', placeholder: 'Email address' },
                ].map(({ key, type, placeholder }) => (
                  <input
                    key={key}
                    required
                    type={type}
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className='w-full rounded-lg px-5 py-4 font-sans text-[14px] outline-none transition-all duration-200'
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#faf8f4',
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = 'rgba(200,168,122,0.6)')
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = 'rgba(255,255,255,0.15)')
                    }
                  />
                ))}

                <button
                  type='submit'
                  className='w-full flex items-center justify-center gap-2.5 rounded-lg py-[18px] font-sans text-[14px] font-bold tracking-[0.08em] uppercase cursor-pointer mt-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(200,168,122,0.3)] active:scale-95'
                  style={{ background: '#c8a87a', color: '#1e1208' }}
                >
                  ♥ Reserve My Spot — Only 5 Left →
                </button>
              </form>

              {/* Trust row */}
              <div className='flex items-center justify-center gap-5 mt-5'>
                {[
                  { icon: '🔒', text: 'Private & Safe' },
                  { icon: '🛡️', text: 'No spam' },
                  { icon: '⭐', text: '5.0 rated' },
                ].map(({ icon, text }) => (
                  <div
                    key={text}
                    className='flex items-center gap-1.5 text-[12px] font-sans'
                    style={{ color: 'rgba(250,248,244,0.4)' }}
                  >
                    <span style={{ fontSize: '13px' }}>{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  )
}
