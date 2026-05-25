import Link from 'next/link'
import EnrolledCourseCard, {
  EnrolledCourse,
} from '../../../components/dashboard/EnrollCourseCard'
import ProgressBar from '@/components/dashboard/ProgressBar'
import {
  SparkleIcon,
  BookIcon,
  ClockIcon,
  CheckIcon,
  ArrowRightIcon,
  DownloadIcon,
} from '@/components/ui/Icons'

const ENROLLED_COURSES: EnrolledCourse[] = [
  {
    id: 'pain-to-power-masterclass',
    title: 'Pain to Power Masterclass',
    emoji: '🔥',
    color: 'from-[#7C5CBF] to-[#A67DD4]',
    progress: 65,
    totalLessons: 8,
    completedLessons: 5,
    nextLesson: 'Module 6: Breaking Emotional Patterns',
    format: 'Live + Recorded',
    enrolledDate: 'May 1, 2025',
  },
  {
    id: 'self-boundaries',
    title: 'Self-Boundaries & Letting Go',
    emoji: '🌸',
    color: 'from-[#C084F5] to-[#A67DD4]',
    progress: 100,
    totalLessons: 6,
    completedLessons: 6,
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

const RESOURCES = [
  { title: 'Emotional Patterns Worksheet', type: 'PDF', size: '1.2 MB' },
  { title: 'Daily Affirmation Sheet', type: 'PDF', size: '0.8 MB' },
  { title: 'Reflection Journal — Week 1', type: 'PDF', size: '2.1 MB' },
  { title: 'Boundary Setting Guide', type: 'PDF', size: '1.5 MB' },
]

const UPCOMING = [
  {
    title: 'Group Zoom Call — Emotional Resilience',
    date: 'May 22, 2025',
    time: '7:00 PM IST',
    type: 'Live',
  },
  {
    title: '1:1 Coaching Call with Masuma',
    date: 'May 25, 2025',
    time: '5:00 PM IST',
    type: '1:1',
  },
]

export default function DashboardPage() {
  const totalProgress = Math.round(
    ENROLLED_COURSES.reduce((s, c) => s + c.progress, 0) /
      ENROLLED_COURSES.length,
  )
  const completedCourses = ENROLLED_COURSES.filter(
    (c) => c.progress === 100,
  ).length

  return (
    <div className='space-y-6 max-w-5xl mx-auto'>
      {/* Welcome banner */}
      <div className='bg-gradient-to-br from-[#7C5CBF] to-[#A67DD4] rounded-3xl p-7 text-white relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2' />
        <div className='relative'>
          <div className='flex items-center gap-2 mb-2'>
            <SparkleIcon size={18} className='text-purple-200' />
            <span className='text-[13px] text-purple-200 font-medium'>
              Your healing journey
            </span>
          </div>
          <h1 className='font-serif text-[28px] sm:text-[32px] font-bold mb-2'>
            You're doing amazing, Priya! 🌸
          </h1>
          <p className='text-purple-100 text-[14.5px] mb-5'>
            Keep going — every step forward is a step toward your power.
          </p>
          <div className='flex flex-wrap gap-6'>
            <div>
              <p className='text-[26px] font-bold'>{totalProgress}%</p>
              <p className='text-purple-200 text-[12px]'>Overall progress</p>
            </div>
            <div>
              <p className='text-[26px] font-bold'>{ENROLLED_COURSES.length}</p>
              <p className='text-purple-200 text-[12px]'>Enrolled courses</p>
            </div>
            <div>
              <p className='text-[26px] font-bold'>{completedCourses}</p>
              <p className='text-purple-200 text-[12px]'>Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall progress */}
      <div className='bg-white border border-purple-100 rounded-2xl p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='font-serif text-[17px] font-bold text-[#2D1B5E]'>
            Overall Progress
          </h2>
          <span className='text-[13px] text-[#7C5CBF] font-semibold'>
            {totalProgress}% complete
          </span>
        </div>
        <ProgressBar value={totalProgress} showPercent={false} />
        <div className='mt-4 grid grid-cols-3 gap-3'>
          {[
            {
              label: 'Courses Enrolled',
              value: ENROLLED_COURSES.length,
              icon: <BookIcon size={16} className='text-[#7C5CBF]' />,
            },
            {
              label: 'Lessons Done',
              value: ENROLLED_COURSES.reduce(
                (s, c) => s + c.completedLessons,
                0,
              ),
              icon: <CheckIcon size={16} className='text-green-500' />,
            },
            {
              label: 'Hours Learned',
              value: '12h',
              icon: <ClockIcon size={16} className='text-[#A67DD4]' />,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className='bg-[#F9F5FF] rounded-xl p-3 text-center'
            >
              <div className='flex justify-center mb-1'>{stat.icon}</div>
              <p className='text-[18px] font-bold text-[#2D1B5E]'>
                {stat.value}
              </p>
              <p className='text-[11px] text-[#8470A8]'>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* My courses */}
      <div>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='font-serif text-[20px] font-bold text-[#2D1B5E]'>
            My Courses
          </h2>
          <Link
            href='/dashboard/my-courses'
            className='text-[13px] text-[#7C5CBF] font-semibold hover:text-[#6A4DAD] no-underline flex items-center gap-1'
          >
            View all <ArrowRightIcon size={14} />
          </Link>
        </div>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {ENROLLED_COURSES.map((course) => (
            <EnrolledCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      <div className='grid lg:grid-cols-2 gap-6'>
        {/* Upcoming sessions */}
        <div className='bg-white border border-purple-100 rounded-2xl p-6'>
          <h2 className='font-serif text-[17px] font-bold text-[#2D1B5E] mb-4'>
            Upcoming Sessions
          </h2>
          {UPCOMING.length === 0 ? (
            <p className='text-[13.5px] text-[#8470A8]'>
              No upcoming sessions.
            </p>
          ) : (
            <div className='space-y-3'>
              {UPCOMING.map((s) => (
                <div
                  key={s.title}
                  className='flex items-start gap-3 p-3 bg-[#F9F5FF] rounded-xl border border-purple-100'
                >
                  <div className='w-9 h-9 rounded-xl bg-[#7C5CBF] flex items-center justify-center text-white shrink-0'>
                    <ClockIcon size={16} />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-[13px] font-semibold text-[#2D1B5E] truncate'>
                      {s.title}
                    </p>
                    <p className='text-[11.5px] text-[#8470A8]'>
                      {s.date} · {s.time}
                    </p>
                  </div>
                  <span className='text-[11px] bg-[#F3EEFF] text-[#7C5CBF] border border-purple-200 px-2 py-0.5 rounded-full font-semibold shrink-0'>
                    {s.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resources */}
        <div className='bg-white border border-purple-100 rounded-2xl p-6'>
          <h2 className='font-serif text-[17px] font-bold text-[#2D1B5E] mb-4'>
            My Resources
          </h2>
          <div className='space-y-2.5'>
            {RESOURCES.map((r) => (
              <div
                key={r.title}
                className='flex items-center gap-3 p-3 hover:bg-[#F9F5FF] rounded-xl transition-colors group cursor-pointer'
              >
                <div className='w-8 h-8 bg-[#F3EEFF] rounded-lg flex items-center justify-center shrink-0'>
                  <DownloadIcon size={14} className='text-[#7C5CBF]' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-[13px] font-medium text-[#2D1B5E] truncate'>
                    {r.title}
                  </p>
                  <p className='text-[11px] text-[#8470A8]'>
                    {r.type} · {r.size}
                  </p>
                </div>
                <DownloadIcon
                  size={14}
                  className='text-[#A67DD4] opacity-0 group-hover:opacity-100 transition-opacity shrink-0'
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explore more */}
      <div className='bg-gradient-to-br from-[#F3EEFF] to-[#FDF4FF] border border-purple-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div>
          <h3 className='font-serif text-[18px] font-bold text-[#2D1B5E]'>
            Ready for the next step?
          </h3>
          <p className='text-[14px] text-[#6B5B8B] mt-1'>
            Explore more programmes to continue your transformation.
          </p>
        </div>
        <Link
          href='/courses'
          className='shrink-0 px-6 py-3 bg-[#7C5CBF] text-white font-bold rounded-xl no-underline hover:bg-[#6A4DAD] transition-colors flex items-center gap-2 text-[14px]'
        >
          Explore Courses <ArrowRightIcon size={16} />
        </Link>
      </div>
    </div>
  )
}
