'use client'

import { useState } from 'react'
import SectionHeading from '@/components/ui/SectionHeading'
import {
  MailIcon,
  InstagramIcon,
  YoutubeIcon,
  WhatsAppIcon,
  ArrowRightIcon,
} from '@/components/ui/Icons'

const CONTACT_ITEMS = [
  {
    icon: <MailIcon size={20} className='text-[#7C5CBF]' />,
    label: 'Email',
    value: 'masuma26coach@gmail.com',
    href: 'mailto:masuma26coach@gmail.com',
  },
  {
    icon: <InstagramIcon size={20} className='text-pink-500' />,
    label: 'Instagram',
    value: '@masuma_life_coach',
    href: 'https://instagram.com/masuma_life_coach',
  },
  {
    icon: <YoutubeIcon size={20} className='text-red-500' />,
    label: 'YouTube',
    value: 'MasumaLifeCoach',
    href: 'https://www.youtube.com/@MasumaLifeCoach',
  },
  {
    icon: <WhatsAppIcon size={20} className='text-green-500' />,
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <section className='pt-28 pb-16 px-4 bg-linear-to-br from-[#F9F5FF] via-[#F3EEFF] to-[#FDF4FF]'>
        <div className='max-w-3xl mx-auto text-center'>
          <span className='inline-block text-[12px] font-bold uppercase tracking-[0.15em] text-[#A67DD4] bg-[#F3EEFF] border border-purple-200 px-4 py-1.5 rounded-full mb-6'>
            Get In Touch
          </span>
          <h1 className='font-serif text-[44px] sm:text-[54px] font-bold text-[#2D1B5E] leading-tight mb-5'>
            Let's Start a{' '}
            <span className='text-transparent bg-clip-text bg-linear-to-r from-[#7C5CBF] to-[#C084F5]'>
              Conversation
            </span>
          </h1>
          <p className='text-[17px] text-[#6B5B8B] leading-relaxed'>
            Whether you have questions about a programme or just want to reach
            out — I'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className='py-16 px-4 bg-white'>
        <div className='max-w-5xl mx-auto grid lg:grid-cols-2 gap-12'>
          {/* Form */}
          <div>
            <h2 className='font-serif text-[26px] font-bold text-[#2D1B5E] mb-6'>
              Send a Message
            </h2>

            {submitted ? (
              <div className='bg-[#F9F5FF] border border-purple-200 rounded-2xl p-10 text-center'>
                <div className='text-[48px] mb-4'>🌸</div>
                <h3 className='font-serif text-[22px] font-bold text-[#2D1B5E] mb-2'>
                  Message Received!
                </h3>
                <p className='text-[15px] text-[#6B5B8B] leading-relaxed'>
                  Thank you for reaching out. Masuma will get back to you within
                  24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
                    Your Name *
                  </label>
                  <input
                    type='text'
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder='e.g. Priya Sharma'
                    className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] placeholder-[#B0A0CC] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
                  />
                </div>
                <div>
                  <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
                    Email Address *
                  </label>
                  <input
                    type='email'
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder='you@example.com'
                    className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] placeholder-[#B0A0CC] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
                  />
                </div>
                <div>
                  <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
                    I'm interested in
                  </label>
                  <select
                    value={form.interest}
                    onChange={(e) =>
                      setForm({ ...form, interest: e.target.value })
                    }
                    className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all bg-white cursor-pointer'
                  >
                    <option value=''>Select a programme…</option>
                    <option>Pain to Power Masterclass</option>
                    <option>5-Day WhatsApp Challenge</option>
                    <option>4-Week Emotional Healing Programme</option>
                    <option>Self-Boundaries & Letting Go Course</option>
                    <option>Recorded Healing Workshops</option>
                    <option>Free Exploration Call</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
                <div>
                  <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Tell me a little about where you are and what you're looking for…"
                    className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] placeholder-[#B0A0CC] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all resize-none'
                  />
                </div>
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full py-4 bg-[#7C5CBF] hover:bg-[#6A4DAD] text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-200 disabled:opacity-60 flex items-center justify-center gap-2 text-[15px]'
                >
                  {loading ? (
                    <svg
                      className='animate-spin w-5 h-5'
                      viewBox='0 0 24 24'
                      fill='none'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8v8H4z'
                      />
                    </svg>
                  ) : (
                    <>
                      Send Message <ArrowRightIcon size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div>
            <h2 className='font-serif text-[26px] font-bold text-[#2D1B5E] mb-6'>
              Other Ways to Connect
            </h2>
            <div className='space-y-4 mb-8'>
              {CONTACT_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-4 p-4 bg-[#F9F5FF] border border-purple-100 rounded-2xl hover:border-[#7C5CBF]/40 hover:shadow-md transition-all no-underline group'
                >
                  <div className='w-11 h-11 bg-white border border-purple-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm'>
                    {item.icon}
                  </div>
                  <div>
                    <p className='text-[12px] font-bold uppercase tracking-widest text-[#A67DD4]'>
                      {item.label}
                    </p>
                    <p className='text-[14px] font-semibold text-[#2D1B5E] group-hover:text-[#7C5CBF] transition-colors'>
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Free call card */}
            <div className='bg-linear-to-br from-[#7C5CBF] to-[#A67DD4] rounded-2xl p-7 text-white'>
              <div className='text-[32px] mb-3'>☎️</div>
              <h3 className='font-serif text-[20px] font-bold mb-2'>
                Book a Free Exploration Call
              </h3>
              <p className='text-purple-100 text-[14px] leading-relaxed mb-5'>
                Not sure where to start? Let's talk for 30 minutes — no
                pressure, just a conversation about your journey.
              </p>
              <a
                href='/courses'
                className='inline-flex items-center gap-2 bg-white text-[#7C5CBF] font-bold px-5 py-2.5 rounded-xl text-[14px] no-underline hover:bg-purple-50 transition-colors'
              >
                Book Now <ArrowRightIcon size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
