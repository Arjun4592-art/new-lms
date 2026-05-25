import Link from 'next/link'
import EnrolledCourseCard, {
  EnrolledCourse,
} from '@/components/dashboard/EnrollCourseCard'
import ProgressBar from '@/components/dashboard/ProgressBar'
import {
  ArrowRightIcon,
  BookIcon,
  CheckIcon,
  ClockIcon,
} from '@/components/ui/Icons'

const ENROLLED_COURSES: EnrolledCourse[] = [
  {
    id: 'pain-to-power-masterclass',
    title: 'Pain to Power Masterclass',
    emoji: '🔥',
    color: 'from-[#7C5CBF] to-[#A67DD4]',
    progress: 65,
    totalLessons: 13,
    completedLessons: 8,
    nextLesson: 'Module 3: The Art of Letting Go',
    format: 'Live + Recorded',
    enrolledDate: 'May 1, 2025',
  },
  {
    id: 'self-boundaries',
    title: 'Self-Boundaries & Letting Go',
    emoji: '🌸',
    color: 'from-[#C084F5] to-[#A67DD4]',
    progress: 100,
    totalLessons: 9,
    completedLessons: 9,
    format: 'Recorded Modules',
    enrolledDate: 'Apr 10, 2025',
  },
  {
    id: 'healing-workshops',
    title: 'Recorded Healing Workshops',
    emoji: '🌿',
    color: 'from-[#8B5CF6] to-[#9B6FC8]',
    progress: 33,
    totalLessons: 6,
    completedLessons: 2,
    nextLesson: 'Inner Child Healing Workshop',
    format: 'Recorded',
    enrolledDate: 'May 10, 2025',
  },
]

const AVAILABLE_COURSES = [
  {
    id: '5-day-challenge',
    title: '5-Day WhatsApp Challenge',
    emoji: '💬',
    color: 'from-[#A67DD4] to-[#C084F5]',
    price: 'Free',
    description:
      'Kickstart your healing in just 5 days with daily WhatsApp guidance.',
  },
  {
    id: '4-week-healing',
    title: '4-Week Emotional Healing Programme',
    emoji: '✨',
    color: 'from-[#9B6FC8] to-[#7C5CBF]',
    price: '₹12,999',
    description:
      'The deep-dive signature programme with live Zoom + 1:1 coaching.',
  },
]

