import SectionHeading from '@/components/ui/SectionHeading'
import { QuoteIcon, StarIcon } from '@/components/ui/Icons'

const TESTIMONIALS = [
  {
    name: 'Priya S.',
    role: 'Programme Graduate',
    avatar: 'P',
    color: '#7C5CBF',
    quote:
      'Masuma helped me set boundaries I never thought were possible. I stopped people-pleasing and finally started choosing myself. This coaching changed my life completely.',
    result: 'Set boundaries without guilt',
  },
  {
    name: 'Rania M.',
    role: '4-Week Healing Programme',
    avatar: 'R',
    color: '#A67DD4',
    quote:
      "I came in carrying so much generational pain. Through this programme, I released what wasn't mine to carry. I feel lighter, freer, and more myself than ever before.",
    result: 'Released generational pressure',
  },
  {
    name: 'Aisha K.',
    role: 'Masterclass Participant',
    avatar: 'A',
    color: '#C084F5',
    quote:
      'I used to feel like I was drowning in my own emotions. Now I have tools, clarity, and the confidence to face anything. Masuma is truly gifted at what she does.',
    result: 'Emotional resilience built',
  },
  {
    name: 'Fatima L.',
    role: '5-Day Challenge Alumni',
    avatar: 'F',
    color: '#9B6FC8',
    quote:
      "Just 5 days with Masuma's guidance shifted something deep inside me. I learned to recognize my emotional patterns and stopped letting them run my life.",
    result: 'Recognised emotional patterns',
  },
  {
    name: 'Sana R.',
    role: 'Self-Boundaries Course',
    avatar: 'S',
    color: '#8B5CF6',
    quote:
      'For the first time in years, I feel worthy of love and respect — starting with my own. The self-boundaries course was exactly what I needed. Highly recommend.',
    result: 'Rebuilt self-worth',
  },
  {
    name: 'Noor H.',
    role: 'Programme Graduate',
    avatar: 'N',
    color: '#7C5CBF',
    quote:
      'Masuma creates such a safe, judgment-free space. I shared things I had never told anyone. The healing that followed was profound and lasting.',
    result: 'Deep emotional healing',
  },
]

export default function TestimonialsSection() {
  return (
    <section className='py-20 px-4 bg-linear-to-br from-[#2D1B5E] to-[#4A2D8A] overflow-hidden'>
      {/* Decorative blobs */}
      <div className='absolute left-0 top-1/3 w-64 h-64 bg-[#7C5CBF]/20 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute right-0 bottom-1/3 w-64 h-64 bg-[#C084F5]/20 rounded-full blur-3xl pointer-events-none' />

      <div className='max-w-6xl mx-auto relative'>
        <SectionHeading
          eyebrow='Real Transformations'
          title='What Women Are Saying'
          subtitle="These aren't just testimonials — they are stories of real women who chose themselves."
          center
          light
        />

        <div className='mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all'
            >
              {/* Stars */}
              <div className='flex gap-0.5 mb-4'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    width='14'
                    height='14'
                    viewBox='0 0 24 24'
                    fill='#F5A623'
                  >
                    <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
                  </svg>
                ))}
              </div>

              <QuoteIcon size={24} className='text-purple-300 mb-3' />

              <p className='text-[14px] text-purple-100 leading-relaxed mb-5 italic'>
                "{t.quote}"
              </p>

              <div className='pt-4 border-t border-white/10 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div
                    className='w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0'
                    style={{ background: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className='text-[13px] font-semibold text-white'>
                      {t.name}
                    </p>
                    <p className='text-[11px] text-purple-300'>{t.role}</p>
                  </div>
                </div>
                <span className='text-[11px] bg-[#7C5CBF]/40 text-purple-200 px-2.5 py-1 rounded-full border border-purple-400/30'>
                  ✓ {t.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
