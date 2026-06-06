'use client'

import Image from 'next/image'
import { useCountdown, pad } from '@/components/landing/useCountDown'

interface HeroSectionProps {
  onCTA: () => void
}

export default function HeroSection({ onCTA }: HeroSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(3)

  return (
    <section
      className='relative overflow-hidden min-h-screen flex items-center'
      style={{
        background:
          'linear-gradient(135deg, #1e1208 0%, #2c1a0a 40%, #1a0e06 100%)',
      }}
    >
      {/* Blobs */}
      <div
        className='pointer-events-none absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full'
        style={{
          background:
            'radial-gradient(circle, rgba(200,168,122,0.28) 0%, transparent 70%)',
          animation: 'blobFloat 8s ease-in-out infinite',
        }}
      />
      <div
        className='pointer-events-none absolute -bottom-24 -left-20 w-[380px] h-[380px] rounded-full'
        style={{
          background:
            'radial-gradient(circle, rgba(122,106,88,0.2) 0%, transparent 70%)',
          animation: 'blobFloat2 10s ease-in-out infinite',
        }}
      />

      <div className='relative z-10 max-w-[1100px] mx-auto w-full px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-2 gap-14 items-center'>
        {/* ── Left ── */}
        <div>
          {/* Tag */}
          <div style={{ animation: 'fadeDown 0.7s ease both' }}>
            <span
              className='inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-[11px] font-semibold tracking-[0.14em] uppercase mb-7 font-sans'
              style={{
                background: 'rgba(232,223,208,0.1)',
                border: '1px solid rgba(232,223,208,0.2)',
                color: '#e8dfd0',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span
                className='w-2.5 h-2.5 rounded-full flex-shrink-0'
                style={{
                  animation: 'tagPulse 3s infinite',
                  background: '#c8a87a',
                }}
              />
              Pain to Power · 4-Week Coaching
            </span>
          </div>

          <h1
            className='font-serif font-semibold leading-[1.08] tracking-tight text-[#faf8f4] mb-5'
            style={{
              fontSize: 'clamp(36px,4.5vw,58px)',
              animation: 'fadeUp 0.7s 0.1s ease both',
            }}
          >
            You forgot who
            <br />
            you were.
            <em
              className='block mt-1.5 not-italic'
              style={{ color: '#c8a87a', fontStyle: 'italic' }}
            >
              While taking care of everyone else.
            </em>
          </h1>

          <p
            className='text-[16px] font-light leading-[1.9] mb-3 font-sans'
            style={{
              color: 'rgba(250,248,244,0.75)',
              animation: 'fadeUp 0.7s 0.2s ease both',
            }}
          >
            You smile. You help. You say yes. And at night — when everyone is
            okay — you lie awake wondering why you don't feel okay.
          </p>

          <p
            className='text-sm font-serif italic mb-10'
            style={{
              color: 'rgba(250,248,244,0.45)',
              animation: 'fadeUp 0.7s 0.3s ease both',
            }}
          >
            This is for the woman who has given everything to everyone.
            <br />
            It's finally your turn.
          </p>

          {/* Proof row */}
          <div
            className='flex flex-wrap items-center gap-4 mb-9'
            style={{ animation: 'fadeUp 0.7s 0.4s ease both' }}
          >
            {[
              { icon: '👥', text: '100+ people transformed' },
              { icon: '⭐', text: '5.0 rating' },
              { icon: '🛡️', text: 'Safe space' },
            ].map(({ icon, text }, i) => (
              <div
                key={i}
                className='flex items-center gap-2 text-[13px] font-sans'
                style={{ color: 'rgba(250,248,244,0.65)' }}
              >
                <span>{icon}</span>
                <span>{text}</span>
                {i < 2 && (
                  <span
                    className='ml-3 w-px h-4'
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                  />
                )}
              </div>
            ))}
          </div>

          <div style={{ animation: 'fadeUp 0.7s 0.5s ease both' }}>
            <button
              onClick={onCTA}
              className='inline-flex items-center gap-3 rounded-sm font-sans text-[14px] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all duration-250 hover:-translate-y-1'
              style={{
                background: '#c8a87a',
                color: '#1e1208',
                padding: '18px 44px',
                boxShadow: '0 0 0 0 rgba(200,168,122,0.5)',
                animation: 'heroPulse 3s infinite, fadeUp 0.7s 0.5s ease both',
              }}
            >
              ♥ I want this for myself →
            </button>
            <p
              className='mt-4 text-[12px] font-sans'
              style={{
                color: 'rgba(250,248,244,0.35)',
                letterSpacing: '0.05em',
              }}
            >
              1:1 with Masuma · 5 spots open
            </p>
          </div>
        </div>

        {/* ── Right — coach card ── */}
        <div style={{ animation: 'slideInRight 0.8s 0.2s ease both' }}>
          <div
            className='rounded-[20px] p-6 relative'
            style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow:
                '0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
              animation: 'floatY 6s ease-in-out infinite',
            }}
          >
            {/* Photo */}
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
              {/* gradient overlay */}
              <div
                className='absolute inset-0 rounded-[14px]'
                style={{
                  background:
                    'linear-gradient(to bottom, transparent 60%, rgba(30,18,8,0.75))',
                }}
              />
              {/* name badge */}
              <div
                className='absolute bottom-5 left-5 right-5 z-10 flex justify-between items-center rounded-[10px] px-4 py-3'
                style={{
                  background: 'rgba(30,18,8,0.65)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <div>
                  <p
                    className='text-[15px] font-semibold font-sans'
                    style={{ color: '#faf8f4' }}
                  >
                    Masuma
                  </p>
                  <p
                    className='text-[11px] font-sans mt-0.5'
                    style={{
                      color: 'rgba(250,248,244,0.5)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Transformational Life Coach
                  </p>
                </div>
                <span
                  className='flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold font-sans'
                  style={{
                    background: 'rgba(200,168,122,0.2)',
                    border: '1px solid rgba(200,168,122,0.4)',
                    color: '#c8a87a',
                  }}
                >
                  <span
                    className='w-1.5 h-1.5 rounded-full'
                    style={{
                      background: '#c8a87a',
                      animation: 'tagPulse 2s infinite',
                    }}
                  />
                  Live
                </span>
              </div>
            </div>

            {/* Countdown pill */}
            <div
              className='flex items-center justify-center gap-4 mt-5 rounded-full px-6 py-3'
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <span
                className='text-[12px] font-sans font-medium'
                style={{
                  color: 'rgba(250,248,244,0.55)',
                  letterSpacing: '0.05em',
                }}
              >
                Next session in
              </span>
              <span
                className='font-serif text-[17px] font-bold tracking-[0.06em]'
                style={{ color: '#faf8f4' }}
              >
                {days}d {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes blobFloat { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(24px,-24px) scale(1.06)} }
        @keyframes blobFloat2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,18px) scale(1.04)} }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes tagPulse { 0%,100%{background:#c8a87a;box-shadow:0 0 6px 2px rgba(200,168,122,0.5)} 50%{background:#d4b88a;box-shadow:0 0 14px 5px rgba(200,168,122,0.3)} }
        @keyframes heroPulse { 0%,100%{box-shadow:0 0 0 0 rgba(200,168,122,0.5)} 50%{box-shadow:0 0 0 12px rgba(200,168,122,0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
    </section>
  )
}
