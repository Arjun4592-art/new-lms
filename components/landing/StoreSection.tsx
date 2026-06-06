import Image from 'next/image'
import FadeIn from '@/components/landing/FadeIn'
import { Tag } from '@/components/landing/UI'

const stats = [
  { num: '500+', label: 'Women Helped' },
  { num: '4 Wk', label: 'Transform' },
  { num: '5.0★', label: 'Rating' },
]

export default function StorySection() {
  return (
    <section className='bg-surface px-6 py-20'>
      <div className='max-w-[1000px] mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-16 items-center'>
          {/* ── Image column ── */}
          <FadeIn direction='left'>
            <div className='relative'>
              <div
                className='relative w-full rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(44,34,24,0.12)]'
                style={{
                  aspectRatio: '4/5',
                  background: 'linear-gradient(135deg, #e8dfd0, #f5f0e8)',
                }}
              >
                <Image
                  src='/masuma1.jpeg'
                  alt='Masuma'
                  fill
                  className='object-cover object-top'
                />
              </div>
              {/* badge */}
              <div
                className='absolute -bottom-5 left-6 right-6 flex justify-between items-center rounded-[12px] px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.18)]'
                style={{ background: '#2c2218' }}
              >
                <div>
                  <p
                    className='text-[14px] font-semibold font-sans'
                    style={{ color: '#faf8f4' }}
                  >
                    Masuma
                  </p>
                  <p
                    className='text-[11px] font-sans mt-0.5'
                    style={{ color: '#b8a898' }}
                  >
                    Transformational Life Coach
                  </p>
                </div>
                <span
                  className='rounded-full px-4 py-1.5 text-[11px] font-semibold font-sans'
                  style={{
                    background: 'rgba(200,168,122,0.2)',
                    border: '1px solid rgba(200,168,122,0.3)',
                    color: '#c8a87a',
                  }}
                >
                  Certified ✦
                </span>
              </div>
            </div>
          </FadeIn>

          {/* ── Content column ── */}
          <FadeIn direction='right' delay={120} className='mt-8 md:mt-0'>
            <Tag>Her Story</Tag>
            <h2 className='font-serif text-[clamp(26px,3.5vw,36px)] font-medium text-text mb-1'>
              From people-pleaser
            </h2>
            <h2 className='font-serif text-[clamp(26px,3.5vw,36px)] font-medium text-primary italic mb-6'>
              to purpose.
            </h2>

            <blockquote className='font-serif text-[clamp(15px,1.8vw,18px)] italic text-primary-mid leading-[2] border-l-[3px] border-[#c8a87a] pl-6 mb-6'>
              "I spent years pleasing everyone around me while quietly losing
              myself. I looked 'fine' on the outside — but inside I was
              exhausted, anxious, and completely disconnected from who I was.
              The day I decided to stop waiting for someone else to validate my
              worth — everything changed."
            </blockquote>

            <p className='text-[15px] text-primary leading-[1.85] font-sans mb-2'>
              I went through the exact process I'm about to share with you. And
              now I help women do the same — in just 4 weeks.
            </p>
            <p className='text-[13px] text-primary-muted font-sans tracking-[0.06em] mb-8'>
              — Masuma, Transformational Coach
            </p>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-4'>
              {stats.map(({ num, label }) => (
                <div
                  key={label}
                  className='bg-[#faf8f4] border border-surface-border rounded-xl p-4 text-center'
                >
                  <p className='font-serif text-[28px] font-semibold text-text leading-none mb-1'>
                    {num}
                  </p>
                  <p className='text-[11px] text-primary-muted font-sans tracking-[0.08em] uppercase'>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
