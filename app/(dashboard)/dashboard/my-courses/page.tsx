'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import EnrolledCourseCard from '@/components/dashboard/EnrollCourseCard'
import ProgressBar from '@/components/dashboard/ProgressBar'
import {
  ArrowRightIcon,
  BookIcon,
  CheckIcon,
  ClockIcon,
} from '@/components/ui/Icons'
import { useAuth } from '@/context/AuthContext'
import { useEnrolledCourses, useCourses } from '@/hooks/useCourse'
import { useUserEnrollments } from '@/hooks/useEnrollment'

export default function MyCoursesPage() {
  const { user, loading: authLoading } = useAuth()

  // ── Derive courseIds from enrollments, not user.enrolledCourses ──
  const {
    enrollments,
    loading: enrollmentsLoading,
    error: enrollmentsError,
    refetch: refetchEnrollments,
  } = useUserEnrollments(user?.uid, [])

  const courseIds = useMemo(() => Object.keys(enrollments), [enrollments])

  const { courses: enrolledCourses, loading: coursesLoading } =
    useEnrolledCourses(courseIds)
  const { courses: allCourses } = useCourses()

  const loading = authLoading || enrollmentsLoading || coursesLoading

  const availableCourses = allCourses.filter((c) => !courseIds.includes(c.id))
  const completed = enrolledCourses.filter(
    (c) => (enrollments[c.id]?.progress ?? 0) === 100,
  )
  const inProgress = enrolledCourses.filter(
    (c) => (enrollments[c.id]?.progress ?? 0) < 100,
  )
  const overallProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce(
            (s, c) => s + (enrollments[c.id]?.progress ?? 0),
            0,
          ) / enrolledCourses.length,
        )
      : 0

  if (loading) {
    return (
      <div className='space-y-6 max-w-5xl mx-auto animate-pulse'>
        <div className='h-10 w-48 bg-purple-100 rounded' />
        <div className='h-40 bg-purple-100 rounded-2xl' />
        <div className='h-64 bg-purple-100 rounded-2xl' />
      </div>
    )
  }

  if (enrollmentsError) {
    return (
      <div className='max-w-5xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-10 text-center'>
        <p className='text-[32px] mb-3'>⚠️</p>
        <p className='text-[16px] font-bold text-red-700 mb-1'>
          Failed to load your courses
        </p>
        <p className='text-[13.5px] text-red-500 mb-5'>
          {enrollmentsError.message}
        </p>
        <button
          onClick={refetchEnrollments}
          className='inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors'
        >
          Try Again
        </button>
      </div>
    )
  }

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
          {enrolledCourses.length} enrolled · {completed.length} completed
        </p>
      </div>

      {/* Overall stats */}
      {enrolledCourses.length > 0 && (
        <div className='bg-gradient-to-br from-[#7C5CBF] to-[#A67DD4] rounded-2xl p-6 text-white'>
          <div className='flex flex-wrap gap-8 mb-5'>
            {[
              {
                label: 'Enrolled',
                value: enrolledCourses.length,
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
                  <p className='text-[22px] font-bold leading-none'>
                    {s.value}
                  </p>
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
      )}

      {/* Empty state */}
      {enrolledCourses.length === 0 && (
        <div className='bg-[#F9F5FF] border border-purple-100 rounded-2xl p-10 text-center'>
          <p className='text-[40px] mb-3'>📚</p>
          <p className='text-[16px] font-bold text-[#2D1B5E] mb-1'>
            No courses yet
          </p>
          <p className='text-[13.5px] text-[#8470A8] mb-5'>
            Explore our programmes and start your transformation.
          </p>
          <Link
            href='/courses'
            className='inline-flex items-center gap-2 px-6 py-3 bg-[#7C5CBF] text-white font-bold rounded-xl no-underline hover:bg-[#6A4DAD] transition-colors'
          >
            Browse Courses <ArrowRightIcon size={14} />
          </Link>
        </div>
      )}

      {/* In Progress */}
      {inProgress.length > 0 && (
        <div>
          <h2 className='font-serif text-[20px] font-bold text-[#2D1B5E] mb-4 flex items-center gap-2'>
            <ClockIcon size={18} className='text-[#A67DD4]' /> In Progress
          </h2>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {inProgress.map((course) => (
              <EnrolledCourseCard
                key={course.id}
                course={course}
                enrollment={enrollments[course.id]}
              />
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
              <EnrolledCourseCard
                key={course.id}
                course={course}
                enrollment={enrollments[course.id]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Progress detail table */}
      {enrolledCourses.length > 0 && (
        <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden'>
          <div className='px-6 py-4 border-b border-purple-100 bg-[#F9F5FF] flex items-center justify-between'>
            <h2 className='font-serif text-[17px] font-bold text-[#2D1B5E]'>
              Progress Detail
            </h2>
            <button
              onClick={refetchEnrollments}
              className='text-[12px] text-[#7C5CBF] font-semibold hover:text-[#6A4DAD] transition-colors'
            >
              Refresh
            </button>
          </div>
          <div className='divide-y divide-purple-50'>
            {enrolledCourses.map((course) => {
              const enr = enrollments[course.id]
              return (
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
                        {enr?.completedLessons?.length ?? 0}/
                        {course.totalLessons} lessons
                      </p>
                    </div>
                  </div>
                  <div className='sm:w-48 shrink-0'>
                    <ProgressBar value={enr?.progress ?? 0} size='sm' />
                  </div>
                  <Link
                    href={`/dashboard/learn/${course.id}`}
                    className='shrink-0 flex items-center gap-1.5 text-[13px] font-semibold text-[#7C5CBF] hover:text-[#6A4DAD] no-underline'
                  >
                    {(enr?.progress ?? 0) === 100 ? 'Review' : 'Continue'}{' '}
                    <ArrowRightIcon size={14} />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Explore more */}
      {availableCourses.length > 0 && (
        <div>
          <h2 className='font-serif text-[20px] font-bold text-[#2D1B5E] mb-4'>
            Explore More Programmes
          </h2>
          <div className='grid sm:grid-cols-2 gap-5'>
            {availableCourses.map((course) => (
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
                      {course.isFree
                        ? 'Free'
                        : `₹${course.price.toLocaleString('en-IN')}`}
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
      )}
    </div>
  )
}
