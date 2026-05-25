import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'
import {
  ShieldIcon,
  HeartIcon,
  SparkleIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@/components/ui/Icons'

export const metadata = {
  title: 'About Masuma | Pain to Power Coaching',
  description:
    'Meet Masuma, a Life Transformational Coach helping women heal their past, reclaim their worth, and rise into their power.',
}

const CERTIFICATIONS = [
  'Puja Punnet Life by Design',
  'Coaching Mastery Certification',
  'Coaching Certification',
]

const VALUES = [
  {
    icon: <HeartIcon size={22} className='text-pink-400' />,
    title: 'Compassion',
    desc: 'A deeply safe and non-judgmental space where you are fully seen and heard.',
  },
  {
    icon: <ShieldIcon size={22} className='text-[#7C5CBF]' />,
    title: 'Empowerment',
    desc: 'Equipping you with real tools and practices to reclaim your worth.',
  },
  {
    icon: <SparkleIcon size={22} className='text-[#A67DD4]' />,
    title: 'Transformation',
    desc: 'Going beyond surface-level — creating deep, lasting change from within.',
  },
]

const JOURNEY_STEPS = [
  {
    year: 'The Beginning',
    title: 'My Own Pain',
    desc: 'Like many of the women I work with, I experienced emotional overwhelm, people-pleasing, and the silent pressure to hold everything together.',
  },
  {
    year: 'The Turning Point',
    title: 'Choosing Myself',
    desc: 'Through deep inner work, therapy, and transformational coaching, I made the courageous decision to stop surviving and start truly living.',
  },
  {
    year: 'The Learning',
    title: 'Becoming a Coach',
    desc: 'I invested in my growth, earned multiple coaching certifications, and discovered my true calling — helping women do the same inner work I had done.',
  },
  {
    year: 'Today',
    title: 'Your Guide',
    desc: 'Now I walk alongside women on their own journeys — from pain to power, from self-doubt to unshakeable confidence, from silence to voice.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className='pt-28 pb-20 px-4 bg-linear-to-br from-[#F9F5FF] via-[#F3EEFF] to-[#FDF4FF] relative overflow-hidden'>
        <div className='absolute top-20 right-10 w-72 h-72 bg-[#D4BEFF]/20 rounded-full blur-3xl' />
        <div className='max-w-4xl mx-auto text-center relative'>
          <span className='inline-block text-[12px] font-bold uppercase tracking-[0.15em] text-[#A67DD4] bg-[#F3EEFF] border border-purple-200 px-4 py-1.5 rounded-full mb-6'>
            Meet Your Coach
          </span>
          <h1 className='font-serif text-[44px] sm:text-[56px] font-bold text-[#2D1B5E] leading-tight mb-6'>
            Hi, I am{' '}
            <span className='text-transparent bg-clip-text bg-linear-to-r from-[#7C5CBF] to-[#C084F5]'>
              Masuma
            </span>
          </h1>
          <p className='text-[17px] sm:text-[19px] text-[#6B5B8B] leading-relaxed max-w-2xl mx-auto'>
            Life Transformational Coach · Helping women heal their past, reclaim
            their worth, and rise into their power.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className='py-20 px-4 bg-white'>
        <div className='max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center'>
          {/* Visual */}
          <div className='flex justify-center'>
            <div className='relative'>
              <div className='w-72 h-72 sm:w-80 sm:h-80 rounded-3xl bg-linear-to-br from-[#7C5CBF] to-[#C084F5] flex items-center justify-center shadow-2xl shadow-purple-300/40'>
                <div className='text-center text-white px-8'>
                  <SparkleIcon
                    size={48}
                    className='mx-auto mb-4 text-purple-200'
                  />
                  <p className='font-serif text-[22px] font-bold'>Masuma</p>
                  <p className='text-purple-200 text-[14px] mt-1'>
                    Life Transformational Coach
                  </p>
                </div>
              </div>
              <div className='absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-lg border border-purple-100 p-4'>
                <p className='text-[12px] text-[#8470A8]'>Certified &</p>
                <p className='text-[15px] font-bold text-[#2D1B5E]'>
                  Experienced
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <SectionHeading
              eyebrow='My Story'
              title='From Overwhelm to Purpose'
            />
            <div className='space-y-4 mt-4 text-[15.5px] text-[#6B5B8B] leading-relaxed'>
              <p>
                My journey began with my own experiences of emotional overwhelm,
                people-pleasing, and the silent pressure to "hold everything
                together." I know what it feels like to lose yourself, to shrink
                to make others comfortable, to carry pain you were never meant
                to carry.
              </p>
              <p>
                Through deep inner work, healing, and learning, I transformed my
                pain into purpose. I discovered that healing is not just
                possible — it's your birthright.
              </p>
              <p>
                Now I help women do the same. This isn't just coaching. It's a
                journey of emotional freedom, self-respect, and generational
                healing.
              </p>
            </div>

            {/* Certs */}
            <div className='mt-8 bg-[#F9F5FF] border border-purple-100 rounded-2xl p-5'>
              <p className='text-[12px] font-bold uppercase tracking-widest text-[#A67DD4] mb-3'>
                Certifications
              </p>
              <ul className='space-y-2'>
                {CERTIFICATIONS.map((c) => (
                  <li
                    key={c}
                    className='flex items-center gap-2.5 text-[14px] text-[#4A3570]'
                  >
                    <ShieldIcon size={14} className='text-[#7C5CBF] shrink-0' />{' '}
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Journey timeline */}
      <section className='py-20 px-4 bg-linear-to-br from-[#F9F5FF] to-[#FDF4FF]'>
        <div className='max-w-4xl mx-auto'>
          <SectionHeading eyebrow='The Journey' title='How I Got Here' center />
          <div className='mt-12 space-y-6'>
            {JOURNEY_STEPS.map((step, i) => (
              <div key={i} className='flex gap-5 items-start'>
                <div className='flex flex-col items-center'>
                  <div className='w-10 h-10 rounded-full bg-[#7C5CBF] flex items-center justify-center text-white text-[13px] font-bold shrink-0'>
                    {i + 1}
                  </div>
                  {i < JOURNEY_STEPS.length - 1 && (
                    <div className='w-0.5 h-full bg-purple-200 mt-2 min-h-10' />
                  )}
                </div>
                <div className='bg-white border border-purple-100 rounded-2xl p-6 flex-1 mb-2'>
                  <p className='text-[11px] font-bold uppercase tracking-widest text-[#A67DD4] mb-1'>
                    {step.year}
                  </p>
                  <h3 className='font-serif text-[18px] font-bold text-[#2D1B5E] mb-2'>
                    {step.title}
                  </h3>
                  <p className='text-[14.5px] text-[#6B5B8B] leading-relaxed'>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className='py-20 px-4 bg-white'>
        <div className='max-w-5xl mx-auto'>
          <SectionHeading
            eyebrow='What I Stand For'
            title='My Coaching Values'
            center
          />
          <div className='mt-10 grid sm:grid-cols-3 gap-6'>
            {VALUES.map((v) => (
              <div
                key={v.title}
                className='bg-[#F9F5FF] border border-purple-100 rounded-2xl p-7 text-center'
              >
                <div className='w-12 h-12 rounded-2xl bg-white border border-purple-100 flex items-center justify-center mx-auto mb-4 shadow-sm'>
                  {v.icon}
                </div>
                <h3 className='font-serif text-[18px] font-bold text-[#2D1B5E] mb-2'>
                  {v.title}
                </h3>
                <p className='text-[13.5px] text-[#6B5B8B] leading-relaxed'>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-16 px-4 bg-linear-to-br from-[#7C5CBF] to-[#A67DD4]'>
        <div className='max-w-3xl mx-auto text-center'>
          <h2 className='font-serif text-[32px] sm:text-[38px] font-bold text-white mb-4'>
            Ready to Work Together?
          </h2>
          <p className='text-purple-100 text-[16px] mb-8 leading-relaxed'>
            Let's start with a free exploration call where we'll talk about
            where you are and where you want to go.
          </p>
          <Button href='/courses' size='lg' variant='secondary'>
            Book a Free Exploration Call <ArrowRightIcon size={18} />
          </Button>
        </div>
      </section>
    </>
  )
}
