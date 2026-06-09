'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

/* ── Countdown hook ── */
function useCountdown() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const t = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    function tick() {
      const d = t.getTime() - Date.now()
      if (d <= 0) {
        setTime('Starting now!')
        return
      }
      const dy = Math.floor(d / 86400000)
      const h = Math.floor((d % 86400000) / 3600000)
      const m = Math.floor((d % 3600000) / 60000)
      const s = Math.floor((d % 60000) / 1000)
      setTime(
        `${dy}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`,
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

/* ── Reveal hook ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const targets = el.querySelectorAll('[data-reveal]')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove(
              'opacity-0',
              'translate-y-8',
              '-translate-x-8',
              'translate-x-8',
            )
            e.target.classList.add(
              'opacity-100',
              'translate-y-0',
              'translate-x-0',
            )
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08 },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])
  return ref
}

/* ── Form Section with WhatsApp redirect ── */
const WHATSAPP_NUMBER = '918700297752'

function FormSection({
  formRef,
  btnGold,
}: {
  formRef: React.RefObject<HTMLElement>
  btnGold: string
}) {
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setError('Please fill in all fields.')
      return
    }
    setError('')
    const msg = encodeURIComponent(
      `Hi Masuma! 🌸\n\nI'd like to reserve my spot for the 4-Week 1:1 Coaching Programme.\n\n*Name:* ${form.name}\n*Phone:* ${form.phone}\n*Email:* ${form.email}\n\nLooking forward to starting my transformation journey!`,
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
  }

  return (
    <section ref={formRef} className='py-[70px] px-10 bg-[var(--primary-dark)]'>
      <div className='max-w-[1100px] mx-auto text-center'>
        <div
          data-reveal
          className='opacity-0 translate-y-8 transition-all duration-700'
        >
          <h2 className='font-[family-name:var(--serif)] text-[clamp(30px,4vw,52px)] font-semibold leading-[1.1] text-[#faf8f4] mb-[14px]'>
            Stop giving yourself away
            <br />
            <em className='text-[var(--gold)] italic'>for free.</em>
          </h2>
          <p className='text-[17px] text-[rgba(250,248,244,.6)] font-light mb-1.5'>
            Start getting the life you deserve.
          </p>
          <p className='text-[13px] text-[rgba(250,248,244,.3)] tracking-[0.06em] mb-11'>
            1:1 with Masuma
          </p>
        </div>
        <div
          data-reveal
          className='opacity-0 translate-y-8 transition-all duration-700 delay-[100ms] rounded-[20px] p-12 max-w-[520px] mx-auto'
          style={{
            background: 'rgba(255,255,255,.06)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,.12)',
          }}
        >
          <form onSubmit={handleSubmit} className='flex flex-col gap-0'>
            <input
              type='text'
              placeholder='Your full name'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className='w-full rounded-lg px-[18px] py-[15px] text-sm font-[family-name:var(--sans)] text-[#faf8f4] outline-none mb-[14px] block transition-all'
              style={{
                background: 'rgba(255,255,255,.08)',
                border: '1px solid rgba(255,255,255,.15)',
              }}
            />
            <input
              type='tel'
              placeholder='WhatsApp number'
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              className='w-full rounded-lg px-[18px] py-[15px] text-sm font-[family-name:var(--sans)] text-[#faf8f4] outline-none mb-[14px] block transition-all'
              style={{
                background: 'rgba(255,255,255,.08)',
                border: '1px solid rgba(255,255,255,.15)',
              }}
            />
            <input
              type='email'
              placeholder='Email address'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className='w-full rounded-lg px-[18px] py-[15px] text-sm font-[family-name:var(--sans)] text-[#faf8f4] outline-none mb-[14px] block transition-all'
              style={{
                background: 'rgba(255,255,255,.08)',
                border: '1px solid rgba(255,255,255,.15)',
              }}
            />
            {error && <p className='text-red-400 text-xs mb-3'>{error}</p>}
            <button
              type='submit'
              className={`${btnGold} w-full justify-center`}
            >
              <i className='ti ti-brand-whatsapp text-lg' /> Reserve My Spot —
              Only 5 Left <i className='ti ti-arrow-right' />
            </button>
          </form>
          <div className='flex items-center justify-center gap-5 mt-5'>
            {[
              ['ti-lock', 'Private & Safe'],
              ['ti-shield-check', 'No spam'],
              ['ti-star', '5.0 rated'],
            ].map(([icon, label]) => (
              <span
                key={label}
                className='flex items-center gap-1.5 text-xs text-[rgba(250,248,244,.45)]'
              >
                <i
                  className={`ti ${icon} text-[13px] text-[rgba(200,168,122,.6)]`}
                />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── FAQ Item ── */
function FaqItem({
  icon,
  question,
  answer,
}: {
  icon: string
  question: string
  answer: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className='border-b border-[var(--surface-b)] overflow-hidden'>
      <button
        onClick={() => setOpen(!open)}
        className='w-full bg-transparent border-none text-left px-2 py-[22px] flex justify-between items-center gap-4 font-[family-name:var(--sans)] text-[15px] font-semibold text-[var(--text)] cursor-pointer hover:text-[var(--primary)] transition-colors'
      >
        <div className='flex items-center gap-[14px]'>
          <div className='w-9 h-9 rounded-[10px] bg-[var(--surface)] border border-[var(--surface-b)] flex items-center justify-center text-base text-[var(--primary)] shrink-0'>
            <i className={`ti ${icon}`} />
          </div>
          <span>{question}</span>
        </div>
        <div
          className='w-7 h-7 rounded-full flex items-center justify-center text-lg shrink-0 leading-none transition-all duration-300'
          style={{
            background: open ? 'var(--primary-dark)' : 'var(--surface)',
            border: '1px solid var(--surface-b)',
            color: open ? '#faf8f4' : 'var(--primary-mid)',
            transform: open ? 'rotate(45deg)' : 'rotate(0)',
          }}
        >
          +
        </div>
      </button>
      <div
        className='grid transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]'
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className='overflow-hidden'>
          <p className='px-2 pb-[22px] pl-[58px] text-sm text-[var(--primary)] leading-[1.85]'>
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Data ── */
const WEEKS = [
  {
    num: 'Week 01',
    title: 'Awareness',
    icon: 'ti-eye',
    numIcon: 'ti-circle-number-1',
    desc: "Pinpoint exactly where your self-worth broke down — and why it's not your fault",
    img: '/images/week-awareness.jpg',
  },
  {
    num: 'Week 02',
    title: 'Release',
    icon: 'ti-feather',
    numIcon: 'ti-circle-number-2',
    desc: 'Let go of the conditioning, old stories, and fears that have kept you stuck',
    img: '/images/week-release.jpg',
  },
  {
    num: 'Week 03',
    title: 'Rewire',
    icon: 'ti-brain',
    numIcon: 'ti-circle-number-3',
    desc: 'Replace limiting beliefs with a new identity — one that actually fits you',
    img: '/images/week-rewire.jpg',
  },
  {
    num: 'Week 04',
    title: 'Rise',
    icon: 'ti-rocket',
    numIcon: 'ti-circle-number-4',
    desc: "Step into your power, set boundaries, and show up as the version of you you've been hiding",
    img: '/images/week-rise.jpg',
  },
]

const PAIN = [
  {
    icon: 'ti-moon',
    title: 'Sleepless replays',
    desc: "You wake up tired of replaying what you said or didn't say",
  },
  {
    icon: 'ti-hand-stop',
    title: "The yes you didn't mean",
    desc: 'You say yes when every part of you wants to say no',
  },
  {
    icon: 'ti-arrows-minimize',
    title: 'Shrinking yourself',
    desc: 'You shrink yourself to keep the peace',
  },
  {
    icon: 'ti-trophy',
    title: 'Achieved but empty',
    desc: "You've achieved things but still feel like you're not enough",
  },
]

const TESTI = [
  {
    av: 'D',
    name: 'Dimple',
    city: 'Mumbai',
    result: 'Saved her marriage',
    // Replace with actual image path e.g. '/testimonials/dimple.jpg'
    img: '',
    quote:
      'Masuma is a wonderful relationship coach. Her guidance helped me handle a difficult phase of anger triggered by a personal incident. She was patient, understanding, and practical in her approach. I am now much better able to manage my reactions. She saved my marriage by pulling me out of that situation, will always be indebted to her.',
  },
  {
    av: 'K',
    name: 'Ketki',
    city: 'Delhi',
    result: 'Set boundaries for the first time',
    // Replace with actual image path e.g. '/testimonials/ketki.jpg'
    img: '',
    quote:
      "Some friendships arrive when you least expect them and slowly become an important part of your life. That's exactly what happened with Masuma and me. We met during our coaching journey, and what started as being co-coaches soon turned into a friendship that I deeply cherish.",
  },
  {
    av: 'S',
    name: 'Sapna',
    city: 'Mumbai',
    result: 'Found her voice in 4 weeks',
    // Replace with actual image path e.g. '/testimonials/sapna.jpg'
    img: '',
    quote:
      'It was wonderful connecting with you and experiencing your coaching style. Your genuine care for people, empathetic listening, and ability to bring clarity to challenging situations make you an exceptional life coach. Your passion for helping others grow and transform is truly inspiring.',
  },
]

const PRICING_ITEMS = [
  { icon: 'ti-user-heart', label: '4-Week 1:1 Coaching Program' },
  { icon: 'ti-message-circle-heart', label: 'Exploration Session' },
  { icon: 'ti-calendar-check', label: 'Weekly Tracker' },
  { icon: 'ti-ear', label: 'Healing Audio + Workbook' },
  { icon: 'ti-brand-whatsapp', label: 'WhatsApp Support (ongoing)' },
]

const DET = [
  { icon: 'ti-calendar', label: 'Schedule', val: 'Every Weekend' },
  { icon: 'ti-clock', label: 'Duration', val: '60 minutes per session' },
  { icon: 'ti-world', label: 'Language', val: 'Hindi / English' },
  { icon: 'ti-video', label: 'Venue', val: 'Zoom (Private 1:1)' },
]

const FAQS = [
  {
    icon: 'ti-heart-rate-monitor',
    q: "I've tried therapy. How is this different?",
    a: 'This is coaching, not therapy. We focus on your future, not just your past. We take action — not just awareness.',
  },
  {
    icon: 'ti-lock',
    q: "I'm very private. Will this be safe?",
    a: '100%. Everything shared in sessions stays between us. No recordings shared without your permission.',
  },
  {
    icon: 'ti-sparkles',
    q: 'Will this actually work for me?',
    a: 'If you show up and do the work — yes. Every person who has committed to these 4 weeks has walked away transformed.',
  },
  {
    icon: 'ti-clock',
    q: 'How much time do I need each week?',
    a: '1 live session per week (60 min) + optional journaling. Designed for busy people.',
  },
]

/* ══════════════════════════════════
   PAGE
══════════════════════════════════ */
export default function MasumaPage() {
  const pageRef = useReveal()
  const countdown = useCountdown()
  const formRef = useRef<HTMLElement>(null) as React.RefObject<HTMLElement>

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  /* shared button classes */
  const btnDark =
    'inline-flex items-center gap-2 bg-[var(--primary-dark)] text-[var(--cream)] border-none rounded-[4px] px-10 py-4 font-[family-name:var(--sans)] text-[14px] font-semibold tracking-[0.08em] uppercase cursor-pointer hover:bg-[var(--primary-hover)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(44,34,24,0.25)] transition-all'
  const btnGold =
    'inline-flex items-center gap-2 bg-[var(--gold)] text-[#1e1208] border-none rounded-[4px] px-11 py-[18px] font-[family-name:var(--sans)] text-[14px] font-bold tracking-[0.08em] uppercase cursor-pointer hover:bg-[#d4b88a] hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(200,168,122,0.4)] transition-all'

  return (
    <>
      <link
        rel='stylesheet'
        href='https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css'
      />

      {/* Keyframe animations — minimal, only what Tailwind can't do */}
      <style>{`
        @keyframes blobFloat  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(24px,-24px) scale(1.06)} }
        @keyframes blobFloat2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,18px) scale(1.04)} }
        @keyframes floatY     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse      { 0%,100%{box-shadow:0 0 0 0 rgba(200,168,122,0.5)} 50%{box-shadow:0 0 0 12px rgba(200,168,122,0)} }
        @keyframes tagPulse   { 0%,100%{background:var(--gold);box-shadow:0 0 6px 2px rgba(200,168,122,0.5)} 50%{background:#d4b88a;box-shadow:0 0 14px 5px rgba(200,168,122,0.3)} }
        @keyframes borderGlow { 0%,100%{border-color:rgba(200,168,122,0.3)} 50%{border-color:rgba(200,168,122,0.8)} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeDown   { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        .anim-float-y   { animation: floatY 6s ease-in-out infinite }
        .anim-pulse     { animation: pulse 3s infinite }
        .anim-blob1     { animation: blobFloat 8s ease-in-out infinite }
        .anim-blob2     { animation: blobFloat2 10s ease-in-out infinite }
        .anim-glow      { animation: borderGlow 4s infinite }
        .anim-tag-dot   { animation: tagPulse 3s infinite }
        .anim-live-dot  { animation: tagPulse 2s infinite }
        .a1 { animation: fadeDown  0.7s ease both }
        .a2 { animation: fadeUp    0.7s 0.15s ease both }
        .a3 { animation: fadeUp    0.7s 0.25s ease both }
        .a4 { animation: fadeUp    0.7s 0.35s ease both }
        .a5 { animation: slideRight 0.8s 0.2s ease both }
        .a6 { animation: fadeUp    0.7s 0.5s ease both }
        .pain-card:hover .pain-bar { opacity: 1 !important; }
        .week-card:hover .week-top-bar { opacity: 1 !important; }
      `}</style>

      <div ref={pageRef}>
        {/* ══ HERO ══ */}
        <section
          className='relative min-h-screen flex items-center overflow-hidden py-[100px] px-10'
          style={{
            background:
              'linear-gradient(135deg,#1e1208 0%,#2c1a0a 40%,#1a0e06 100%)',
          }}
        >
          <div
            className='anim-blob1 absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full pointer-events-none'
            style={{
              background:
                'radial-gradient(circle,rgba(200,168,122,.3) 0%,transparent 70%)',
            }}
          />
          <div
            className='anim-blob2 absolute -bottom-24 -left-20 w-[380px] h-[380px] rounded-full pointer-events-none'
            style={{
              background:
                'radial-gradient(circle,rgba(122,106,88,.22) 0%,transparent 70%)',
            }}
          />

          <div className='relative z-10 max-w-[1100px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center'>
            {/* Left */}
            <div>
              <div className='a1'>
                <span
                  className='inline-flex items-center gap-2 rounded-full px-5 py-[9px] mb-7 text-[11px] font-semibold tracking-[0.14em] uppercase'
                  style={{
                    background: 'rgba(232,223,208,.1)',
                    border: '1px solid rgba(232,223,208,.2)',
                    color: 'var(--primary-light)',
                  }}
                >
                  <span className='anim-tag-dot w-[10px] h-[10px] rounded-full shrink-0 inline-block' />
                  Pain to Power
                </span>
              </div>
              <h1 className='a2 font-[family-name:var(--serif)] text-[clamp(36px,4.5vw,58px)] font-bold leading-[1.08] text-[#faf8f4] mb-[22px]'>
                You forgot who
                <br />
                you were.
                <em className='text-[var(--gold)] italic block mt-[6px]'>
                  While taking care of everyone else.
                </em>
              </h1>
              <p className='a3 text-[rgba(250,248,244,.75)] text-base font-light leading-[1.9] mb-3'>
                You smile. You help. You say yes. And at night — when everyone
                is okay — you lie awake wondering why you don't feel okay.
              </p>
              <p className='a4 text-[rgba(250,248,244,.45)] text-sm italic font-[family-name:var(--serif)] mb-10 leading-[1.7]'>
                This is for the woman who has given everything to everyone.
                <br />
                It's finally your turn.
              </p>

              {/* proof */}
              <div className='a5 flex flex-wrap items-center gap-5 mb-9'>
                {[
                  ['ti-users', '100+ people transformed'],
                  ['ti-star', '5.0 rating'],
                  ['ti-shield-check', 'Safe space'],
                ].map(([icon, label], i) => (
                  <span
                    key={i}
                    className='flex items-center gap-2 text-[rgba(250,248,244,.65)] text-[13px]'
                  >
                    {i > 0 && (
                      <span className='w-px h-5 bg-[rgba(255,255,255,.15)]' />
                    )}
                    <i className={`ti ${icon} text-[var(--gold)] text-base`} />
                    {label}
                  </span>
                ))}
              </div>

              <div className='a6'>
                <button
                  onClick={scrollToForm}
                  className={`${btnGold} anim-pulse anim-float-y`}
                >
                  <i className='ti ti-heart' /> I want this for myself{' '}
                  <i className='ti ti-arrow-right' />
                </button>
                <p className='mt-[14px] text-xs text-[rgba(250,248,244,.35)] tracking-[0.05em]'>
                  1:1 with Masuma · 5 spots open
                </p>
              </div>
            </div>

            {/* Right — coach card */}
            <div className='a5'>
              <div
                className='anim-glow anim-float-y rounded-[20px] p-6'
                style={{
                  background: 'rgba(255,255,255,.07)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,.15)',
                  boxShadow: '0 20px 60px rgba(0,0,0,.35)',
                }}
              >
                <div
                  className='relative w-full rounded-[14px] overflow-hidden'
                  style={{ aspectRatio: '3/4' }}
                >
                  <Image
                    src='/masuma.jpeg'
                    alt='Masuma — Transformational Life Coach'
                    fill
                    className='object-cover object-top'
                    priority
                  />
                  <div
                    className='absolute inset-0 rounded-[14px]'
                    style={{
                      background:
                        'linear-gradient(to bottom,transparent 60%,rgba(30,18,8,.7))',
                    }}
                  />
                  {/* name overlay */}
                  <div
                    className='absolute bottom-4 left-4 right-4 z-10 flex justify-between items-center rounded-[10px] px-[18px] py-[14px]'
                    style={{
                      background: 'rgba(30,18,8,.6)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,.15)',
                    }}
                  >
                    <div>
                      <div className='text-[15px] text-[#faf8f4] font-semibold'>
                        Masuma
                      </div>
                      <div className='text-[11px] text-[rgba(250,248,244,.5)] mt-0.5 tracking-[0.05em]'>
                        Transformational Life Coach
                      </div>
                    </div>
                    <div
                      className='flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-[var(--gold)]'
                      style={{
                        background: 'rgba(200,168,122,.2)',
                        border: '1px solid rgba(200,168,122,.4)',
                      }}
                    >
                      <span className='anim-live-dot w-1.5 h-1.5 rounded-full bg-[var(--gold)] inline-block' />
                      Live
                    </div>
                  </div>
                </div>
                {/* countdown */}
                <div className='flex justify-center mt-[18px]'>
                  <div
                    className='inline-flex items-center gap-3 rounded-full px-6 py-3'
                    style={{
                      background: 'rgba(255,255,255,.07)',
                      border: '1px solid rgba(255,255,255,.12)',
                    }}
                  >
                    <span className='text-xs text-[rgba(250,248,244,.55)] font-medium tracking-[0.05em]'>
                      Next session in
                    </span>
                    <span className='text-[17px] font-bold text-[#faf8f4] tracking-[0.06em] font-[family-name:var(--serif)]'>
                      {countdown || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className='h-px bg-[var(--surface-b)]' />

        {/* ══ PAIN ══ */}
        <section className='py-[70px] px-10 bg-[var(--cream)]'>
          <div className='max-w-[1100px] mx-auto text-center'>
            <div
              data-reveal
              className='opacity-0 translate-y-8 transition-all duration-700'
            >
              <h2 className='font-[family-name:var(--serif)] text-[clamp(28px,5vw,42px)] font-bold text-[var(--primary-mid)] uppercase mb-[18px]'>
                <i className='ti ti-info-circle mr-2' />
                Does this sound{' '}
                <span className='text-[var(--primary-dark)]'>familiar?</span>
              </h2>
            </div>
            <ul className='grid grid-cols-1 md:grid-cols-2 gap-[14px] mx-auto mb-11 max-w-[900px] list-none'>
              {PAIN.map((p, i) => (
                <li
                  key={i}
                  data-reveal
                  className={`pain-card opacity-0 translate-y-8 transition-all duration-700 delay-[${(i + 1) * 100}ms] relative flex items-start gap-4 bg-white border border-[var(--surface-b)] rounded-xl px-[22px] py-5 text-left overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(122,106,88,.12)] transition-all`}
                >
                  <span className='pain-bar absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--gold)] opacity-0 transition-opacity duration-300' />
                  <div className='w-10 h-10 rounded-[10px] bg-[var(--surface)] border border-[var(--surface-b)] flex items-center justify-center shrink-0 text-[18px] text-[var(--primary)]'>
                    <i className={`ti ${p.icon}`} />
                  </div>
                  <div>
                    <h4 className='text-[14px] font-semibold text-[var(--text)] mb-1'>
                      {p.title}
                    </h4>
                    <p className='text-[13px] text-[var(--primary-muted)] leading-[1.65]'>
                      {p.desc}
                    </p>
                  </div>
                </li>
              ))}
              <li
                data-reveal
                className='pain-card opacity-0 translate-y-8 transition-all duration-700 delay-[400ms] col-span-full relative flex items-start gap-4 bg-white border border-[var(--surface-b)] rounded-xl px-[22px] py-5 text-left overflow-hidden max-w-[440px] mx-auto w-full hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(122,106,88,.12)]'
              >
                <span className='pain-bar absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--gold)] opacity-0 transition-opacity duration-300' />
                <div className='w-10 h-10 rounded-[10px] bg-[var(--surface)] border border-[var(--surface-b)] flex items-center justify-center shrink-0 text-[18px] text-[var(--primary)]'>
                  <i className='ti ti-key' />
                </div>
                <div>
                  <h4 className='text-[14px] font-semibold text-[var(--text)] mb-1'>
                    Waiting for permission
                  </h4>
                  <p className='text-[13px] text-[var(--primary-muted)] leading-[1.65]'>
                    You're waiting for permission to finally choose yourself
                  </p>
                </div>
              </li>
            </ul>
            <h2 className='font-[family-name:var(--serif)] text-[clamp(20px,4vw,30px)] font-semibold text-[var(--text)] leading-[1.1] mb-9'>
              If even one of these hits —{' '}
              <em className='text-[var(--primary)] italic'>
                this was made for you.
              </em>
            </h2>
            <div
              data-reveal
              className='opacity-0 translate-y-8 transition-all duration-700 delay-[400ms]'
            >
              <button
                onClick={scrollToForm}
                className={`${btnDark} anim-pulse anim-float-y`}
              >
                <i className='ti ti-arrow-right' /> Reserve My Spot
              </button>
            </div>
          </div>
        </section>

        <div className='h-px bg-[var(--surface-b)]' />

        {/* ══ STORY ══ */}
        <section className='py-[70px] px-10 bg-[var(--surface)]'>
          <div className='max-w-[1100px] mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-[1000px] mx-auto'>
              {/* photo */}
              <div
                data-reveal
                className='opacity-0 -translate-x-8 transition-all duration-700'
              >
                <div className='relative'>
                  <div
                    className='relative w-full rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(44,34,24,.12)]'
                    style={{ aspectRatio: '4/5' }}
                  >
                    <Image
                      src='/masuma.jpeg'
                      alt='Masuma'
                      fill
                      className='object-cover object-top'
                    />
                  </div>
                  <div className='absolute -bottom-5 left-6 right-6 bg-[var(--primary-dark)] rounded-xl px-5 py-4 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,.2)]'>
                    <div>
                      <div className='text-[14px] text-[#faf8f4] font-semibold'>
                        Masuma
                      </div>
                      <div className='text-[11px] text-[var(--primary-muted)] mt-0.5'>
                        Transformational Life Coach
                      </div>
                    </div>
                    <div
                      className='rounded-full px-[14px] py-[5px] text-[11px] font-semibold text-[var(--gold)]'
                      style={{
                        background: 'rgba(200,168,122,.2)',
                        border: '1px solid rgba(200,168,122,.3)',
                      }}
                    >
                      Certified ✦
                    </div>
                  </div>
                </div>
              </div>
              {/* text */}
              <div
                data-reveal
                className='opacity-0 translate-x-8 transition-all duration-700 text-left'
              >
                <h2 className='font-[family-name:var(--serif)] text-[clamp(20px,5vw,40px)] font-bold text-[var(--primary-mid)] uppercase mb-[14px]'>
                  <i className='ti ti-user-heart mr-2' />
                  Her <span className='text-[var(--primary-dark)]'>Story</span>
                </h2>
                <h3 className='font-[family-name:var(--serif)] text-[clamp(20px,3vw,30px)] font-semibold text-[var(--text)] leading-[1.1] mb-4'>
                  From people-pleaser
                  <br />
                  <em className='text-[var(--primary)] italic'>to purpose.</em>
                </h3>
                <blockquote className='font-[family-name:var(--serif)] text-[clamp(15px,1.8vw,18px)] italic text-[var(--primary-mid)] leading-[2] border-l-[3px] border-[var(--gold)] pl-6 my-6'>
                  "I spent years pleasing everyone around me while quietly
                  losing myself. I looked 'fine' on the outside — but inside I
                  was exhausted, anxious, and completely disconnected from who I
                  was. The day I decided to stop waiting for someone else to
                  validate my worth — everything changed."
                </blockquote>
                <p className='text-[15px] text-[var(--primary)] leading-[1.85] mb-2'>
                  I went through the exact process I'm about to share with you.
                  And now I help women do the same — in just 4 weeks.
                </p>
                <p className='text-[13px] text-[var(--primary-muted)] tracking-[0.06em] mb-7'>
                  — Masuma, Transformational Coach
                </p>
                <div className='grid grid-cols-3 gap-4'>
                  {[
                    ['500+', 'Women Helped'],
                    ['4 Wk', 'Transform'],
                    ['5.0★', 'Rating'],
                  ].map(([num, label]) => (
                    <div
                      key={label}
                      className='bg-[var(--cream)] border border-[var(--surface-b)] rounded-xl p-4 text-center'
                    >
                      <div className='font-[family-name:var(--serif)] text-[28px] font-bold text-[var(--primary-dark)] mb-1'>
                        {num}
                      </div>
                      <div className='text-[11px] text-[var(--primary-muted)] tracking-[0.08em] uppercase'>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className='h-px bg-[var(--surface-b)]' />

        {/* ══ WHAT'S INSIDE ══ */}
        <section className='py-[70px] px-10 bg-[var(--cream)]'>
          <div className='max-w-[1100px] mx-auto text-center'>
            <div
              data-reveal
              className='opacity-0 translate-y-8 transition-all duration-700'
            >
              <h2 className='font-[family-name:var(--serif)] text-[clamp(28px,5vw,42px)] font-bold text-[var(--primary-mid)] uppercase mb-[14px]'>
                <i className='ti ti-sparkles mr-2' />
                What's{' '}
                <span className='text-[var(--primary-dark)]'>Inside</span>
              </h2>
              <h3 className='font-[family-name:var(--serif)] text-[clamp(20px,4vw,30px)] font-semibold text-[var(--text)] leading-[1.1] mb-3'>
                Your 4-Week Transformation
              </h3>
              <p className='text-base text-[var(--primary-muted)] leading-[1.7] max-w-[600px] mx-auto mb-12'>
                Awareness · Release · Rewire · Rise
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto mb-6 max-w-[900px]'>
              {WEEKS.map((w, i) => (
                <div
                  key={i}
                  data-reveal
                  className={`week-card opacity-0 translate-y-8 transition-all duration-700 delay-[${(i + 1) * 100}ms] relative bg-white border border-[var(--surface-b)] rounded-2xl overflow-hidden text-left hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(122,106,88,.12)]`}
                >
                  <div
                    className='week-top-bar absolute top-0 left-0 right-0 h-[3px] opacity-0 transition-opacity duration-300'
                    style={{
                      background:
                        'linear-gradient(90deg,var(--gold),var(--primary))',
                    }}
                  />
                  {/* image */}
                  <div className='relative w-full h-[200px] overflow-hidden'>
                    <Image
                      src={w.img}
                      alt={w.title}
                      fill
                      className='object-cover'
                    />
                    <div
                      className='absolute inset-0'
                      style={{
                        background:
                          'linear-gradient(to bottom,transparent 40%,rgba(44,34,24,.7))',
                      }}
                    />
                    <div className='absolute bottom-3 left-4 flex items-center gap-2'>
                      <i
                        className={`ti ${w.numIcon} text-[var(--gold)] text-lg`}
                      />
                      <span className='text-[11px] text-[rgba(250,248,244,.9)] font-bold tracking-[0.2em] uppercase'>
                        {w.num}
                      </span>
                    </div>
                    <div
                      className='absolute top-3 right-3 w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-lg text-[#faf8f4]'
                      style={{
                        background: 'rgba(255,255,255,.15)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,.2)',
                      }}
                    >
                      <i className={`ti ${w.icon}`} />
                    </div>
                  </div>
                  <div className='px-6 py-[22px]'>
                    <div className='font-[family-name:var(--serif)] text-[22px] font-semibold text-[var(--text)] mb-2'>
                      {w.title}
                    </div>
                    <div className='text-sm text-[var(--primary)] leading-[1.75]'>
                      {w.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* includes */}
            <div
              data-reveal
              className='opacity-0 translate-y-8 transition-all duration-700 delay-[400ms] bg-[var(--surface)] border border-[var(--surface-b)] rounded-2xl px-8 py-6 flex flex-wrap justify-center gap-6 max-w-[900px] mx-auto mb-9'
            >
              {[
                ['ti-video', 'Live 1:1 Sessions'],
                ['ti-file-text', 'Worksheets'],
                ['ti-brand-whatsapp', 'WhatsApp Support'],
                ['ti-headphones', 'Guided Healing Audios'],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  className='flex items-center gap-2 text-[var(--primary-mid)] text-sm font-medium'
                >
                  <i className={`ti ${icon} text-base text-[var(--primary)]`} />
                  {label}
                </div>
              ))}
            </div>
            <div
              data-reveal
              className='opacity-0 translate-y-8 transition-all duration-700 delay-[500ms]'
            >
              <button
                onClick={scrollToForm}
                className={`${btnDark} anim-pulse anim-float-y`}
              >
                <i className='ti ti-heart' /> I want this for myself{' '}
                <i className='ti ti-arrow-right' />
              </button>
            </div>
          </div>
        </section>

        <div className='h-px bg-[var(--surface-b)]' />

        {/* ══ SESSION DETAILS ══ */}
        <section className='py-[70px] px-10 bg-[var(--surface)]'>
          <div className='max-w-[1100px] mx-auto text-center'>
            <div
              data-reveal
              className='opacity-0 translate-y-8 transition-all duration-700'
            >
              <h2 className='font-[family-name:var(--serif)] text-[clamp(28px,5vw,42px)] font-bold text-[var(--primary-mid)] uppercase mb-[14px]'>
                <i className='ti ti-calendar-event mr-2' />
                Session{' '}
                <span className='text-[var(--primary-dark)]'>Details</span>
              </h2>
              <h3 className='font-[family-name:var(--serif)] text-[clamp(20px,4vw,30px)] font-semibold text-[var(--text)] mb-3'>
                How it works
              </h3>
              <p className='text-base text-[var(--primary-muted)] leading-[1.7] max-w-[600px] mx-auto mb-12'>
                Everything you need to know before you join
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[800px] mx-auto mb-10'>
              {DET.map((d, i) => (
                <div
                  key={i}
                  data-reveal
                  className={`opacity-0 translate-y-8 transition-all duration-700 delay-[${(i + 1) * 100}ms] bg-white border border-[var(--surface-b)] rounded-2xl px-[22px] py-6 flex items-center gap-[18px] hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(122,106,88,.1)] transition-all`}
                >
                  <div className='w-[52px] h-[52px] rounded-[14px] bg-[var(--surface)] border border-[var(--surface-b)] flex items-center justify-center text-2xl text-[var(--primary)] shrink-0'>
                    <i className={`ti ${d.icon}`} />
                  </div>
                  <div className='text-left'>
                    <div className='text-[11px] text-[var(--primary-muted)] tracking-[0.12em] uppercase mb-[5px]'>
                      {d.label}
                    </div>
                    <div className='text-base font-semibold text-[var(--text)]'>
                      {d.val}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div
              data-reveal
              className='opacity-0 translate-y-8 transition-all duration-700 delay-[500ms]'
            >
              <button
                onClick={scrollToForm}
                className={`${btnDark} anim-pulse anim-float-y`}
              >
                <i className='ti ti-arrow-right' /> Reserve My Free Spot
              </button>
            </div>
          </div>
        </section>

        <div className='h-px bg-[var(--surface-b)]' />

        {/* ══ TESTIMONIALS ══ */}
        <section className='py-[70px] px-10 bg-[var(--cream)]'>
          <div className='max-w-[1100px] mx-auto text-center'>
            <div
              data-reveal
              className='opacity-0 translate-y-8 transition-all duration-700'
            >
              <h2 className='font-[family-name:var(--serif)] text-[clamp(28px,5vw,42px)] font-bold text-[var(--primary-mid)] uppercase mb-[14px]'>
                <i className='ti ti-quote mr-2' />
                Real <span className='text-[var(--primary-dark)]'>
                  People.
                </span>{' '}
                Real{' '}
                <span className='text-[var(--primary-dark)]'>Results.</span>
              </h2>
              <h3 className='font-[family-name:var(--serif)] text-[clamp(20px,4vw,30px)] font-semibold text-[var(--text)] leading-[1.1] mb-12'>
                They had a story. Now they have
                <br />
                <em className='text-[var(--primary)] italic'>
                  their life back.
                </em>
              </h3>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1000px] mx-auto mb-10'>
              {TESTI.map((t, i) => (
                <div
                  key={i}
                  data-reveal
                  className={`opacity-0 translate-y-8 transition-all duration-700 delay-[${(i + 1) * 100}ms] bg-white border border-[var(--surface-b)] rounded-2xl p-7 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(122,106,88,.1)] transition-all`}
                >
                  {/* avatar row */}
                  <div className='flex items-center gap-[14px]'>
                    {/* Image — baad mein src daalein */}
                    <div className='relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[var(--surface-b)]'>
                      {t.img ? (
                        <Image
                          src={t.img}
                          alt={t.name}
                          fill
                          className='object-cover object-top'
                        />
                      ) : (
                        <div
                          className='w-full h-full flex items-center justify-center font-[family-name:var(--serif)] text-lg font-semibold text-[var(--primary)]'
                          style={{
                            background:
                              'linear-gradient(135deg,var(--surface),var(--primary-light))',
                          }}
                        >
                          {t.av}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className='text-[15px] font-bold text-[var(--text)]'>
                        {t.name}
                      </div>
                      <div className='text-xs text-[var(--primary-muted)] flex items-center gap-1 mt-0.5'>
                        <i className='ti ti-map-pin text-[11px]' />
                        {t.city}
                      </div>
                    </div>
                    <div className='flex gap-0.5 ml-auto'>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i
                          key={s}
                          className='ti ti-star-filled text-[13px] text-[var(--gold)]'
                        />
                      ))}
                    </div>
                  </div>
                  <p className='font-[family-name:var(--serif)] text-sm italic text-[var(--primary-mid)] leading-[1.85] flex-1'>
                    "{t.quote}"
                  </p>
                  <div className='bg-[var(--surface)] rounded-lg px-[14px] py-[10px] text-xs font-semibold text-[var(--primary-mid)] flex items-center gap-2'>
                    <i className='ti ti-check text-sm text-[var(--primary)]' />
                    {t.result}
                  </div>
                </div>
              ))}
            </div>
            <div
              data-reveal
              className='opacity-0 translate-y-8 transition-all duration-700 delay-[400ms]'
            >
              <button
                onClick={scrollToForm}
                className={`${btnDark} anim-pulse anim-float-y`}
              >
                <i className='ti ti-arrow-right' /> Reserve My Spot
              </button>
            </div>
          </div>
        </section>

        <div className='h-px bg-[var(--surface-b)]' />

        {/* ══ PRICING ══ */}
        <section className='py-[70px] px-10 bg-[var(--surface)]'>
          <div className='max-w-[1100px] mx-auto text-center'>
            <div
              data-reveal
              className='opacity-0 translate-y-8 transition-all duration-700'
            >
              <h2 className='font-[family-name:var(--serif)] text-[clamp(28px,5vw,42px)] font-bold text-[var(--primary-mid)] uppercase mb-[14px]'>
                <i className='ti ti-gift mr-2' />
                The <span className='text-[var(--primary-dark)]'>Offer</span>
              </h2>
              <h3 className='font-[family-name:var(--serif)] text-[clamp(20px,4vw,30px)] font-semibold text-[var(--text)] leading-[1.1]'>
                Everything you get{' '}
                <em className='text-[var(--primary)] italic'>inside.</em>
              </h3>
            </div>
            <div className='max-w-[640px] mx-auto'>
              <div
                data-reveal
                className='opacity-0 translate-y-8 transition-all duration-700 delay-[100ms] bg-white border border-[var(--surface-b)] rounded-[20px] p-10 shadow-[0_20px_60px_rgba(122,106,88,.1)] mt-8'
              >
                {PRICING_ITEMS.map((p, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 py-4 ${i < PRICING_ITEMS.length - 1 ? 'border-b border-[var(--surface-b)]' : ''}`}
                  >
                    <i
                      className={`ti ${p.icon} text-lg text-[var(--primary)] w-7`}
                    />
                    <span className='text-[var(--primary-mid)] text-sm'>
                      {p.label}
                    </span>
                  </div>
                ))}
              </div>
              <div
                data-reveal
                className='opacity-0 translate-y-8 transition-all duration-700 delay-[200ms] mt-7'
              >
                <button
                  onClick={scrollToForm}
                  className={`${btnDark} anim-pulse anim-float-y text-[15px] px-[52px] py-[18px]`}
                >
                  <i className='ti ti-heart' /> I want this for myself{' '}
                  <i className='ti ti-arrow-right' />
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className='h-px bg-[var(--surface-b)]' />

        {/* ══ FAQ ══ */}
        <section className='py-[70px] px-10 bg-[var(--cream)]'>
          <div className='max-w-[1100px] mx-auto text-center'>
            <div
              data-reveal
              className='opacity-0 translate-y-8 transition-all duration-700'
            >
              <h2 className='font-[family-name:var(--serif)] text-[clamp(28px,5vw,42px)] font-bold text-[var(--primary-mid)] uppercase mb-[14px]'>
                <i className='ti ti-message-question mr-2' />
                Before you{' '}
                <span className='text-[var(--primary-dark)]'>decide</span>
              </h2>
              <h3 className='font-[family-name:var(--serif)] text-[clamp(20px,4vw,30px)] font-semibold text-[var(--text)] leading-[1.1] mb-2'>
                Frequently Asked Questions
              </h3>
              <p className='text-base text-[var(--primary-muted)] leading-[1.7] max-w-[600px] mx-auto mb-11'>
                Real questions, honest answers
              </p>
            </div>
            <div
              data-reveal
              className='opacity-0 translate-y-8 transition-all duration-700 delay-[100ms] max-w-[700px] mx-auto bg-white border border-[var(--surface-b)] rounded-2xl overflow-hidden text-left'
            >
              {FAQS.map((f, i) => (
                <FaqItem key={i} icon={f.icon} question={f.q} answer={f.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ FORM ══ */}
        <FormSection formRef={formRef} btnGold={btnGold} />

        {/* ══ FOOTER ══ */}
        <footer
          className='py-[52px] px-10 text-center border-t border-[rgba(255,255,255,.07)]'
          style={{ background: '#1a0e06' }}
        >
          <div className='font-[family-name:var(--serif)] text-[var(--gold)] text-[22px] font-semibold mb-2'>
            Pain to Power Coaching · Masuma
          </div>
          <div className='text-[13px] text-[var(--primary-muted)]'>
            © {new Date().getFullYear()} All Rights Reserved
          </div>
          <div className='flex items-center justify-center gap-6 mt-5'>
            {['Privacy Policy', 'Terms of Service', 'Contact'].map((l, i) => (
              <span key={l} className='flex items-center gap-6'>
                {i > 0 && (
                  <span className='text-[rgba(255,255,255,.15)]'>·</span>
                )}
                <Link
                  href='#'
                  className='text-xs text-[var(--primary)] no-underline hover:text-[var(--gold)] transition-colors'
                >
                  {l}
                </Link>
              </span>
            ))}
          </div>
        </footer>
      </div>
    </>
  )
}
