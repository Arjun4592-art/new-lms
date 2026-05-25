import { notFound } from 'next/navigation'
import { COURSES_DATA } from '../page'
import WhatYouLearn from '@/components/courses/WhatYouLearn'
import CourseIncludes from '@/components/courses/CourseIncludes'
import EnrollButton from '@/components/courses/EnrollButton'
// import Badge from '../../../../components/ui/Badge'
import { ClockIcon, PlayIcon, UsersIcon, StarIcon } from '@/components/ui/Icons'

interface Props {
  params: { courseId: string }
}

export function generateStaticParams() {
  return COURSES_DATA.map((c) => ({ courseId: c.id }))
}

export async function generateMetadata({ params }: Props) {
  const course = COURSES_DATA.find((c) => c.id === params.courseId)
  if (!course) return {}
  return {
    title: `${course.title} | Pain to Power Coaching`,
    description: course.description,
  }
}

export default function CourseDetailPage({ params }: Props) {
  const course = COURSES_DATA.find((c) => c.id === params.courseId)
  if (!course) notFound()

  return (
    <>
      {/* Hero */}
      <section
        className={`pt-24 pb-14 px-4 bg-linear-to-br ${course.color} relative overflow-hidden`}
      >
        <div className='absolute inset-0 bg-black/20' />
        <div className='relative max-w-6xl mx-auto'>
          <div className='flex flex-wrap gap-2 mb-5'>
            {/* {course.badge && (
              <Badge variant={course.badgeVariant ?? 'purple'}>
                {course.badge}
              </Badge>
            )} */}
          </div>
          <h1 className='font-serif text-[36px] sm:text-[48px] font-bold text-white leading-tight mb-4 max-w-3xl'>
            {course.title}
          </h1>
          <p className='text-[17px] text-white/80 leading-relaxed max-w-2xl mb-8'>
            {course.description}
          </p>
          <div className='flex flex-wrap gap-5 text-white/80 text-[14px]'>
            <div className='flex items-center gap-2'>
              <ClockIcon size={15} /> {course.duration}
            </div>
            <div className='flex items-center gap-2'>
              <PlayIcon size={15} /> {course.format}
            </div>
            {course.students && (
              <div className='flex items-center gap-2'>
                <UsersIcon size={15} /> {course.students}+ enrolled
              </div>
            )}
            <div className='flex items-center gap-2'>
              {[1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  width='13'
                  height='13'
                  viewBox='0 0 24 24'
                  fill='#F5A623'
                >
                  <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
                </svg>
              ))}
              <span>5.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className='py-14 px-4 bg-white'>
        <div className='max-w-6xl mx-auto grid lg:grid-cols-3 gap-10'>
          {/* Left - main content */}
          <div className='lg:col-span-2 space-y-8'>
            <WhatYouLearn />
            <CourseIncludes />

            {/* About this programme */}
            <div className='bg-[#F9F5FF] border border-purple-100 rounded-2xl p-7'>
              <h3 className='font-serif text-[20px] font-bold text-[#2D1B5E] mb-4'>
                About This Programme
              </h3>
              <div className='space-y-3 text-[14.5px] text-[#6B5B8B] leading-relaxed'>
                <p>
                  This programme is designed for women who are ready to stop
                  surviving and start truly living. Whether you're dealing with
                  past trauma, emotional overwhelm, or simply feeling lost —
                  this is your safe space to heal and rise.
                </p>
                <p>
                  Through a combination of {course.format.toLowerCase()}, guided
                  worksheets, reflection journals, affirmation sheets, and
                  community support, you will gain the tools, clarity, and
                  confidence to transform your life from the inside out.
                </p>
                <p>
                  Payment is available as a one-time payment or in instalment
                  options. Early bird and limited-time pricing may be available
                  — enquire to find out more.
                </p>
              </div>
            </div>

            {/* For whom */}
            <div className='bg-white border border-purple-100 rounded-2xl p-7'>
              <h3 className='font-serif text-[20px] font-bold text-[#2D1B5E] mb-4'>
                This Programme Is For You If…
              </h3>
              <ul className='space-y-3'>
                {[
                  "You feel emotionally overwhelmed and don't know where to start",
                  "You've been people-pleasing for so long you've lost yourself",
                  "You want to set boundaries but don't know how without guilt",
                  'You carry pain from your past or from generations before you',
                  "You're ready to invest in yourself and your healing",
                ].map((item) => (
                  <li
                    key={item}
                    className='flex items-start gap-3 text-[14px] text-[#4A3570]'
                  >
                    <span className='text-[#7C5CBF] mt-0.5'>✦</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right - sticky enroll */}
          <div>
            <EnrollButton courseTitle={course.title} price={course.price} />
          </div>
        </div>
      </section>
    </>
  )
}
