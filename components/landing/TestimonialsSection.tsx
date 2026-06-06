import FadeIn from '@/components/landing/FadeIn'
import { Tag, PrimaryButton } from '@/components/landing/UI'

const testimonials = [
  {
    initial: 'D',
    name: 'Dimple',
    city: 'Mumbai',
    quote:
      'Masuma is a wonderful relationship coach. Her guidance helped me handle a difficult phase of anger triggered by a personal incident. She was patient, understanding, and practical in her approach. I am now much better able to manage my reactions. She saved my marriage — will always be indebted to her.',
    result: 'Found her voice in 4 weeks',
  },
  {
    initial: 'K',
    name: 'Ketki',
    city: 'Delhi',
    quote:
      'Some friendships arrive when you least expect them and slowly become an important part of your life. Masuma has this beautiful ability to make people feel seen, heard, and valued. As a coach, she brings wisdom, empathy, and authenticity. As a woman, she is a living example of strength and grace.',
    result: 'Set boundaries for the first time',
  },
  {
    initial: 'S',
    name: 'Sapna',
    city: 'Mumbai',
    quote:
      'Your genuine care for people, empathetic listening, and ability to bring clarity to challenging situations make you an exceptional life coach. You are a compassionate and insightful coach who creates a safe space for growth and transformation. Wishing you continued success in touching many lives.',
    result: 'Broke free from people-pleasing',
  },
]

interface TestimonialsSectionProps {
  onCTA: () => void
}

export default function TestimonialsSection({
  onCTA,
}: TestimonialsSectionProps) {
  return (
    <section className='bg-[#faf8f4] px-6 py-20 text-center'>
      <div className='max-w-[1000px] mx-auto'>
        <FadeIn>
          <Tag>❝ Real People. Real Results.</Tag>
          <h2 className='font-serif text-[clamp(26px,4vw,42px)] font-medium text-text leading-snug mb-14'>
            They had a story. Now they have{' '}
            <em className='italic text-primary'>their life back.</em>
          </h2>
        </FadeIn>

        {/* 3-col grid — first two side by side, third centered below */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
          {testimonials
            .slice(0, 2)
            .map(({ initial, name, city, quote, result }, i) => (
              <FadeIn key={name} delay={i * 90}>
                <TestiCard
                  initial={initial}
                  name={name}
                  city={city}
                  quote={quote}
                  result={result}
                />
              </FadeIn>
            ))}
        </div>
        <div className='flex justify-center mb-12'>
          <FadeIn delay={180} className='w-full sm:max-w-[calc(50%-8px)]'>
            <TestiCard {...testimonials[2]} />
          </FadeIn>
        </div>

        <FadeIn delay={270}>
          <PrimaryButton onClick={onCTA}>→ Reserve My Spot</PrimaryButton>
        </FadeIn>
      </div>
    </section>
  )
}

function TestiCard({
  initial,
  name,
  city,
  quote,
  result,
}: {
  initial: string
  name: string
  city: string
  quote: string
  result: string
}) {
  return (
    <div className='flex flex-col gap-4 bg-white border border-surface-border rounded-[16px] p-7 text-left h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(122,106,88,0.1)]'>
      {/* header */}
      <div className='flex items-center gap-3'>
        <div
          className='w-12 h-12 rounded-full flex items-center justify-center font-serif text-lg font-semibold text-primary flex-shrink-0'
          style={{
            background: 'linear-gradient(135deg,#e8dfd0,#f5f0e8)',
            border: '2px solid #d8cebc',
          }}
        >
          {initial}
        </div>
        <div>
          <p className='text-[15px] font-bold text-text font-sans'>{name}</p>
          <p className='text-[12px] text-primary-muted font-sans flex items-center gap-1 mt-0.5'>
            📍 {city}
          </p>
        </div>
        {/* stars */}
        <div className='ml-auto flex gap-0.5'>
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <span key={i} style={{ color: '#c8a87a', fontSize: '13px' }}>
                ★
              </span>
            ))}
        </div>
      </div>

      <p className='font-serif text-[14px] italic text-primary-mid leading-[1.85] flex-1'>
        "{quote}"
      </p>

      <div
        className='flex items-center gap-2 rounded-lg px-4 py-2.5 text-[12px] font-semibold text-primary-mid font-sans'
        style={{ background: '#e8dfd0' }}
      >
        ✔ {result}
      </div>
    </div>
  )
}
