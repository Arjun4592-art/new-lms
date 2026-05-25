import Link from 'next/link'
import SectionHeading from '@/components/ui/SectionHeading'
import {
  ClockIcon,
  UsersIcon,
  ArrowRightIcon,
  PlayIcon,
  BookIcon,
} from '@/components/ui/Icons'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const COURSES = [
  {
    id: 'pain-to-power-masterclass',
    title: 'Pain to Power Masterclass',
    description:
      'A transformational programme to identify emotional patterns, release suppressed pain, and step into confidence with clarity and strength.',
    duration: '60–90 min',
    format: 'Live + Recorded',
    badge: 'Most Popular',
    badgeVariant: 'purple' as const,
    emoji: '🔥',
    color: 'from-[#7C5CBF] to-[#A67DD4]',
  },
  {
    id: '5-day-challenge',
    title: '5-Day WhatsApp Challenge',
    description:
      'A guided 5-day immersive challenge delivered via WhatsApp to kickstart your healing journey with daily practices and community support.',
    duration: '5 Days',
    format: 'WhatsApp',
    badge: 'Free Entry',
    badgeVariant: 'green' as const,
    emoji: '💬',
    color: 'from-[#A67DD4] to-[#C084F5]',
  },
  {
    id: '4-week-healing',
    title: '4-Week Emotional Healing Programme',
    description:
      'A deep-dive 4-week coaching programme with live Zoom sessions, recorded modules, and 1:1 coaching calls for lasting transformation.',
    duration: '4–8 Weeks',
    format: 'Live Zoom + 1:1',
    badge: 'Signature',
    badgeVariant: 'gold' as const,
    emoji: '✨',
    color: 'from-[#9B6FC8] to-[#7C5CBF]',
  },
  {
    id: 'self-boundaries',
    title: 'Self-Boundaries & Letting Go',
    description:
      'Learn how to set healthy boundaries without guilt and release what no longer serves you — so you can truly thrive.',
    duration: 'Self-Paced',
    format: 'Recorded Modules',
    badge: 'New',
    badgeVariant: 'pink' as const,
    emoji: '🌸',
    color: 'from-[#C084F5] to-[#A67DD4]',
  },
]

export default function CoursesPreview() {
  return (
    <section className='py-20 px-4 bg-white'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12'>
          <SectionHeading
            eyebrow='Programs & Courses'
            title='Choose Your Path to Healing'
            subtitle="Every woman's journey is unique. Find the program that speaks to your heart."
          />
          <Button
            href='/courses'
            variant='outline'
            size='sm'
            className='shrink-0'
          >
            View All Programs <ArrowRightIcon size={16} />
          </Button>
        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {COURSES.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className='group block bg-white border border-purple-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-purple-100/60 hover:-translate-y-1 transition-all duration-300 no-underline'
            >
              {/* Card header */}
              <div
                className={`h-32 bg-linear-to-br ${course.color} flex items-center justify-center relative`}
              >
                <span className='text-[44px]'>{course.emoji}</span>
                <div className='absolute top-3 right-3'>
                  <Badge variant={course.badgeVariant}>{course.badge}</Badge>
                </div>
              </div>

              {/* Card body */}
              <div className='p-5'>
                <h3 className='font-serif text-[16px] font-bold text-[#2D1B5E] mb-2 group-hover:text-[#7C5CBF] transition-colors leading-snug'>
                  {course.title}
                </h3>
                <p className='text-[13px] text-[#8470A8] leading-relaxed mb-4 line-clamp-3'>
                  {course.description}
                </p>

                <div className='space-y-1.5'>
                  <div className='flex items-center gap-2 text-[12px] text-[#8470A8]'>
                    <ClockIcon size={13} className='text-[#A67DD4]' />
                    {course.duration}
                  </div>
                  <div className='flex items-center gap-2 text-[12px] text-[#8470A8]'>
                    <PlayIcon size={13} className='text-[#A67DD4]' />
                    {course.format}
                  </div>
                </div>

                <div className='mt-4 pt-4 border-t border-purple-50 flex items-center justify-between'>
                  <span className='text-[13px] font-semibold text-[#7C5CBF]'>
                    Learn More
                  </span>
                  <ArrowRightIcon
                    size={15}
                    className='text-[#7C5CBF] group-hover:translate-x-1 transition-transform'
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
