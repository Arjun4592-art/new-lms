'use client'

import { useParams, useRouter } from 'next/navigation'
import { useCourse } from '@/hooks/useCourse'
import { useEnrollment } from '@/hooks/useEnrollment'
import { useAuthContext } from '@/context/AuthContext'
import EnrollButton from '@/components/courses/EnrollButton'
import {
  ClockIcon,
  PlayIcon,
  UsersIcon,
  CheckIcon,
} from '@/components/ui/Icons'

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { course, loading, error } = useCourse(courseId)
  const { user } = useAuthContext()
  const { enrollment } = useEnrollment(user?.uid, courseId)

  if (loading) {
    return (
      <div className='min-h-screen animate-pulse pt-24'>
        <div className='max-w-6xl mx-auto px-4 space-y-6'>
          <div className='h-64 bg-surface rounded-3xl' />
          <div className='grid lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2 space-y-4'>
              <div className='h-8 w-2/3 bg-surface rounded' />
              <div className='h-32 bg-surface rounded-xl' />
            </div>
            <div className='h-64 bg-surface rounded-2xl' />
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-primary-muted'>Course not found.</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(to bottom right, ${course.color}, ${course.color}dd)`,
        }}
        className='pt-28 pb-16 px-4'
      >
        <div className='max-w-6xl mx-auto'>
          <span className='text-[60px]'>{course.emoji}</span>
          <h1 className='font-serif text-[36px] sm:text-[44px] font-bold text-white leading-tight mt-4 mb-4'>
            {course.title}
          </h1>
          <p className='text-white/80 text-[17px] leading-relaxed max-w-2xl mb-6'>
            {course.description}
          </p>
          <div className='flex flex-wrap gap-5 text-white/80 text-[14px]'>
            <div className='flex items-center gap-2'>
              <ClockIcon size={15} /> {course.totalDuration} min total
            </div>
            <div className='flex items-center gap-2'>
              <PlayIcon size={15} /> {course.totalLessons} lessons
            </div>
            <div className='flex items-center gap-2'>
              <UsersIcon size={15} /> {course.format}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-8'>
          {/* What you'll learn */}
          {course.whatYouLearn && course.whatYouLearn.length > 0 && (
            <div className='bg-white border border-surface-border rounded-2xl p-6'>
              <h2 className='font-serif text-[20px] font-bold text-primary-dark mb-5'>
                What You Will Learn
              </h2>
              <div className='grid sm:grid-cols-2 gap-3'>
                {course.whatYouLearn.map((item) => (
                  <div key={item} className='flex items-start gap-3'>
                    <div className='w-5 h-5 rounded-full bg-surface flex items-center justify-center shrink-0 mt-0.5'>
                      <CheckIcon size={10} className='text-primary' />
                    </div>
                    <p className='text-[14px] text-primary-mid'>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Includes */}
          {course.includes && course.includes.length > 0 && (
            <div className='bg-white border border-surface-border rounded-2xl p-6'>
              <h2 className='font-serif text-[20px] font-bold text-primary-dark mb-5'>
                This Course Includes
              </h2>
              <div className='space-y-2'>
                {course.includes.map((item) => (
                  <div key={item} className='flex items-center gap-3'>
                    <CheckIcon size={14} className='text-primary shrink-0' />
                    <p className='text-[14px] text-primary-mid'>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enroll card */}
        <div>
          <EnrollButton
            courseId={courseId}
            isFree={course.isFree}
            isEnrolled={!!enrollment}
          />
        </div>
      </div>
    </div>
  )
}