export default function MyCoursesPage() {
  const completed = ENROLLED_COURSES.filter((c) => c.progress === 100)
  const inProgress = ENROLLED_COURSES.filter((c) => c.progress < 100)
  const overallProgress = Math.round(
    ENROLLED_COURSES.reduce((s, c) => s + c.progress, 0) /
      ENROLLED_COURSES.length,
  )

  return (
    <div className='space-y-8 max-w-5xl mx-auto'>
      {/* Header */}
      <div>
        <p className='text-[12px] text-[#A67DD4] font-semibold uppercase tracking-widest mb-1'>
          Student Portal
        </p>
        <h1 className='font-serif text-[26px] sm:text-[30px] font-bold text-[#2D1B5E]'>
          My Courses
        </h1>
        <p className='text-[14px] text-[#8470A8] mt-1'>
          {ENROLLED_COURSES.length} enrolled · {completed.length} completed
        </p>
      </div>

      {/* Overall stats */}
      <div className='bg-gradient-to-br from-[#7C5CBF] to-[#A67DD4] rounded-2xl p-6 text-white'>
        <div className='flex flex-wrap gap-8 mb-5'>
          {[
            {
              label: 'Enrolled',
              value: ENROLLED_COURSES.length,
              icon: <BookIcon size={16} className='text-purple-200' />,
            },
            {
              label: 'Completed',
              value: completed.length,
              icon: <CheckIcon size={16} className='text-purple-200' />,
            },
            {
              label: 'In Progress',
              value: inProgress.length,
              icon: <ClockIcon size={16} className='text-purple-200' />,
            },
          ].map((s) => (
            <div key={s.label} className='flex items-center gap-3'>
              <div className='w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center'>
                {s.icon}
              </div>
              <div>
                <p className='text-[22px] font-bold leading-none'>{s.value}</p>
                <p className='text-purple-200 text-[12px]'>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className='flex items-center justify-between mb-1.5'>
            <p className='text-[13px] text-purple-100'>Overall Progress</p>
            <p className='text-[13px] font-bold'>{overallProgress}%</p>
          </div>
          <div className='h-2 bg-white/20 rounded-full overflow-hidden'>
            <div
              className='h-full bg-white rounded-full transition-all duration-500'
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* In Progress */}
      {inProgress.length > 0 && (
        <div>
          <h2 className='font-serif text-[20px] font-bold text-[#2D1B5E] mb-4 flex items-center gap-2'>
            <ClockIcon size={18} className='text-[#A67DD4]' /> In Progress
          </h2>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {inProgress.map((course) => (
              <EnrolledCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className='font-serif text-[20px] font-bold text-[#2D1B5E] mb-4 flex items-center gap-2'>
            <CheckIcon size={18} className='text-green-500' /> Completed
          </h2>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {completed.map((course) => (
              <EnrolledCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* Course progress detail table */}
      <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden'>
        <div className='px-6 py-4 border-b border-purple-100 bg-[#F9F5FF]'>
          <h2 className='font-serif text-[17px] font-bold text-[#2D1B5E]'>
            Progress Detail
          </h2>
        </div>
        <div className='divide-y divide-purple-50'>
          {ENROLLED_COURSES.map((course) => (
            <div
              key={course.id}
              className='px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4'
            >
              <div className='flex items-center gap-3 flex-1 min-w-0'>
                <span className='text-[28px] shrink-0'>{course.emoji}</span>
                <div className='min-w-0'>
                  <p className='text-[14px] font-semibold text-[#2D1B5E] truncate'>
                    {course.title}
                  </p>
                  <p className='text-[12px] text-[#8470A8]'>
                    Enrolled {course.enrolledDate} · {course.completedLessons}/
                    {course.totalLessons} lessons
                  </p>
                </div>
              </div>
              <div className='sm:w-48 shrink-0'>
                <ProgressBar value={course.progress} size='sm' />
              </div>
              <Link
                href={`/dashboard/learn/${course.id}`}
                className='shrink-0 flex items-center gap-1.5 text-[13px] font-semibold text-[#7C5CBF] hover:text-[#6A4DAD] no-underline'
              >
                {course.progress === 100 ? 'Review' : 'Continue'}{' '}
                <ArrowRightIcon size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Explore more */}
      <div>
        <h2 className='font-serif text-[20px] font-bold text-[#2D1B5E] mb-4'>
          Explore More Programmes
        </h2>
        <div className='grid sm:grid-cols-2 gap-5'>
          {AVAILABLE_COURSES.map((course) => (
            <div
              key={course.id}
              className='bg-white border border-purple-100 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-purple-100/50 transition-all group'
            >
              <div
                className={`h-24 bg-gradient-to-br ${course.color} flex items-center justify-center`}
              >
                <span className='text-[40px]'>{course.emoji}</span>
              </div>
              <div className='p-5'>
                <h3 className='font-serif text-[16px] font-bold text-[#2D1B5E] mb-1 group-hover:text-[#7C5CBF] transition-colors'>
                  {course.title}
                </h3>
                <p className='text-[13px] text-[#8470A8] mb-4 leading-relaxed'>
                  {course.description}
                </p>
                <div className='flex items-center justify-between'>
                  <span className='text-[16px] font-bold text-[#2D1B5E]'>
                    {course.price}
                  </span>
                  <Link
                    href={`/courses/${course.id}`}
                    className='flex items-center gap-1.5 text-[13px] font-semibold text-[#7C5CBF] hover:text-[#6A4DAD] no-underline'
                  >
                    View Program <ArrowRightIcon size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
