'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

function useCountdown(targetHour = 19, targetMinute = 0) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  useEffect(() => {
    function calc() {
      const now = new Date()
      const next = new Date()
      next.setHours(targetHour, targetMinute, 0, 0)
      if (now >= next) next.setDate(next.getDate() + 1)
      const diff = next.getTime() - now.getTime()
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetHour, targetMinute])
  return time
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function MasumaLandingPage() {
  const { days, hours, minutes, seconds } = useCountdown(19, 0)
  const formRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [submitted, setSubmitted] = useState(false)
  const [faq, setFaq] = useState<number | null>(null)

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  const faqs = [
    {
      q: "I've tried therapy. How is this different?",
      a: 'This is coaching, not therapy. We focus on your future, not just your past. We take action — not just awareness.',
    },
    {
      q: "What if I can't afford ₹5,999?",
      a: 'This is the lowest this program will ever be offered. Payment in 2 instalments is available — DM to arrange.',
    },
    {
      q: "I'm very private. Will this be safe?",
      a: '100%. Everything shared in sessions stays between us. No recordings shared without your permission.',
    },
    {
      q: 'Will this actually work for me?',
      a: 'If you show up and do the work — yes. Every person who has committed to these 4 weeks has walked away transformed.',
    },
    {
      q: 'How much time do I need each week?',
      a: '1 live session per week (60 min) + optional journaling. Designed for busy person.',
    },
  ]

  return (
    <div
      style={{
        background: '#0f0a1a',
        minHeight: '100vh',
        fontFamily: "'Space Grotesk', sans-serif",
        color: '#fff',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Space+Grotesk:wght@300..700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .pink{color:#ff2d78}
        .btn-pink{background:linear-gradient(135deg,#ff2d78,#e8175d);color:#fff;border:none;border-radius:999px;padding:18px 40px;font-size:17px;font-weight:700;cursor:pointer;letter-spacing:-0.2px;transition:transform 0.15s,box-shadow 0.15s;display:inline-flex;align-items:center;gap:8px}
        .btn-pink:hover{transform:scale(1.03);box-shadow:0 8px 32px rgba(255,45,120,0.4)}
        .card-dark{background:#15092a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px}
        .tag{display:inline-block;background:rgba(255,45,120,0.15);border:1px solid rgba(255,45,120,0.4);color:#ff6699;border-radius:999px;padding:6px 16px;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase}
        .section{max-width:900px;margin:0 auto;padding:80px 24px}
        .section-sm{max-width:700px;margin:0 auto;padding:72px 24px}
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        @media(max-width:640px){.grid2{grid-template-columns:1fr}h1{font-size:36px!important}h2{font-size:28px!important}}
        .faq-item{border-bottom:1px solid rgba(255,255,255,0.08)}
        .faq-q{width:100%;background:none;border:none;color:#fff;text-align:left;padding:20px 0;font-size:16px;font-weight:500;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:inherit}
        .faq-q:hover{color:#ff6699}
        .faq-a{color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;padding-bottom:20px}
        .form-input{background:#1a0f2e;border:1px solid rgba(255,255,255,0.15);border-radius:12px;color:#fff;padding:14px 18px;font-size:15px;font-family:inherit;width:100%;outline:none;transition:border-color 0.15s}
        .form-input:focus{border-color:#ff2d78}
        .form-input::placeholder{color:rgba(255,255,255,0.3)}
        .bullet{display:flex;align-items:flex-start;gap:12px;margin-bottom:16px}
        .countdown-box{background:rgba(255,255,255,0.06);border-radius:12px;padding:16px 20px;text-align:center;min-width:72px}
        .photo-ring{border-radius:50%;overflow:hidden;border:3px solid #ff2d78;box-shadow:0 0 0 6px rgba(255,45,120,0.15);position:relative}
        .strikethrough{text-decoration:line-through;color:rgba(255,255,255,0.35)}
      `}</style>

      {/* HERO */}
      <section
        style={{
          background:
            'linear-gradient(160deg,#0f0a1a 0%,#1a0830 60%,#0f0a1a 100%)',
          padding: '80px 24px 60px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span
            className='tag'
            style={{ marginBottom: '24px', display: 'inline-block' }}
          >
            4-Week 1:1 Coaching · Only 5 Spots Open
          </span>
          <h1
            style={{
              fontSize: '52px',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '20px',
              letterSpacing: '-1.5px',
            }}
          >
            You forgot who you were.
            <br />
            <span className='pink'>While taking care of everyone else.</span>
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.7,
              maxWidth: '580px',
              margin: '0 auto 20px',
              fontWeight: 300,
            }}
          >
            You smile. You help. You say yes. And at night — when everyone is
            okay — you lie awake wondering why you don't feel okay.
          </p>
          <p
            style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.45)',
              marginBottom: '40px',
              fontStyle: 'italic',
            }}
          >
            This is for the woman who has given everything to everyone. It's
            finally your turn.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <div
              className='photo-ring'
              style={{ width: '180px', height: '180px' }}
            >
              <Image
                src='/masuma.jpeg'
                alt='Masuma — Transformational Coach'
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                priority
              />
            </div>
          </div>
          <p style={{ color: '#ff6699', fontWeight: 700, marginBottom: '2px' }}>
            Masuma
          </p>
          <p
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '13px',
              marginBottom: '36px',
            }}
          >
            Transformational Life Coach
          </p>

          <p
            style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '12px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Next session in
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '40px',
            }}
          >
            {[
              { v: days, l: 'Days' },
              { v: hours, l: 'Hours' },
              { v: minutes, l: 'Min' },
              { v: seconds, l: 'Sec' },
            ].map(({ v, l }) => (
              <div key={l} className='countdown-box'>
                <div
                  style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1 }}
                >
                  {pad(v)}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.4)',
                    marginTop: '4px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>

          <button
            className='btn-pink'
            onClick={scrollToForm}
            style={{ fontSize: '18px', padding: '20px 48px' }}
          >
            I want this for myself →
          </button>
          <p
            style={{
              marginTop: '14px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            4 weeks · 1:1 with Masuma · Only ₹5,999 · 5 spots open
          </p>
        </div>
      </section>

      {/* PAIN AGITATION */}
      <section className='section-sm' style={{ textAlign: 'center' }}>
        <span
          className='tag'
          style={{ marginBottom: '20px', display: 'inline-block' }}
        >
          Does this sound familiar?
        </span>
        <h2
          style={{
            fontSize: '36px',
            fontWeight: 800,
            marginBottom: '40px',
            letterSpacing: '-0.5px',
          }}
        >
          If even one of these hits —<br />
          <span className='pink'>this was made for you.</span>
        </h2>
        <div style={{ textAlign: 'left' }}>
          {[
            "You wake up tired of replaying what you said or didn't say",
            'You say yes when every part of you wants to say no',
            'You shrink yourself to keep the peace',
            "You've achieved things but still feel like you're not enough",
            "You're waiting for permission to finally choose yourself",
          ].map((item, i) => (
            <div key={i} className='bullet'>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'rgba(255,45,120,0.15)',
                  border: '1.5px solid #ff2d78',
                  flexShrink: 0,
                  marginTop: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '8px', color: '#ff2d78' }}>✦</span>
              </div>
              <p
                style={{
                  fontSize: '17px',
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: 1.6,
                }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '36px' }}>
          <button className='btn-pink' onClick={scrollToForm}>
            Reserve My Spot →
          </button>
        </div>
      </section>

      {/* MASUMA STORY */}
      <section style={{ background: '#15092a', padding: '80px 24px' }}>
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            gap: '48px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
            <div
              className='photo-ring'
              style={{ width: '160px', height: '160px', margin: '0 auto 16px' }}
            >
              <Image
                src='/masuma.jpeg'
                alt='Masuma'
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>
            <p style={{ color: '#ff6699', fontWeight: 700, fontSize: '15px' }}>
              Masuma
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
              Transformational Coach
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <span
              className='tag'
              style={{ marginBottom: '20px', display: 'inline-block' }}
            >
              Her Story
            </span>
            <p
              style={{
                fontSize: '17px',
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.8,
                fontStyle: 'italic',
                borderLeft: '2px solid #ff2d78',
                paddingLeft: '20px',
                marginBottom: '16px',
              }}
            >
              "I spent years pleasing everyone around me while quietly losing
              myself. I looked 'fine' on the outside — but inside I was
              exhausted, anxious, and completely disconnected from who I was.
              The day I decided to stop waiting for someone else to validate my
              worth — everything changed."
            </p>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.7,
                marginBottom: '12px',
              }}
            >
              I went through the exact process I'm about to share with you. And
              now I help people do the same — in just 4 weeks.
            </p>
            <p style={{ color: '#ff6699', fontWeight: 600, fontSize: '14px' }}>
              — Masuma, Transformational Coach
            </p>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section className='section' style={{ textAlign: 'center' }}>
        <span
          className='tag'
          style={{ marginBottom: '20px', display: 'inline-block' }}
        >
          What's Inside
        </span>
        <h2
          style={{
            fontSize: '40px',
            fontWeight: 800,
            marginBottom: '12px',
            letterSpacing: '-0.5px',
          }}
        >
          Your 4-Week Transformation
        </h2>
        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '48px',
            fontSize: '16px',
          }}
        >
          Awareness → Release → Rewire → Rise
        </p>
        <div className='grid2' style={{ marginBottom: '24px' }}>
          {[
            {
              week: 'Week 1',
              label: 'Awareness',
              desc: "Pinpoint exactly where your self-worth broke down — and why it's not your fault",
            },
            {
              week: 'Week 2',
              label: 'Release',
              desc: 'Let go of the conditioning, old stories, and fears that have kept you stuck',
            },
            {
              week: 'Week 3',
              label: 'Rewire',
              desc: 'Replace limiting beliefs with a new identity — one that actually fits you',
            },
            {
              week: 'Week 4',
              label: 'Rise',
              desc: "Step into your power, set boundaries, and show up as the version of you you've been hiding",
            },
          ].map(({ week, label, desc }) => (
            <div key={week} className='card-dark' style={{ textAlign: 'left' }}>
              <p
                style={{
                  fontSize: '12px',
                  color: '#ff6699',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                {week}
              </p>
              <p
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  marginBottom: '10px',
                }}
              >
                {label}
              </p>
              <p
                style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
        <div
          style={{
            background: 'rgba(255,45,120,0.08)',
            border: '1px solid rgba(255,45,120,0.2)',
            borderRadius: '14px',
            padding: '20px 28px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '36px',
          }}
        >
          {[
            '4 Live 1:1 Sessions',
            'Worksheets',
            'WhatsApp Support',
            'Guided Healing Audios',
          ].map((item) => (
            <span
              key={item}
              style={{ color: '#ff9abb', fontSize: '14px', fontWeight: 500 }}
            >
              ✦ {item}
            </span>
          ))}
        </div>
        <button className='btn-pink' onClick={scrollToForm}>
          I want this for myself →
        </button>
      </section>

      {/* TESTIMONIALS */}
      <section
        style={{
          background: '#15092a',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <span
            className='tag'
            style={{ marginBottom: '20px', display: 'inline-block' }}
          >
            Real People. Real Results.
          </span>
          <h2
            style={{
              fontSize: '40px',
              fontWeight: 800,
              marginBottom: '48px',
              letterSpacing: '-0.5px',
            }}
          >
            They had a story. Now they have{' '}
            <span className='pink'>their life back.</span>
          </h2>
          <div className='grid2'>
            {[
              {
                name: 'Priya Sharma',
                city: 'Mumbai',
                quote:
                  "Before: I couldn't make a single decision without second-guessing myself. After working with Masuma, I finally feel like I know who I am and what I want. I stopped apologising for existing.",
                result: 'Found her voice in 4 weeks',
              },
              {
                name: 'Neha Gupta',
                city: 'Delhi',
                quote:
                  'I came in with self-doubt and left with a completely new relationship with myself. The guided meditations alone were worth everything.',
                result: 'Set boundaries for the first time',
              },
              {
                name: 'Anjali Mehta',
                city: 'Bangalore',
                quote:
                  'I spent years trying to fix myself. Masuma helped me see I was never broken — just conditioned. I cried tears of relief in our first session.',
                result: 'Broke free from people-pleasing',
              },
              {
                name: 'Kavita Rao',
                city: 'Hyderabad',
                quote:
                  "I almost didn't sign up because of the price. Now I tell everyone — it's the best investment I've ever made in myself. I wish I'd done this years ago.",
                result: 'Reclaimed her identity',
              },
            ].map(({ name, city, quote, result }) => (
              <div
                key={name}
                className='card-dark'
                style={{ textAlign: 'left' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(255,45,120,0.2)',
                      border: '1.5px solid #ff2d78',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#ff6699',
                      flexShrink: 0,
                    }}
                  >
                    {name[0]}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '15px' }}>{name}</p>
                    <p
                      style={{
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '12px',
                      }}
                    >
                      {city}
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    lineHeight: 1.75,
                    marginBottom: '16px',
                    fontStyle: 'italic',
                  }}
                >
                  "{quote}"
                </p>
                <div
                  style={{
                    background: 'rgba(255,45,120,0.12)',
                    borderRadius: '8px',
                    padding: '8px 14px',
                  }}
                >
                  <p
                    style={{
                      color: '#ff9abb',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    ✦ {result}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '40px' }}>
            <button className='btn-pink' onClick={scrollToForm}>
              Reserve My Spot →
            </button>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className='section-sm' style={{ textAlign: 'center' }}>
        <span
          className='tag'
          style={{ marginBottom: '20px', display: 'inline-block' }}
        >
          The Offer
        </span>
        <h2
          style={{
            fontSize: '40px',
            fontWeight: 800,
            marginBottom: '40px',
            letterSpacing: '-0.5px',
          }}
        >
          Everything you get <span className='pink'>inside.</span>
        </h2>
        <div
          className='card-dark'
          style={{ textAlign: 'left', marginBottom: '24px' }}
        >
          {[
            { item: '4-Week 1:1 Coaching Program', value: '₹15,000' },
            { item: 'Exploration Session', value: '₹3,000' },
            { item: 'Weekly Tracker', value: '₹2,000' },
            { item: 'Healing Audio + Workbook', value: '₹5,000' },
            { item: 'WhatsApp Support (ongoing)', value: 'Priceless' },
          ].map(({ item, value }) => (
            <div
              key={item}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px' }}>
                {item}
              </p>
              <p
                style={{
                  color: '#ff9abb',
                  fontWeight: 600,
                  fontSize: '15px',
                  flexShrink: 0,
                }}
              >
                {value}
              </p>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '20px 0 8px',
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
              Total Value
            </p>
            <p
              className='strikethrough'
              style={{ fontSize: '20px', fontWeight: 700 }}
            >
              ₹25,000
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255,45,120,0.1)',
              borderRadius: '10px',
              padding: '16px',
            }}
          >
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>
              Your investment today
            </p>
            <p style={{ color: '#ff2d78', fontWeight: 900, fontSize: '32px' }}>
              ₹5,999
            </p>
          </div>
        </div>
        <p
          style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '13px',
            marginBottom: '28px',
          }}
        >
          Limited spots available · Payment in 2 instalments available on
          request
        </p>
        <button
          className='btn-pink'
          onClick={scrollToForm}
          style={{ fontSize: '18px', padding: '20px 48px' }}
        >
          I want this for myself →
        </button>
      </section>

      {/* SESSION DETAILS */}
      <section
        style={{
          background: '#15092a',
          padding: '72px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span
            className='tag'
            style={{ marginBottom: '20px', display: 'inline-block' }}
          >
            Session Details
          </span>
          <h2
            style={{ fontSize: '36px', fontWeight: 800, marginBottom: '40px' }}
          >
            How it works
          </h2>
          <div className='grid2' style={{ marginBottom: '40px' }}>
            {[
              { icon: '📅', label: 'Schedule', value: 'Daily at 7:00 PM IST' },
              {
                icon: '⏱️',
                label: 'Duration',
                value: '60 minutes per session',
              },
              { icon: '🌐', label: 'Language', value: 'Hindi / English' },
              { icon: '📍', label: 'Venue', value: 'Zoom (Private 1:1)' },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className='card-dark'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '28px' }}>{icon}</span>
                <div>
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '12px',
                      marginBottom: '2px',
                    }}
                  >
                    {label}
                  </p>
                  <p style={{ fontWeight: 600, fontSize: '15px' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
          <button className='btn-pink' onClick={scrollToForm}>
            Reserve My Free Spot →
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className='section-sm'>
        <h2
          style={{
            fontSize: '36px',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          Frequently Asked Questions
        </h2>
        <div className='card-dark'>
          {faqs.map((f, i) => (
            <div key={i} className='faq-item'>
              <button
                className='faq-q'
                onClick={() => setFaq(faq === i ? null : i)}
              >
                <span>{f.q}</span>
                <span
                  style={{ color: '#ff2d78', fontSize: '20px', flexShrink: 0 }}
                >
                  {faq === i ? '−' : '+'}
                </span>
              </button>
              {faq === i && <p className='faq-a'>{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section
        ref={formRef}
        style={{
          background: 'linear-gradient(135deg,#ff2d78,#c41456)',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '40px',
              fontWeight: 900,
              marginBottom: '12px',
              letterSpacing: '-0.5px',
            }}
          >
            Stop giving yourself away for free.
          </h2>
          <p
            style={{
              fontSize: '17px',
              marginBottom: '8px',
              opacity: 0.9,
              fontWeight: 500,
            }}
          >
            Start getting the life you deserve.
          </p>
          <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '36px' }}>
            4 weeks · 1:1 with Masuma · Only ₹5,999
          </p>
          {submitted ? (
            <div
              style={{
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '16px',
                padding: '40px',
              }}
            >
              <p style={{ fontSize: '36px', marginBottom: '12px' }}>🌸</p>
              <p
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                You're in!
              </p>
              <p style={{ opacity: 0.85, fontSize: '15px', lineHeight: 1.6 }}>
                Masuma will reach out to you within 24 hours to confirm your
                spot and schedule your first session.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <input
                className='form-input'
                required
                placeholder='Your full name'
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className='form-input'
                required
                type='tel'
                placeholder='WhatsApp number'
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                className='form-input'
                required
                type='email'
                placeholder='Email address'
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <button
                type='submit'
                style={{
                  background: '#0f0a1a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '18px',
                  fontSize: '17px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '4px',
                  fontFamily: 'inherit',
                  transition: 'opacity 0.15s',
                }}
              >
                Reserve My Spot — Only 5 Left →
              </button>
              <p style={{ fontSize: '12px', opacity: 0.65 }}>
                No spam. Your details are safe with us.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: '#0a0614',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#ff6699', fontWeight: 700, marginBottom: '4px' }}>
          Pain to Power Coaching · Masuma
        </p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
          © {new Date().getFullYear()} All Rights Reserved
        </p>
        <p
          style={{
            color: 'rgba(255,255,255,0.2)',
            fontSize: '12px',
            marginTop: '12px',
          }}
        >
          Privacy Policy · Terms of Service
        </p>
      </footer>
    </div>
  )
}
