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
        {[48, 160, 256].map((h, i) => (
          <div
            key={i}
            className='rounded-xl'
            style={{ height: h, backgroundColor: 'var(--color-surface)' }}
          />
        ))}
      </div>
    )
  }

  if (enrollmentsError) {
    return (
      <div
        className='max-w-5xl mx-auto rounded-xl p-10 text-center'
        style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}
      >
        <p className='text-[32px] mb-3'>⚠️</p>
        <p
          className='text-[16px] font-semibold mb-1'
          style={{ color: '#B91C1C' }}
        >
          Failed to load your courses
        </p>
        <p className='text-[13.5px] mb-5' style={{ color: '#DC2626' }}>
          {enrollmentsError.message}
        </p>
        <button
          onClick={refetchEnrollments}
          className='inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold'
          style={{ backgroundColor: '#DC2626', color: '#fff' }}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .mc-stats-banner {
          border-radius: 12px; padding: 24px;
          background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary-mid) 100%);
        }
        .mc-stat-icon {
          width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
        }
        .mc-progress-track {
          height: 8px; border-radius: 9999px; overflow: hidden;
          background: rgba(255,255,255,0.2);
        }
        .mc-progress-fill {
          height: 100%; border-radius: 9999px; background: rgba(255,255,255,0.9);
          transition: width 0.5s ease;
        }
        .mc-table {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; overflow: hidden;
        }
        .mc-table-header {
          padding: 14px 24px;
          background-color: var(--color-surface);
          border-bottom: 1px solid var(--color-surface-border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .mc-table-row {
          padding: 16px 24px;
          display: flex; flex-direction: column; gap: 12px;
          border-bottom: 1px solid var(--color-surface-border);
        }
        .mc-table-row:last-child { border-bottom: none; }
        @media (min-width: 640px) {
          .mc-table-row { flex-direction: row; align-items: center; }
        }
        .mc-explore-card {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .mc-explore-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(44,34,24,0.10);
        }
        .mc-explore-card:hover .mc-explore-title { color: var(--color-primary); }
        .mc-explore-title { color: var(--color-text); transition: color 0.2s; }

        .mc-empty {
          background-color: var(--color-surface);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; padding: 40px; text-align: center;
        }
        .mc-primary-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          background-color: var(--color-primary);
          color: var(--color-bg); text-decoration: none;
          transition: background-color 0.2s;
        }
        .mc-primary-btn:hover { background-color: var(--color-primary-hover); }
      `}</style>

      <div className='space-y-8 max-w-5xl mx-auto'>
        {/* ── Header ── */}
        <div>
          <p
            className='text-[11px] font-semibold uppercase tracking-widest mb-1'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            Student Portal
          </p>
          <h1
            className='font-serif text-[26px] sm:text-[30px] font-medium'
            style={{ color: 'var(--color-text)' }}
          >
            My Courses
          </h1>
          <p
            className='text-[14px] mt-1'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            {enrolledCourses.length} enrolled · {completed.length} completed
          </p>
        </div>

        {/* ── Stats banner ── */}
        {enrolledCourses.length > 0 && (
          <div className='mc-stats-banner'>
            <div className='flex flex-wrap gap-8 mb-5'>
              {[
                {
                  label: 'Enrolled',
                  value: enrolledCourses.length,
                  icon: (
                    <BookIcon
                      size={16}
                      style={{ color: 'var(--color-primary-muted)' }}
                    />
                  ),
                },
                {
                  label: 'Completed',
                  value: completed.length,
                  icon: (
                    <CheckIcon
                      size={16}
                      style={{ color: 'var(--color-primary-muted)' }}
                    />
                  ),
                },
                {
                  label: 'In Progress',
                  value: inProgress.length,
                  icon: (
                    <ClockIcon
                      size={16}
                      style={{ color: 'var(--color-primary-muted)' }}
                    />
                  ),
                },
              ].map((s) => (
                <div key={s.label} className='flex items-center gap-3'>
                  <div className='mc-stat-icon'>{s.icon}</div>
                  <div>
                    <p
                      className='text-[22px] font-semibold leading-none'
                      style={{ color: 'var(--color-primary-light)' }}
                    >
                      {s.value}
                    </p>
                    <p
                      className='text-[12px]'
                      style={{ color: 'var(--color-primary-muted)' }}
                    >
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className='flex items-center justify-between mb-1.5'>
                <p
                  className='text-[13px]'
                  style={{ color: 'var(--color-primary-accent)' }}
                >
                  Overall Progress
                </p>
                <p
                  className='text-[13px] font-semibold'
                  style={{ color: 'var(--color-primary-light)' }}
                >
                  {overallProgress}%
                </p>
              </div>
              <div className='mc-progress-track'>
                <div
                  className='mc-progress-fill'
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {enrolledCourses.length === 0 && (
          <div className='mc-empty'>
            <p className='text-[40px] mb-3'>📚</p>
            <p
              className='text-[16px] font-medium mb-1'
              style={{ color: 'var(--color-text)' }}
            >
              No courses yet
            </p>
            <p
              className='text-[13.5px] mb-5 font-light'
              style={{ color: 'var(--color-primary-muted)' }}
            >
              Explore our programmes and start your transformation.
            </p>
            <Link href='/courses' className='mc-primary-btn'>
              Browse Courses <ArrowRightIcon size={14} />
            </Link>
          </div>
        )}

        {/* ── In Progress ── */}
        {inProgress.length > 0 && (
          <div>
            <h2
              className='font-serif text-[20px] font-medium mb-4 flex items-center gap-2'
              style={{ color: 'var(--color-text)' }}
            >
              <ClockIcon
                size={18}
                style={{ color: 'var(--color-primary-muted)' }}
              />{' '}
              In Progress
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

        {/* ── Completed ── */}
        {completed.length > 0 && (
          <div>
            <h2
              className='font-serif text-[20px] font-medium mb-4 flex items-center gap-2'
              style={{ color: 'var(--color-text)' }}
            >
              <CheckIcon size={18} style={{ color: '#16A34A' }} /> Completed
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

        {/* ── Progress detail ── */}
        {enrolledCourses.length > 0 && (
          <div className='mc-table'>
            <div className='mc-table-header'>
              <h2
                className='font-serif text-[17px] font-medium'
                style={{ color: 'var(--color-text)' }}
              >
                Progress Detail
              </h2>
              <button
                onClick={refetchEnrollments}
                className='text-[12px] font-semibold'
                style={{
                  color: 'var(--color-primary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = 'var(--color-primary-hover)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'var(--color-primary)')
                }
              >
                Refresh
              </button>
            </div>
            <div>
              {enrolledCourses.map((course) => {
                const enr = enrollments[course.id]
                return (
                  <div key={course.id} className='mc-table-row'>
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <span className='text-[28px] shrink-0'>
                        {course.emoji}
                      </span>
                      <div className='min-w-0'>
                        <p
                          className='text-[14px] font-semibold truncate'
                          style={{ color: 'var(--color-text)' }}
                        >
                          {course.title}
                        </p>
                        <p
                          className='text-[12px]'
                          style={{ color: 'var(--color-primary-muted)' }}
                        >
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
                      className='shrink-0 flex items-center gap-1.5 text-[13px] font-semibold no-underline'
                      style={{ color: 'var(--color-primary)' }}
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

        {/* ── Explore more ── */}
        {availableCourses.length > 0 && (
          <div>
            <h2
              className='font-serif text-[20px] font-medium mb-4'
              style={{ color: 'var(--color-text)' }}
            >
              Explore More Programmes
            </h2>
            <div className='grid sm:grid-cols-2 gap-5'>
              {availableCourses.map((course) => (
                <div key={course.id} className='mc-explore-card'>
                  <div
                    className={`h-24 bg-gradient-to-br ${course.color} flex items-center justify-center`}
                  >
                    <span className='text-[40px]'>{course.emoji}</span>
                  </div>
                  <div className='p-5'>
                    <h3 className='mc-explore-title font-serif text-[16px] font-medium mb-1'>
                      {course.title}
                    </h3>
                    <p
                      className='text-[13px] mb-4 leading-relaxed font-light'
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {course.description}
                    </p>
                    <div className='flex items-center justify-between'>
                      <span
                        className='text-[16px] font-semibold'
                        style={{ color: 'var(--color-text)' }}
                      >
                        {course.isFree
                          ? 'Free'
                          : `₹${course.price.toLocaleString('en-IN')}`}
                      </span>
                      <Link
                        href={`/courses/${course.id}`}
                        className='flex items-center gap-1.5 text-[13px] font-semibold no-underline'
                        style={{ color: 'var(--color-primary)' }}
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
    </>
  )
}
