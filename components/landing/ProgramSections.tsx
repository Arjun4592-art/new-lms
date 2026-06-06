import Image from 'next/image'
import FadeIn from '@/components/landing/FadeIn'
import { Tag, PrimaryButton } from '@/components/landing/UI'

const weeks = [
  {
    num: 'Week 01',
    title: 'Awareness',
    desc: "Pinpoint exactly where your self-worth broke down — and why it's not your fault",
    // Woman looking at mirror / self-reflection
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80&auto=format&fit=crop',
    alt: 'Woman in self-reflection',
    color: '#e8dfd0',
  },
  {
    num: 'Week 02',
    title: 'Release',
    desc: 'Let go of the conditioning, old stories, and fears that have kept you stuck',
    // Woman arms open, free, nature
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop',
    alt: 'Woman feeling free, release',
    color: '#f5f0e8',
  },
  {
    num: 'Week 03',
    title: 'Rewire',
    desc: 'Replace limiting beliefs with a new identity — one that actually fits you',
    // Journaling / writing / brain
    img: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80&auto=format&fit=crop',
    alt: 'Journaling and rewiring',
    color: '#e8dfd0',
  },
  {
    num: 'Week 04',
    title: 'Rise',
    desc: "Step into your power, set boundaries, and show up as the version of you you've been hiding",
    // Confident woman, sunrise, empowered
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&auto=format&fit=crop',
    alt: 'Empowered woman rising',
    color: '#f5f0e8',
  },
]

const includes = [
  { icon: '🎥', label: 'Live 1:1 Sessions' },
  { icon: '📄', label: 'Worksheets' },
  { icon: '💬', label: 'WhatsApp Support' },
  { icon: '🎧', label: 'Guided Healing Audios' },
]

interface ProgramSectionProps {
  onCTA: () => void
}

export default function ProgramSection({ onCTA }: ProgramSectionProps) {
  return (
    <section className='bg-[#faf8f4] px-6 py-20'>
      <div className='max-w-[960px] mx-auto text-center'>
        <FadeIn>
          <Tag>✦ What's Inside</Tag>
          <h2 className='font-serif text-[clamp(28px,4vw,44px)] font-medium text-text mb-2'>
            Your 4-Week Transformation
          </h2>
          <p className='text-primary-muted font-sans text-[15px] tracking-[0.1em] mb-14'>
            Awareness · Release · Rewire · Rise
          </p>
        </FadeIn>

        {/* Week cards — 2 col grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6'>
          {weeks.map(({ num, title, desc, img, alt, color }, i) => (
            <FadeIn key={num} delay={i * 90}>
              <div className='group relative rounded-[18px] overflow-hidden border border-surface-border transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(122,106,88,0.15)] bg-white text-left h-full flex flex-col'>
                {/* Stock image */}
                <div
                  className='relative w-full overflow-hidden'
                  style={{ height: '220px' }}
                >
                  <Image
                    src={img}
                    alt={alt}
                    fill
                    className='object-cover object-center transition-transform duration-500 group-hover:scale-105'
                    sizes='(max-width: 768px) 100vw, 50vw'
                  />
                  {/* gradient overlay */}
                  <div
                    className='absolute inset-0'
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(44,34,24,0.15) 0%, rgba(44,34,24,0.55) 100%)',
                    }}
                  />
                  {/* week pill on image */}
                  <div className='absolute top-4 left-4'>
                    <span
                      className='rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase font-sans'
                      style={{
                        background: 'rgba(250,248,244,0.9)',
                        color: '#5c4a38',
                      }}
                    >
                      {num}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className='p-6 flex flex-col flex-1'>
                  {/* top accent bar on hover */}
                  <div
                    className='absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    style={{
                      background: 'linear-gradient(90deg, #c8a87a, #7a6a58)',
                    }}
                  />

                  <h3 className='font-serif text-[22px] font-medium text-text mb-2'>
                    {title}
                  </h3>
                  <p className='text-[14px] text-primary font-sans leading-[1.75] flex-1'>
                    {desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Includes strip */}
        <FadeIn delay={360}>
          <div className='flex flex-wrap justify-center gap-5 bg-surface border border-surface-border rounded-2xl px-7 py-5 mb-10'>
            {includes.map(({ icon, label }) => (
              <div
                key={label}
                className='flex items-center gap-2 text-primary-mid text-[14px] font-medium font-sans'
              >
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <PrimaryButton onClick={onCTA}>
            ♥ I want this for myself →
          </PrimaryButton>
        </FadeIn>
      </div>
    </section>
  )
}
