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
    const targets = el.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('show')
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
    <div
      style={{ borderBottom: '1px solid var(--surface-b)', overflow: 'hidden' }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          textAlign: 'left',
          padding: '22px 8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontFamily: 'var(--sans)',
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--text)',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--surface)',
              border: '1px solid var(--surface-b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: 'var(--primary)',
              flexShrink: 0,
            }}
          >
            <i className={`ti ${icon}`} />
          </div>
          <span>{question}</span>
        </div>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: open ? 'var(--primary-dark)' : 'var(--surface)',
            border: '1px solid var(--surface-b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: open ? '#faf8f4' : 'var(--primary-mid)',
            transform: open ? 'rotate(45deg)' : 'rotate(0)',
            transition: 'all 0.3s',
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          +
        </div>
      </button>
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <p
            style={{
              padding: '0 8px 22px 58px',
              fontSize: '14px',
              color: 'var(--primary)',
              lineHeight: 1.85,
            }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Sections ── */
const WEEKS = [
  {
    num: 'Week 01',
    title: 'Awareness',
    icon: 'ti-eye',
    numIcon: 'ti-circle-number-1',
    desc: "Pinpoint exactly where your self-worth broke down — and why it's not your fault",
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
    imgAlt: 'Woman in peaceful reflection — Awareness',
  },
  {
    num: 'Week 02',
    title: 'Release',
    icon: 'ti-feather',
    numIcon: 'ti-circle-number-2',
    desc: 'Let go of the conditioning, old stories, and fears that have kept you stuck',
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&q=80',
    imgAlt: 'Woman releasing — freedom',
  },
  {
    num: 'Week 03',
    title: 'Rewire',
    icon: 'ti-brain',
    numIcon: 'ti-circle-number-3',
    desc: 'Replace limiting beliefs with a new identity — one that actually fits you',
    img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&q=80',
    imgAlt: 'Woman growing — rewiring mindset',
  },
  {
    num: 'Week 04',
    title: 'Rise',
    icon: 'ti-rocket',
    numIcon: 'ti-circle-number-4',
    desc: "Step into your power, set boundaries, and show up as the version of you you've been hiding",
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
    imgAlt: 'Confident woman rising',
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
    quote:
      'Masuma is a wonderful relationship coach. Her guidance helped me handle a difficult phase of anger triggered by a personal incident. She was patient, understanding, and practical in her approach. I am now much better able to manage my reactions, and I would confidently recommend her to anyone seeking support. She saved my marriage by pulling me out of that situation, will always be indebted to her.',
  },
  {
    av: 'K',
    name: 'Ketki',
    city: 'Delhi',
    result: 'Set boundaries for the first time',
    quote:
      "Some friendships arrive when you least expect them and slowly become an important part of your life. That's exactly what happened with Masuma and me. We met during our coaching journey, and what started as being co-coaches soon turned into a friendship that I deeply cherish.",
  },
  {
    av: 'S',
    name: 'Sapna',
    city: 'Mumbai',
    result: 'Found her voice in 4 weeks',
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

/* ══════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════ */
export default function MasumaPage() {
  const pageRef = useReveal()
  const countdown = useCountdown()
  const formRef = useRef<HTMLElement>(null)

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Global styles + Tabler icons */}
      <link
        rel='stylesheet'
        href='https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css'
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
        :root {
          --serif: 'Space Grotesk', sans-serif;
          --sans: 'Inter', sans-serif;
          --bg: #f5f0e8; --surface: #e8dfd0; --surface-b: #d8cebc;
          --primary: #7a6a58; --primary-hover: #5c4a38; --primary-dark: #2c2218;
          --primary-mid: #5c4a38; --primary-muted: #b8a898; --primary-accent: #d8cebc;
          --primary-light: #e8dfd0; --cream: #faf8f4; --text: #2c2218; --gold: #c8a87a;
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(36px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeDown { from { opacity:0; transform:translateY(-20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes blobFloat { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(24px,-24px) scale(1.06)} }
        @keyframes blobFloat2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,18px) scale(1.04)} }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(200,168,122,0.5)} 50%{box-shadow:0 0 0 12px rgba(200,168,122,0)} }
        @keyframes tagPulse { 0%,100%{background:var(--gold);box-shadow:0 0 6px 2px rgba(200,168,122,0.5)} 50%{background:#d4b88a;box-shadow:0 0 14px 5px rgba(200,168,122,0.3)} }
        @keyframes borderGlow { 0%,100%{border-color:rgba(200,168,122,0.3)} 50%{border-color:rgba(200,168,122,0.8)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        .a1{animation:fadeDown .7s ease both}
        .a2{animation:fadeUp .7s .15s ease both}
        .a3{animation:fadeUp .7s .25s ease both}
        .a4{animation:fadeUp .7s .35s ease both}
        .a5{animation:slideInRight .8s .2s ease both}
        .a6{animation:fadeUp .7s .5s ease both}
        .reveal{opacity:0;transform:translateY(36px);transition:opacity .8s cubic-bezier(.4,0,.2,1),transform .8s cubic-bezier(.4,0,.2,1)}
        .reveal.show{opacity:1;transform:translateY(0)}
        .reveal-left{opacity:0;transform:translateX(-36px);transition:opacity .8s ease,transform .8s ease}
        .reveal-left.show{opacity:1;transform:translateX(0)}
        .reveal-right{opacity:0;transform:translateX(36px);transition:opacity .8s ease,transform .8s ease}
        .reveal-right.show{opacity:1;transform:translateX(0)}
        .d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}.d4{transition-delay:.4s}.d5{transition-delay:.5s}
        .pain-card:hover{box-shadow:0 8px 32px rgba(122,106,88,.12);transform:translateY(-2px)}
        .pain-card:hover::before{opacity:1 !important}
        .week-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(122,106,88,.12)}
        .week-card:hover .week-top-bar{opacity:1 !important}
        .det-card:hover{transform:translateY(-3px);box-shadow:0 10px 32px rgba(122,106,88,.1)}
        .testi-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(122,106,88,.1)}
        @media(max-width:768px){
          .hero-inner{grid-template-columns:1fr !important}
          .coach-card{max-width:340px;margin:0 auto}
          .story-grid{grid-template-columns:1fr !important}
          .pain-grid,.weeks-grid,.testi-grid,.det-grid{grid-template-columns:1fr !important}
          .story-stats{grid-template-columns:repeat(3,1fr) !important}
          .pr-cta{flex-direction:column !important;gap:8px !important;text-align:center !important}
          .hero-proof{flex-wrap:wrap;gap:12px}
          .sec{padding:64px 20px !important}
          .hero-section{padding:80px 20px 72px !important;min-height:auto !important}
          .pain-last{grid-column:unset !important}
          .faq-ans{padding-left:22px !important}
        }
      `}</style>

      <div ref={pageRef}>
        {/* ══ HERO ══ */}
        <section
          className='hero-section'
          style={{
            background:
              'linear-gradient(135deg,#1e1208 0%,#2c1a0a 40%,#1a0e06 100%)',
            padding: '100px 40px 90px',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* blobs */}
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle,rgba(200,168,122,.3) 0%,transparent 70%)',
              animation: 'blobFloat 8s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-100px',
              left: '-80px',
              width: '380px',
              height: '380px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle,rgba(122,106,88,.22) 0%,transparent 70%)',
              animation: 'blobFloat2 10s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '30%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle,rgba(180,140,80,.1) 0%,transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div
            className='hero-inner'
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: '1100px',
              margin: '0 auto',
              width: '100%',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '60px',
              alignItems: 'center',
            }}
          >
            {/* LEFT */}
            <div>
              <div className='a1'>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(232,223,208,.1)',
                    border: '1px solid rgba(232,223,208,.2)',
                    color: 'var(--primary-light)',
                    borderRadius: '100px',
                    padding: '9px 20px 9px 12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    marginBottom: '28px',
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      animation: 'tagPulse 3s infinite',
                      flexShrink: 0,
                      display: 'inline-block',
                    }}
                  />
                  Pain to Power
                </span>
              </div>
              <h1
                className='a2'
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(36px,4.5vw,58px)',
                  fontWeight: 700,
                  lineHeight: 1.08,
                  color: '#faf8f4',
                  marginBottom: '22px',
                }}
              >
                You forgot who
                <br />
                you were.
                <em
                  style={{
                    color: 'var(--gold)',
                    fontStyle: 'italic',
                    display: 'block',
                    marginTop: '6px',
                  }}
                >
                  While taking care of everyone else.
                </em>
              </h1>
              <p
                className='a3'
                style={{
                  color: 'rgba(250,248,244,.75)',
                  fontSize: '16px',
                  fontWeight: 300,
                  lineHeight: 1.9,
                  marginBottom: '12px',
                }}
              >
                You smile. You help. You say yes. And at night — when everyone
                is okay — you lie awake wondering why you don't feel okay.
              </p>
              <p
                className='a4'
                style={{
                  color: 'rgba(250,248,244,.45)',
                  fontSize: '14px',
                  fontStyle: 'italic',
                  fontFamily: 'var(--serif)',
                  marginBottom: '40px',
                  lineHeight: 1.7,
                }}
              >
                This is for the woman who has given everything to everyone.
                <br />
                It's finally your turn.
              </p>
              {/* proof */}
              <div
                className='hero-proof a5'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: '36px',
                }}
              >
                {[
                  ['ti-users', '100+ people transformed'],
                  ['ti-star', '5.0 rating'],
                  ['ti-shield-check', 'Safe space'],
                ].map(([icon, label], i) => (
                  <span
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'rgba(250,248,244,.65)',
                      fontSize: '13px',
                    }}
                  >
                    {i > 0 && (
                      <span
                        style={{
                          width: '1px',
                          height: '20px',
                          background: 'rgba(255,255,255,.15)',
                        }}
                      />
                    )}
                    <i
                      className={`ti ${icon}`}
                      style={{ color: 'var(--gold)', fontSize: '16px' }}
                    />
                    {label}
                  </span>
                ))}
              </div>
              <div className='a6'>
                <button
                  onClick={scrollToForm}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'var(--gold)',
                    color: '#1e1208',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '18px 44px',
                    fontFamily: 'var(--sans)',
                    fontSize: '14px',
                    fontWeight: 700,
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    animation:
                      'pulse 3s infinite, floatY 6s ease-in-out infinite',
                  }}
                >
                  <i className='ti ti-heart' /> I want this for myself{' '}
                  <i className='ti ti-arrow-right' />
                </button>
                <p
                  style={{
                    marginTop: '14px',
                    fontSize: '12px',
                    color: 'rgba(250,248,244,.35)',
                    letterSpacing: '.05em',
                  }}
                >
                  1:1 with Masuma · 5 spots open
                </p>
              </div>
            </div>
            {/* RIGHT — coach card */}
            <div className='a5'>
              <div
                className='coach-card'
                style={{
                  background: 'rgba(255,255,255,.07)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,.15)',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 20px 60px rgba(0,0,0,.35)',
                  animation:
                    'borderGlow 4s infinite, floatY 6s ease-in-out infinite',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '3/4',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'rgba(255,255,255,.05)',
                  }}
                >
                  <Image
                    src='/masuma.jpeg'
                    alt='Masuma — Transformational Life Coach'
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                    priority
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to bottom,transparent 60%,rgba(30,18,8,.7))',
                      borderRadius: '14px',
                    }}
                  />
                  {/* coach info overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '16px',
                      right: '16px',
                      zIndex: 2,
                      background: 'rgba(30,18,8,.6)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,.15)',
                      borderRadius: '10px',
                      padding: '14px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '15px',
                          color: '#faf8f4',
                          fontWeight: 600,
                        }}
                      >
                        Masuma
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(250,248,244,.5)',
                          marginTop: '2px',
                          letterSpacing: '.05em',
                        }}
                      >
                        Transformational Life Coach
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(200,168,122,.2)',
                        border: '1px solid rgba(200,168,122,.4)',
                        borderRadius: '100px',
                        padding: '4px 12px',
                        fontSize: '11px',
                        color: 'var(--gold)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'var(--gold)',
                          animation: 'tagPulse 2s infinite',
                          display: 'inline-block',
                        }}
                      />
                      Live
                    </div>
                  </div>
                </div>
                {/* countdown */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '18px',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '14px',
                      background: 'rgba(255,255,255,.07)',
                      border: '1px solid rgba(255,255,255,.12)',
                      borderRadius: '100px',
                      padding: '12px 24px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'rgba(250,248,244,.55)',
                        fontWeight: 500,
                        letterSpacing: '.05em',
                      }}
                    >
                      Next session in
                    </span>
                    <span
                      style={{
                        fontSize: '17px',
                        fontWeight: 700,
                        color: '#faf8f4',
                        letterSpacing: '.06em',
                        fontFamily: 'var(--serif)',
                      }}
                    >
                      {countdown || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div style={{ height: '1px', background: 'var(--surface-b)' }} />

        {/* ══ PAIN ══ */}
        <section
          className='sec'
          style={{ padding: '70px 40px', background: 'var(--cream)' }}
        >
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div className='reveal'>
              <h2
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(28px,5vw,42px)',
                  fontWeight: 700,
                  color: 'var(--primary-mid)',
                  textTransform: 'uppercase',
                  marginBottom: '18px',
                }}
              >
                <i
                  className='ti ti-info-circle'
                  style={{ marginRight: '10px' }}
                />
                Does this sound{' '}
                <span style={{ color: 'var(--primary-dark)' }}>familiar?</span>
              </h2>
            </div>
            <ul
              style={{
                listStyle: 'none',
                display: 'grid',
                gridTemplateColumns: 'repeat(2,1fr)',
                gap: '14px',
                margin: '0 auto 44px',
                maxWidth: '900px',
              }}
              className='pain-grid'
            >
              {PAIN.map((p, i) => (
                <li
                  key={i}
                  className={`pain-card reveal d${i + 1}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    background: '#fff',
                    border: '1px solid var(--surface-b)',
                    borderRadius: '12px',
                    padding: '20px 22px',
                    textAlign: 'left',
                    transition: 'all .3s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <span
                    className='pain-bar'
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '3px',
                      background: 'var(--gold)',
                      opacity: 0,
                      transition: 'opacity .3s',
                    }}
                  />
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'var(--surface)',
                      border: '1px solid var(--surface-b)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '18px',
                      color: 'var(--primary)',
                    }}
                  >
                    <i className={`ti ${p.icon}`} />
                  </div>
                  <div>
                    <h4
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text)',
                        marginBottom: '4px',
                      }}
                    >
                      {p.title}
                    </h4>
                    <p
                      style={{
                        fontSize: '13px',
                        color: 'var(--primary-muted)',
                        lineHeight: 1.65,
                      }}
                    >
                      {p.desc}
                    </p>
                  </div>
                </li>
              ))}
              <li
                className='pain-card pain-last reveal d4'
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  background: '#fff',
                  border: '1px solid var(--surface-b)',
                  borderRadius: '12px',
                  padding: '20px 22px',
                  textAlign: 'left',
                  transition: 'all .3s',
                  position: 'relative',
                  overflow: 'hidden',
                  gridColumn: '1/-1',
                  maxWidth: '440px',
                  margin: '0 auto',
                  width: '100%',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '3px',
                    background: 'var(--gold)',
                    opacity: 0,
                    transition: 'opacity .3s',
                  }}
                />
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--surface)',
                    border: '1px solid var(--surface-b)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '18px',
                    color: 'var(--primary)',
                    fontFamily: 'var(--sans)',
                  }}
                >
                  <i className='ti ti-key' />
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--text)',
                      marginBottom: '4px',
                      fontFamily: 'var(--sans)',
                    }}
                  >
                    Waiting for permission
                  </h4>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--primary-muted)',
                      lineHeight: 1.65,
                    }}
                  >
                    You're waiting for permission to finally choose yourself
                  </p>
                </div>
              </li>
            </ul>
            <h2
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 'clamp(20px,4vw,30px)',
                fontWeight: 600,
                color: 'var(--text)',
                lineHeight: 1.1,
                marginBottom: '36px',
              }}
            >
              If even one of these hits —{' '}
              <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>
                this was made for you.
              </em>
            </h2>
            <div className='reveal d4'>
              <button
                onClick={scrollToForm}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--primary-dark)',
                  color: 'var(--cream)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '16px 40px',
                  fontFamily: 'var(--sans)',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  animation:
                    'pulse 3s infinite, floatY 6s ease-in-out infinite',
                }}
              >
                <i className='ti ti-arrow-right' /> Reserve My Spot
              </button>
            </div>
          </div>
        </section>

        <div style={{ height: '1px', background: 'var(--surface-b)' }} />

        {/* ══ STORY ══ */}
        <section
          className='sec'
          style={{ padding: '70px 40px', background: 'var(--surface)' }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div
              className='story-grid'
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '64px',
                alignItems: 'center',
                maxWidth: '1000px',
                margin: '0 auto',
              }}
            >
              {/* photo */}
              <div className='reveal-left'>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '4/5',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 20px 60px rgba(44,34,24,.12)',
                      position: 'relative',
                    }}
                  >
                    <Image
                      src='/masuma.jpeg'
                      alt='Masuma'
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'top' }}
                    />
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-20px',
                      left: '24px',
                      right: '24px',
                      background: 'var(--primary-dark)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 8px 32px rgba(0,0,0,.2)',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#faf8f4',
                          fontWeight: 600,
                        }}
                      >
                        Masuma
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--primary-muted)',
                          marginTop: '2px',
                        }}
                      >
                        Transformational Life Coach
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(200,168,122,.2)',
                        border: '1px solid rgba(200,168,122,.3)',
                        borderRadius: '100px',
                        padding: '5px 14px',
                        fontSize: '11px',
                        color: 'var(--gold)',
                        fontWeight: 600,
                      }}
                    >
                      Certified ✦
                    </div>
                  </div>
                </div>
              </div>
              {/* text */}
              <div className='reveal-right' style={{ textAlign: 'left' }}>
                <h2
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 'clamp(20px,5vw,40px)',
                    fontWeight: 700,
                    color: 'var(--primary-mid)',
                    textTransform: 'uppercase',
                    marginBottom: '14px',
                  }}
                >
                  <i
                    className='ti ti-user-heart'
                    style={{ marginRight: '8px' }}
                  />
                  Her{' '}
                  <span style={{ color: 'var(--primary-dark)' }}>Story</span>
                </h2>
                <h3
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 'clamp(20px,3vw,30px)',
                    fontWeight: 600,
                    color: 'var(--text)',
                    lineHeight: 1.1,
                    marginBottom: '16px',
                  }}
                >
                  From people-pleaser
                  <br />
                  <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>
                    to purpose.
                  </em>
                </h3>
                <blockquote
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 'clamp(15px,1.8vw,18px)',
                    fontStyle: 'italic',
                    color: 'var(--primary-mid)',
                    lineHeight: 2,
                    borderLeft: '3px solid var(--gold)',
                    paddingLeft: '24px',
                    margin: '24px 0',
                  }}
                >
                  "I spent years pleasing everyone around me while quietly
                  losing myself. I looked 'fine' on the outside — but inside I
                  was exhausted, anxious, and completely disconnected from who I
                  was. The day I decided to stop waiting for someone else to
                  validate my worth — everything changed."
                </blockquote>
                <p
                  style={{
                    fontSize: '15px',
                    color: 'var(--primary)',
                    lineHeight: 1.85,
                    marginBottom: '10px',
                  }}
                >
                  I went through the exact process I'm about to share with you.
                  And now I help women do the same — in just 4 weeks.
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--primary-muted)',
                    letterSpacing: '.06em',
                    marginBottom: '28px',
                  }}
                >
                  — Masuma, Transformational Coach
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3,1fr)',
                    gap: '16px',
                  }}
                >
                  {[
                    ['500+', 'Women Helped'],
                    ['4 Wk', 'Transform'],
                    ['5.0★', 'Rating'],
                  ].map(([num, label]) => (
                    <div
                      key={label}
                      style={{
                        background: 'var(--cream)',
                        border: '1px solid var(--surface-b)',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--serif)',
                          fontSize: '28px',
                          fontWeight: 700,
                          color: 'var(--primary-dark)',
                          marginBottom: '4px',
                        }}
                      >
                        {num}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--primary-muted)',
                          letterSpacing: '.08em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div style={{ height: '1px', background: 'var(--surface-b)' }} />

        {/* ══ WHAT'S INSIDE (with images) ══ */}
        <section
          className='sec'
          style={{ padding: '70px 40px', background: 'var(--cream)' }}
        >
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div className='reveal'>
              <h2
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(28px,5vw,42px)',
                  fontWeight: 700,
                  color: 'var(--primary-mid)',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                <i className='ti ti-sparkles' style={{ marginRight: '10px' }} />
                What's{' '}
                <span style={{ color: 'var(--primary-dark)' }}>Inside</span>
              </h2>
              <h3
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(20px,4vw,30px)',
                  fontWeight: 600,
                  color: 'var(--text)',
                  lineHeight: 1.1,
                  marginBottom: '12px',
                }}
              >
                Your 4-Week Transformation
              </h3>
              <p
                style={{
                  fontSize: '16px',
                  color: 'var(--primary-muted)',
                  lineHeight: 1.7,
                  maxWidth: '600px',
                  margin: '0 auto 48px',
                }}
              >
                Awareness · Release · Rewire · Rise
              </p>
            </div>
            <div
              className='weeks-grid'
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2,1fr)',
                gap: '16px',
                margin: '0 auto 24px',
                maxWidth: '900px',
              }}
            >
              {WEEKS.map((w, i) => (
                <div
                  key={i}
                  className={`week-card reveal d${i + 1}`}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--surface-b)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    textAlign: 'left',
                    transition: 'all .3s',
                    cursor: 'default',
                    position: 'relative',
                  }}
                >
                  {/* top bar on hover */}
                  <div
                    className='week-top-bar'
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background:
                        'linear-gradient(90deg,var(--gold),var(--primary))',
                      opacity: 0,
                      transition: 'opacity .3s',
                      zIndex: 1,
                    }}
                  />
                  {/* image */}
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={w.img}
                      alt={w.imgAlt}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                    {/* overlay with week label */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(to bottom,transparent 40%,rgba(44,34,24,.7))',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <i
                        className={`ti ${w.numIcon}`}
                        style={{ color: 'var(--gold)', fontSize: '18px' }}
                      />
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'rgba(250,248,244,.9)',
                          fontWeight: 700,
                          letterSpacing: '.2em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {w.num}
                      </span>
                    </div>
                    {/* icon top right */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,.15)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        color: '#faf8f4',
                      }}
                    >
                      <i className={`ti ${w.icon}`} />
                    </div>
                  </div>
                  {/* content */}
                  <div style={{ padding: '22px 24px' }}>
                    <div
                      style={{
                        fontFamily: 'var(--serif)',
                        fontSize: '22px',
                        fontWeight: 600,
                        color: 'var(--text)',
                        marginBottom: '10px',
                      }}
                    >
                      {w.title}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'var(--primary)',
                        lineHeight: 1.75,
                      }}
                    >
                      {w.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* includes */}
            <div
              className='reveal d4'
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--surface-b)',
                borderRadius: '16px',
                padding: '24px 32px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '24px',
                maxWidth: '900px',
                margin: '0 auto 36px',
              }}
            >
              {[
                ['ti-video', 'Live 1:1 Sessions'],
                ['ti-file-text', 'Worksheets'],
                ['ti-brand-whatsapp', 'WhatsApp Support'],
                ['ti-headphones', 'Guided Healing Audios'],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--primary-mid)',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  <i
                    className={`ti ${icon}`}
                    style={{ fontSize: '16px', color: 'var(--primary)' }}
                  />
                  {label}
                </div>
              ))}
            </div>
            <div className='reveal d5'>
              <button
                onClick={scrollToForm}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--primary-dark)',
                  color: 'var(--cream)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '16px 40px',
                  fontFamily: 'var(--sans)',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  animation:
                    'pulse 3s infinite, floatY 6s ease-in-out infinite',
                }}
              >
                <i className='ti ti-heart' /> I want this for myself{' '}
                <i className='ti ti-arrow-right' />
              </button>
            </div>
          </div>
        </section>

        <div style={{ height: '1px', background: 'var(--surface-b)' }} />

        {/* ══ SESSION DETAILS ══ */}
        <section
          className='sec'
          style={{ padding: '70px 40px', background: 'var(--surface)' }}
        >
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div className='reveal'>
              <h2
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(28px,5vw,42px)',
                  fontWeight: 700,
                  color: 'var(--primary-mid)',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                <i
                  className='ti ti-calendar-event'
                  style={{ marginRight: '10px' }}
                />
                Session{' '}
                <span style={{ color: 'var(--primary-dark)' }}>Details</span>
              </h2>
              <h3
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(20px,4vw,30px)',
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: '12px',
                }}
              >
                How it works
              </h3>
              <p
                style={{
                  fontSize: '16px',
                  color: 'var(--primary-muted)',
                  lineHeight: 1.7,
                  maxWidth: '600px',
                  margin: '0 auto 48px',
                }}
              >
                Everything you need to know before you join
              </p>
            </div>
            <div
              className='det-grid'
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2,1fr)',
                gap: '16px',
                maxWidth: '800px',
                margin: '0 auto 40px',
              }}
            >
              {DET.map((d, i) => (
                <div
                  key={i}
                  className={`det-card reveal d${i + 1}`}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--surface-b)',
                    borderRadius: '16px',
                    padding: '24px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                    transition: 'all .3s',
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: 'var(--surface)',
                      border: '1px solid var(--surface-b)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: 'var(--primary)',
                      flexShrink: 0,
                    }}
                  >
                    <i className={`ti ${d.icon}`} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--primary-muted)',
                        letterSpacing: '.12em',
                        textTransform: 'uppercase',
                        marginBottom: '5px',
                      }}
                    >
                      {d.label}
                    </div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: 'var(--text)',
                      }}
                    >
                      {d.val}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='reveal d5'>
              <button
                onClick={scrollToForm}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--primary-dark)',
                  color: 'var(--cream)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '16px 40px',
                  fontFamily: 'var(--sans)',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  animation:
                    'pulse 3s infinite, floatY 6s ease-in-out infinite',
                }}
              >
                <i className='ti ti-arrow-right' /> Reserve My Free Spot
              </button>
            </div>
          </div>
        </section>

        <div style={{ height: '1px', background: 'var(--surface-b)' }} />

        {/* ══ TESTIMONIALS ══ */}
        <section
          className='sec'
          style={{ padding: '70px 40px', background: 'var(--cream)' }}
        >
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div className='reveal'>
              <h2
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(28px,5vw,42px)',
                  fontWeight: 700,
                  color: 'var(--primary-mid)',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                <i className='ti ti-quote' style={{ marginRight: '10px' }} />
                Real{' '}
                <span style={{ color: 'var(--primary-dark)' }}>
                  People.
                </span>{' '}
                Real{' '}
                <span style={{ color: 'var(--primary-dark)' }}>Results.</span>
              </h2>
              <h3
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(20px,4vw,30px)',
                  fontWeight: 600,
                  color: 'var(--text)',
                  lineHeight: 1.1,
                  marginBottom: '48px',
                }}
              >
                They had a story. Now they have
                <br />
                <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>
                  their life back.
                </em>
              </h3>
            </div>
            <div
              className='testi-grid'
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2,1fr)',
                gap: '16px',
                maxWidth: '1000px',
                margin: '0 auto 40px',
              }}
            >
              {TESTI.map((t, i) => (
                <div
                  key={i}
                  className={`testi-card reveal d${i + 1}`}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--surface-b)',
                    borderRadius: '16px',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    transition: 'all .3s',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background:
                          'linear-gradient(135deg,var(--surface),var(--primary-light))',
                        border: '2px solid var(--surface-b)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--serif)',
                        fontSize: '18px',
                        fontWeight: 600,
                        color: 'var(--primary)',
                        flexShrink: 0,
                      }}
                    >
                      {t.av}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: 'var(--text)',
                        }}
                      >
                        {t.name}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--primary-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginTop: '2px',
                        }}
                      >
                        <i
                          className='ti ti-map-pin'
                          style={{ fontSize: '11px' }}
                        />
                        {t.city}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '2px',
                        marginLeft: 'auto',
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i
                          key={s}
                          className='ti ti-star-filled'
                          style={{ fontSize: '13px', color: 'var(--gold)' }}
                        />
                      ))}
                    </div>
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--serif)',
                      fontSize: '14px',
                      fontStyle: 'italic',
                      color: 'var(--primary-mid)',
                      lineHeight: 1.85,
                      flex: 1,
                    }}
                  >
                    "{t.quote}"
                  </p>
                  <div
                    style={{
                      background: 'var(--surface)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '12px',
                      color: 'var(--primary-mid)',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <i
                      className='ti ti-check'
                      style={{ fontSize: '14px', color: 'var(--primary)' }}
                    />
                    {t.result}
                  </div>
                </div>
              ))}
            </div>
            <div className='reveal d5'>
              <button
                onClick={scrollToForm}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--primary-dark)',
                  color: 'var(--cream)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '16px 40px',
                  fontFamily: 'var(--sans)',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  animation:
                    'pulse 3s infinite, floatY 6s ease-in-out infinite',
                }}
              >
                <i className='ti ti-arrow-right' /> Reserve My Spot
              </button>
            </div>
          </div>
        </section>

        <div style={{ height: '1px', background: 'var(--surface-b)' }} />

        {/* ══ PRICING ══ */}
        <section
          className='sec'
          style={{ padding: '70px 40px', background: 'var(--surface)' }}
        >
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div className='reveal'>
              <h2
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(28px,5vw,42px)',
                  fontWeight: 700,
                  color: 'var(--primary-mid)',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                <i className='ti ti-gift' style={{ marginRight: '10px' }} />
                The <span style={{ color: 'var(--primary-dark)' }}>Offer</span>
              </h2>
              <h3
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(20px,4vw,30px)',
                  fontWeight: 600,
                  color: 'var(--text)',
                  lineHeight: 1.1,
                  marginBottom: '0',
                }}
              >
                Everything you get{' '}
                <em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>
                  inside.
                </em>
              </h3>
            </div>
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <div
                className='reveal d1'
                style={{
                  background: '#fff',
                  border: '1px solid var(--surface-b)',
                  borderRadius: '20px',
                  padding: '40px',
                  boxShadow: '0 20px 60px rgba(122,106,88,.1)',
                  marginTop: '32px',
                }}
              >
                {PRICING_ITEMS.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 0',
                      borderBottom:
                        i < PRICING_ITEMS.length - 1
                          ? '1px solid var(--surface-b)'
                          : 'none',
                      gap: '20px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <i
                        className={`ti ${p.icon}`}
                        style={{
                          fontSize: '18px',
                          color: 'var(--primary)',
                          width: '28px',
                        }}
                      />
                      <span
                        style={{
                          color: 'var(--primary-mid)',
                          fontSize: '14px',
                        }}
                      >
                        {p.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className='reveal d2' style={{ marginTop: '28px' }}>
                <button
                  onClick={scrollToForm}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'var(--primary-dark)',
                    color: 'var(--cream)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '18px 52px',
                    fontFamily: 'var(--sans)',
                    fontSize: '15px',
                    fontWeight: 600,
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    animation:
                      'pulse 3s infinite, floatY 6s ease-in-out infinite',
                  }}
                >
                  <i className='ti ti-heart' /> I want this for myself{' '}
                  <i className='ti ti-arrow-right' />
                </button>
              </div>
            </div>
          </div>
        </section>

        <div style={{ height: '1px', background: 'var(--surface-b)' }} />

        {/* ══ FAQ ══ */}
        <section
          className='sec'
          style={{ padding: '70px 40px', background: 'var(--cream)' }}
        >
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div className='reveal'>
              <h2
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(28px,5vw,42px)',
                  fontWeight: 700,
                  color: 'var(--primary-mid)',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                <i
                  className='ti ti-message-question'
                  style={{ marginRight: '10px' }}
                />
                Before you{' '}
                <span style={{ color: 'var(--primary-dark)' }}>decide</span>
              </h2>
              <h3
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(20px,4vw,30px)',
                  fontWeight: 600,
                  color: 'var(--text)',
                  lineHeight: 1.1,
                  marginBottom: '8px',
                }}
              >
                Frequently Asked Questions
              </h3>
              <p
                style={{
                  fontSize: '16px',
                  color: 'var(--primary-muted)',
                  lineHeight: 1.7,
                  maxWidth: '600px',
                  margin: '0 auto 44px',
                }}
              >
                Real questions, honest answers
              </p>
            </div>
            <div
              className='reveal d1'
              style={{
                maxWidth: '700px',
                margin: '0 auto',
                background: '#fff',
                border: '1px solid var(--surface-b)',
                borderRadius: '16px',
                overflow: 'hidden',
                textAlign: 'left',
              }}
            >
              {FAQS.map((f, i) => (
                <FaqItem key={i} icon={f.icon} question={f.q} answer={f.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ FORM ══ */}
        <section
          ref={formRef}
          className='sec'
          style={{ padding: '70px 40px', background: 'var(--primary-dark)' }}
        >
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div className='reveal'>
              <h2
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(30px,4vw,52px)',
                  fontWeight: 600,
                  lineHeight: 1.1,
                  color: '#faf8f4',
                  marginBottom: '14px',
                }}
              >
                Stop giving yourself away
                <br />
                <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>
                  for free.
                </em>
              </h2>
              <p
                style={{
                  fontSize: '17px',
                  color: 'rgba(250,248,244,.6)',
                  fontWeight: 300,
                  marginBottom: '6px',
                }}
              >
                Start getting the life you deserve.
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: 'rgba(250,248,244,.3)',
                  letterSpacing: '.06em',
                  marginBottom: '44px',
                }}
              >
                1:1 with Masuma
              </p>
            </div>
            <div
              className='reveal d1'
              style={{
                background: 'rgba(255,255,255,.06)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,.12)',
                borderRadius: '20px',
                padding: '48px 44px',
                maxWidth: '520px',
                margin: '0 auto',
              }}
            >
              {['Your full name', 'WhatsApp number', 'Email address'].map(
                (ph, i) => (
                  <input
                    key={i}
                    type={i === 2 ? 'email' : i === 1 ? 'tel' : 'text'}
                    placeholder={ph}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,.08)',
                      border: '1px solid rgba(255,255,255,.15)',
                      borderRadius: '8px',
                      padding: '15px 18px',
                      fontFamily: 'var(--sans)',
                      fontSize: '14px',
                      color: '#faf8f4',
                      outline: 'none',
                      marginBottom: '14px',
                      display: 'block',
                    }}
                  />
                ),
              )}
              <button
                style={{
                  width: '100%',
                  background: 'var(--gold)',
                  color: '#1e1208',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '18px',
                  fontFamily: 'var(--sans)',
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all .25s',
                }}
              >
                <i className='ti ti-heart' /> Reserve My Spot — Only 5 Left{' '}
                <i className='ti ti-arrow-right' />
              </button>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px',
                  marginTop: '20px',
                }}
              >
                {[
                  ['ti-lock', 'Private & Safe'],
                  ['ti-shield-check', 'No spam'],
                  ['ti-star', '5.0 rated'],
                ].map(([icon, label]) => (
                  <span
                    key={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      color: 'rgba(250,248,244,.45)',
                    }}
                  >
                    <i
                      className={`ti ${icon}`}
                      style={{
                        fontSize: '13px',
                        color: 'rgba(200,168,122,.6)',
                      }}
                    />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer
          style={{
            background: '#1a0e06',
            padding: '52px 40px',
            textAlign: 'center',
            borderTop: '1px solid rgba(255,255,255,.07)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--serif)',
              color: 'var(--gold)',
              fontSize: '22px',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            Pain to Power Coaching · Masuma
          </div>
          <div style={{ fontSize: '13px', color: 'var(--primary-muted)' }}>
            © {new Date().getFullYear()} All Rights Reserved
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              marginTop: '20px',
            }}
          >
            {['Privacy Policy', 'Terms of Service', 'Contact'].map((l, i) => (
              <span
                key={l}
                style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
              >
                {i > 0 && (
                  <span style={{ color: 'rgba(255,255,255,.15)' }}>·</span>
                )}
                <Link
                  href='#'
                  style={{
                    fontSize: '12px',
                    color: 'var(--primary)',
                    textDecoration: 'none',
                  }}
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
