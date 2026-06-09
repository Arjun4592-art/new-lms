'use client'

function AnimatedLetter({
  char,
  delay,
  small,
}: {
  char: string
  delay: number
  small?: boolean
}) {
  if (char === ' ')
    return (
      <span
        style={{ display: 'inline-block', width: small ? '5px' : '10px' }}
      />
    )
  return (
    <span
      className='inline-block opacity-0'
      style={{
        animation: `letterDrop ${small ? '0.35s' : '0.45s'} cubic-bezier(0.34,1.56,0.64,1) forwards`,
        animationDelay: `${delay}s`,
      }}
    >
      {char}
    </span>
  )
}

function buildLetters(
  text: string,
  start: number,
  gap: number,
  small?: boolean,
) {
  return text
    .split('')
    .map((ch, i) => (
      <AnimatedLetter key={i} char={ch} delay={start + i * gap} small={small} />
    ))
}

export default function RadiantRiseLoader() {
  return (
    <>
      <style>{`
        @keyframes letterDrop {
          0%   { opacity: 0; transform: translateY(-12px) rotateX(80deg); }
          100% { opacity: 1; transform: translateY(0)     rotateX(0deg);  }
        }
        @keyframes glowLine {
          from { width: 0;     opacity: 0; }
          to   { width: 140px; opacity: 1; }
        }
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes rotateBorder {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40%           { transform: scale(1.2); opacity: 1;   }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg);   }
          50%      { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        .rr-spin-arc {
          position: absolute; inset: 0; border-radius: 9999px;
          border: 1.5px solid transparent;
          border-top-color: #7A6A58;
          border-right-color: #7A6A5844;
          animation: rotateBorder 1.3s linear infinite;
        }
        .rr-glow-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, #B8A080, transparent);
          width: 0; opacity: 0;
          animation: glowLine 0.9s ease 2.8s forwards;
        }
        .rr-float { opacity: 0; animation: floatUp 0.5s ease forwards; }
        .rr-sp1 { animation: sparkle 2s ease-in-out 0s   infinite; }
        .rr-sp2 { animation: sparkle 2s ease-in-out 0.7s infinite; }
        .rr-sp3 { animation: sparkle 2s ease-in-out 1.3s infinite; }
        .rr-d1  { animation: dotPulse 1.4s ease-in-out        infinite; }
        .rr-d2  { animation: dotPulse 1.4s ease-in-out 0.16s  infinite; }
        .rr-d3  { animation: dotPulse 1.4s ease-in-out 0.32s  infinite; }

        @media (prefers-reduced-motion: reduce) {
          .rr-spin-arc, .rr-glow-line, .rr-float,
          .rr-sp1, .rr-sp2, .rr-sp3, .rr-d1, .rr-d2, .rr-d3 {
            animation: none; opacity: 1; width: auto;
          }
        }
      `}</style>

      <div
        className='relative min-h-[400px] rounded-2xl overflow-hidden flex flex-col items-center justify-center px-6 py-12'
        style={{
          background: 'linear-gradient(160deg, #F9F5EE 0%, #EDE5D8 100%)',
        }}
      >
        {/* Background rings */}
        <div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full pointer-events-none'
          style={{ border: '1px solid rgba(122,106,88,0.07)' }}
        />
        <div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full pointer-events-none'
          style={{ border: '1px solid rgba(122,106,88,0.10)' }}
        />

        {/* Spinner */}
        <div
          className='rr-float relative w-16 h-16 mb-7'
          style={{ animationDelay: '0.1s' }}
        >
          <div
            className='absolute inset-0 rounded-full'
            style={{ border: '1.5px solid rgba(232,223,208,0.9)' }}
          />
          <div className='rr-spin-arc' />
          <div
            className='absolute inset-0 flex items-center justify-center text-[20px] font-medium'
            style={{ fontFamily: 'Georgia, serif', color: '#5C4A38' }}
          >
            R
          </div>
          <span
            className='rr-sp1 absolute top-[3px] right-[9px] text-[9px]'
            style={{ color: '#B8A080' }}
          >
            ✦
          </span>
          <span
            className='rr-sp2 absolute bottom-[6px] left-[3px] text-[9px]'
            style={{ color: '#B8A080' }}
          >
            ✦
          </span>
          <span
            className='rr-sp3 absolute top-[10px] left-[-1px] text-[9px]'
            style={{ color: '#B8A080' }}
          >
            ✦
          </span>
        </div>

        {/* Title */}
        <div
          className='flex text-[38px] font-medium tracking-[0.01em] leading-none mb-1.5'
          style={{ fontFamily: 'Georgia, serif', color: '#2C2218' }}
        >
          {buildLetters('Radiant Rise', 0.4, 0.075)}
        </div>

        {/* Subtitle */}
        <div
          className='flex text-[12px] tracking-[0.3em] uppercase mb-7'
          style={{ fontFamily: 'Georgia, serif', color: '#9C8472' }}
        >
          {buildLetters('with Masuma', 1.6, 0.06, true)}
        </div>

        {/* Glow line */}
        <div className='rr-glow-line w-0 mb-5' />

        {/* Tagline */}
        <p
          className='rr-float text-[10px] tracking-[0.32em] uppercase mb-3.5'
          style={{
            fontFamily: 'Georgia, serif',
            color: '#B8A898',
            animationDelay: '3.2s',
          }}
        >
          Transformational&nbsp;·&nbsp;Growth&nbsp;·&nbsp;Power
        </p>

        {/* Dots */}
        <div
          className='rr-float flex gap-1.5'
          style={{ animationDelay: '3.4s' }}
        >
          <span
            className='rr-d1 w-[5px] h-[5px] rounded-full'
            style={{ background: '#9C8C7C' }}
          />
          <span
            className='rr-d2 w-[5px] h-[5px] rounded-full'
            style={{ background: '#9C8C7C' }}
          />
          <span
            className='rr-d3 w-[5px] h-[5px] rounded-full'
            style={{ background: '#9C8C7C' }}
          />
        </div>
      </div>
    </>
  )
}
