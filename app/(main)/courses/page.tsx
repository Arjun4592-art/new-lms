import SectionHeading from '@/components/ui/SectionHeading'
import CourseCard, { CourseData } from '@/components/courses/CourseCard'
import WhatYouLearn from '@/components/courses/WhatYouLearn'
import Button from '@/components/ui/Button'
import { ArrowRightIcon } from '@/components/ui/Icons'

export const metadata = {
  title: 'Programs & Courses | Pain to Power Coaching',
  description:
    'Explore transformational coaching programs designed to help women heal, grow, and step into their power.',
}

export const COURSES_DATA: CourseData[] = [
  {
    id: 'pain-to-power-masterclass',
    title: 'Pain to Power Masterclass',
    description:
      'A transformational programme designed to help you identify emotional patterns, release suppressed pain, and step into confidence with clarity and strength.',
    duration: '60–90 min',
    format: 'Live + Recorded',
    students: 200,
    price: '₹2,999',
    originalPrice: '₹4,999',
    badge: 'Most Popular',
    badgeVariant: 'purple',
    emoji: '🔥',
    color: 'from-[#7C5CBF] to-[#A67DD4]',
    modules: 4,
    includes: ['Live session', 'Recording', 'Worksheets'],
  },
  {
    id: '5-day-challenge',
    title: '5-Day WhatsApp Challenge',
    description:
      'A guided 5-day immersive challenge delivered via WhatsApp to kickstart your healing journey with daily practices, reflections and community support.',
    duration: '5 Days',
    format: 'WhatsApp',
    students: 350,
    price: 'Free',
    badge: 'Free Entry',
    badgeVariant: 'green',
    emoji: '💬',
    color: 'from-[#A67DD4] to-[#C084F5]',
    modules: 5,
    includes: ['Daily prompts', 'Community', 'Resources'],
  },
  {
    id: '4-week-healing',
    title: '4-Week Emotional Healing Programme',
    description:
      'A deep-dive 4-week coaching programme with live Zoom sessions, recorded modules, optional 1:1 coaching, and a supportive community for lasting transformation.',
    duration: '4–8 Weeks',
    format: 'Live Zoom + 1:1',
    students: 120,
    price: '₹12,999',
    originalPrice: '₹18,999',
    badge: 'Signature',
    badgeVariant: 'gold',
    emoji: '✨',
    color: 'from-[#9B6FC8] to-[#7C5CBF]',
    modules: 8,
    includes: ['4 Zoom calls', '1:1 session', 'Full recordings'],
  },
  {
    id: 'self-boundaries',
    title: 'Self-Boundaries & Letting Go Course',
    description:
      'Learn how to set healthy boundaries without guilt or fear, and release what no longer serves you — so you can create space for what truly matters.',
    duration: 'Self-Paced',
    format: 'Recorded Modules',
    students: 180,
    price: '₹4,999',
    originalPrice: '₹7,999',
    badge: 'New',
    badgeVariant: 'pink',
    emoji: '🌸',
    color: 'from-[#C084F5] to-[#A67DD4]',
    modules: 4,
    includes: ['Video modules', 'Journal prompts', 'Affirmations'],
  },
  {
    id: 'healing-workshops',
    title: 'Recorded Healing Workshops',
    description:
      'Access a growing library of powerful healing workshops covering emotional resilience, self-worth, inner child healing, and more — all at your own pace.',
    duration: 'Lifetime Access',
    format: 'Recorded',
    students: 450,
    price: '₹1,499',
    badge: 'Beginner Friendly',
    badgeVariant: 'purple',
    emoji: '🌿',
    color: 'from-[#8B5CF6] to-[#9B6FC8]',
    modules: 6,
    includes: ['6+ workshops', 'PDFs', 'Lifetime access'],
  },
]

export default function CoursesPage() {
  return (
    <>
      {/* Hero */}
      <section className='pt-28 pb-16 px-4 bg-linear-to-br from-[#F9F5FF] via-[#F3EEFF] to-[#FDF4FF] relative overflow-hidden'>
        <div className='absolute top-10 right-10 w-64 h-64 bg-[#D4BEFF]/20 rounded-full blur-3xl' />
        <div className='max-w-4xl mx-auto text-center relative'>
          <span className='inline-block text-[12px] font-bold uppercase tracking-[0.15em] text-[#A67DD4] bg-[#F3EEFF] border border-purple-200 px-4 py-1.5 rounded-full mb-6'>
            Programs & Courses
          </span>
          <h1 className='font-serif text-[44px] sm:text-[54px] font-bold text-[#2D1B5E] leading-tight mb-6'>
            Choose Your Path to{' '}
            <span className='text-transparent bg-clip-text bg-linear-to-r from-[#7C5CBF] to-[#C084F5]'>
              Healing
            </span>
          </h1>
          <p className='text-[17px] text-[#6B5B8B] leading-relaxed max-w-2xl mx-auto'>
            Every woman's journey is unique. Whether you're just beginning or
            ready to go deep — there's a programme designed for exactly where
            you are right now.
          </p>
        </div>
      </section>

      {/* Courses grid */}
      <section className='py-16 px-4 bg-white'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {COURSES_DATA.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* What you'll learn */}
      <section className='py-16 px-4 bg-[#F9F5FF]'>
        <div className='max-w-4xl mx-auto'>
          <SectionHeading
            eyebrow='Across All Programs'
            title='What You Will Learn'
            center
          />
          <div className='mt-8'>
            <WhatYouLearn />
          </div>
        </div>
      </section>

      {/* Not sure section */}
      <section className='py-16 px-4 bg-white'>
        <div className='max-w-3xl mx-auto text-center'>
          <h2 className='font-serif text-[30px] sm:text-[36px] font-bold text-[#2D1B5E] mb-4'>
            Not sure which program is right for you?
          </h2>
          <p className='text-[16px] text-[#6B5B8B] leading-relaxed mb-8'>
            Book a free 30-minute exploration call with Masuma. Together, we'll
            figure out the best next step for your healing journey.
          </p>
          <Button href='/contact' size='lg'>
            Book a Free Exploration Call <ArrowRightIcon size={18} />
          </Button>
        </div>
      </section>
    </>
  )
}
