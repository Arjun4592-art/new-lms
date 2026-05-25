import Link from 'next/link'
import ProgressBar from './ProgressBar'
import { PlayIcon, ClockIcon, CheckIcon } from '@/components/ui/Icons'

export interface EnrolledCourse {
  id: string
  title: string
  emoji: string
  color: string
  progress: number
  totalLessons: number
  completedLessons: number
  nextLesson?: string
  format: string
  enrolledDate: string
}

export default function EnrolledCourseCard({
  course,
}: {
  course: EnrolledCourse
}) {
  const isCompleted = course.progress === 100

  return (
    <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-purple-100/50 transition-all group'>
      {/* Header */}
      <div
        className={`h-28 bg-gradient-to-br ${course.color} flex items-center justify-center relative`}
      >
        <span className='text-[44px]'>{course.emoji}</span>
        {isCompleted && (
          <div className='absolute top-3 right-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1'>
            <CheckIcon size={10} /> Completed
          </div>
        )}
      </div>

      {/* Body */}
      <div className='p-5'>
        <h3 className='font-serif text-[15px] font-bold text-[#2D1B5E] mb-1 leading-snug group-hover:text-[#7C5CBF] transition-colors'>
          {course.title}
        </h3>

        <div className='flex items-center gap-3 text-[12px] text-[#8470A8] mb-4'>
          <div className='flex items-center gap-1'>
            <ClockIcon size={12} className='text-[#A67DD4]' /> {course.format}
          </div>
          <span>·</span>
          <span>
            {course.completedLessons}/{course.totalLessons} lessons
          </span>
        </div>

        <ProgressBar value={course.progress} size='sm' />

        {course.nextLesson && !isCompleted && (
          <p className='text-[11.5px] text-[#8470A8] mt-2 truncate'>
            Next:{' '}
            <span className='text-[#4A3570] font-medium'>
              {course.nextLesson}
            </span>
          </p>
        )}

        <Link
          href={`/dashboard/learn/${course.id}`}
          className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold no-underline transition-all ${
            isCompleted
              ? 'bg-[#F3EEFF] text-[#7C5CBF] hover:bg-[#E8DEFF]'
              : 'bg-[#7C5CBF] text-white hover:bg-[#6A4DAD]'
          }`}
        >
          <PlayIcon size={13} />
          {isCompleted ? 'Review Course' : 'Continue Learning'}
        </Link>
      </div>
    </div>
  )
}
