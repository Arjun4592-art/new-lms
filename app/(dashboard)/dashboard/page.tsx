'use client'

import Link from 'next/link'
import { useAuthContext } from '@/context/AuthContext'
import { useEnrolledCourses } from '@/hooks/useCourse'
import { useUserEnrollments } from '@/hooks/useEnrollment'
import ProgressBar from '@/components/dashboard/ProgressBar'
import EnrolledCourseCard from '@/components/dashboard/EnrollCourseCard'
import {
  SparkleIcon,
  BookIcon,
  ClockIcon,
  CheckIcon,
  ArrowRightIcon,
  DownloadIcon,
} from '@/components/ui/Icons'
import { useEffect, useState, useMemo } from 'react'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuthContext()

  // ── Derive courseIds from enrollments (not user.enrolledCourses) ──
  const { enrollments, loading: enrollmentsLoading } = useUserEnrollments(
    user?.uid,
    [],
  )

  const courseIds = useMemo(() => Object.keys(enrollments), [enrollments])

  const { courses: enrolledCourses, loading: coursesLoading } =
    useEnrolledCourses(courseIds)

  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
  const [recentResources, setRecentResources] = useState<any[]>([])

  const loading = authLoading || enrollmentsLoading || coursesLoading

  useEffect(() => {
    if (authLoading || !user?.uid || courseIds.length === 0) return

    async function fetchData() {
      try {
        const sessSnap = await getDocs(
          query(
            collection(db, 'sessions'),
            where('courseId', 'in', courseIds),
            where('date', '>=', new Date().toISOString()),
            orderBy('date', 'asc'),
            limit(3),
          ),
        )
        setUpcomingSessions(
          sessSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
        )

        const resSnap = await getDocs(
          query(
            collection(db, 'resources'),
            where('courseId', 'in', courseIds),
            orderBy('createdAt', 'desc'),
            limit(4),
          ),
        )
        setRecentResources(resSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      }
    }

    fetchData()
  }, [authLoading, user?.uid, courseIds])

  const totalProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce(
            (s, c) => s + (enrollments[c.id]?.progress ?? 0),
            0,
          ) / enrolledCourses.length,
        )
      : 0
  const completedCourses = enrolledCourses.filter(
    (c) => (enrollments[c.id]?.progress ?? 0) === 100,
  ).length
  const totalLessonsDone = Object.values(enrollments).reduce(
    (s, e) => s + (e.completedLessons?.length ?? 0),
    0,
  )

  if (loading) {
    return (
      <div className='space-y-6 max-w-5xl mx-auto animate-pulse'>
        <div className='h-40 bg-surface rounded-3xl' />
        <div className='h-32 bg-surface rounded-2xl' />
        <div className='grid sm:grid-cols-3 gap-5'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='h-52 bg-surface rounded-2xl' />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-5xl mx-auto'>
      {/* Welcome banner */}
      <div className='bg-linear-to-br from-primary to-primary-accent rounded-3xl p-7 text-white relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2' />
        <div className='relative'>
          <div className='flex items-center gap-2 mb-2'>
            <SparkleIcon size={18} className='text-purple-200' />
            <span className='text-[13px] text-purple-200 font-medium'>
              Your healing journey
            </span>
          </div>
          <h1 className='font-serif text-[28px] sm:text-[32px] font-bold mb-2'>
            Welcome back, {user?.name?.split(' ')[0]} 🌸
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
              <p className='text-[26px] font-bold'>{enrolledCourses.length}</p>
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
      <div className='bg-white border border-surface-border rounded-2xl p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='font-serif text-[17px] font-bold text-primary-dark'>
            Overall Progress
          </h2>
          <span className='text-[13px] text-primary font-semibold'>
            {totalProgress}% complete
          </span>
        </div>
        <ProgressBar value={totalProgress} showPercent={false} />
        <div className='mt-4 grid grid-cols-3 gap-3'>
          {[
            {
              label: 'Courses Enrolled',
              value: enrolledCourses.length,
              icon: <BookIcon size={16} className='text-primary' />,
            },
            {
              label: 'Lessons Done',
              value: totalLessonsDone,
              icon: <CheckIcon size={16} className='text-green-500' />,
            },
            {
              label: 'Completed',
              value: completedCourses,
              icon: <ClockIcon size={16} className='text-primary-accent' />,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className='bg-surface rounded-xl p-3 text-center'
            >
              <div className='flex justify-center mb-1'>{stat.icon}</div>
              <p className='text-[18px] font-bold text-primary-dark'>
                {stat.value}
              </p>
              <p className='text-[11px] text-primary-muted'>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* My Courses */}
      {enrolledCourses.length > 0 ? (
        <div>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='font-serif text-[20px] font-bold text-primary-dark'>
              My Courses
            </h2>
            <Link
              href='/dashboard/my-courses'
              className='text-[13px] text-primary font-semibold hover:text-primary-hover no-underline flex items-center gap-1'
            >
              View all <ArrowRightIcon size={14} />
            </Link>
          </div>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {enrolledCourses.slice(0, 3).map((course) => {
              const enrollment = enrollments[course.id] ?? {
                progress: 0,
                completedLessons: [],
                enrolledAt: '',
              }
              return (
                <EnrolledCourseCard
                  key={course.id}
                  course={{ ...course, ...enrollment }}
                  enrollment={enrollment}
                />
              )
            })}
          </div>
        </div>
      ) : (
        <div className='bg-white border border-surface-border rounded-2xl p-10 text-center'>
          <p className='text-4xl mb-3'>📚</p>
          <h3 className='font-serif text-[18px] font-bold text-primary-dark mb-1'>
            No courses yet
          </h3>
          <p className='text-[14px] text-primary-muted mb-5'>
            Enrol in a programme to begin your healing journey.
          </p>
          <Link
            href='/courses'
            className='inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl no-underline hover:bg-primary-hover transition-colors text-[14px]'
          >
            Browse Courses <ArrowRightIcon size={16} />
          </Link>
        </div>
      )}

      <div className='grid lg:grid-cols-2 gap-6'>
        {/* Upcoming sessions */}
        <div className='bg-white border border-surface-border rounded-2xl p-6'>
          <h2 className='font-serif text-[17px] font-bold text-primary-dark mb-4'>
            Upcoming Sessions
          </h2>
          {upcomingSessions.length === 0 ? (
            <p className='text-[13.5px] text-primary-muted'>
              No upcoming sessions.
            </p>
          ) : (
            <div className='space-y-3'>
              {upcomingSessions.map((s) => (
                <div
                  key={s.id}
                  className='flex items-start gap-3 p-3 bg-surface rounded-xl border border-surface-border'
                >
                  <div className='w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shrink-0'>
                    <ClockIcon size={16} />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-[13px] font-semibold text-primary-dark truncate'>
                      {s.title}
                    </p>
                    <p className='text-[11.5px] text-primary-muted'>
                      {s.date} · {s.time}
                    </p>
                  </div>
                  <span className='text-[11px] bg-surface text-primary border border-primary-light px-2 py-0.5 rounded-full font-semibold shrink-0'>
                    {s.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resources */}
        <div className='bg-white border border-surface-border rounded-2xl p-6'>
          <h2 className='font-serif text-[17px] font-bold text-primary-dark mb-4'>
            My Resources
          </h2>
          <div className='space-y-2.5'>
            {recentResources.length === 0 ? (
              <p className='text-[13.5px] text-primary-muted'>
                No resources yet.
              </p>
            ) : (
              recentResources.map((r) => (
                <div
                  key={r.id}
                  className='flex items-center gap-3 p-3 hover:bg-surface rounded-xl transition-colors group cursor-pointer'
                >
                  <div className='w-8 h-8 bg-surface rounded-lg flex items-center justify-center shrink-0'>
                    <DownloadIcon size={14} className='text-primary' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-[13px] font-medium text-primary-dark truncate'>
                      {r.title}
                    </p>
                    <p className='text-[11px] text-primary-muted'>
                      {r.type} · {r.size}
                    </p>
                  </div>
                  <DownloadIcon
                    size={14}
                    className='text-primary-accent opacity-0 group-hover:opacity-100 transition-opacity shrink-0'
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Explore more */}
      <div className='bg-surface border border-surface-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div>
          <h3 className='font-serif text-[18px] font-bold text-primary-dark'>
            Ready for the next step?
          </h3>
          <p className='text-[14px] text-primary-mid mt-1'>
            Explore more programmes to continue your transformation.
          </p>
        </div>
        <Link
          href='/courses'
          className='shrink-0 px-6 py-3 bg-primary text-white font-bold rounded-xl no-underline hover:bg-primary-hover transition-colors flex items-center gap-2 text-[14px]'
        >
          Explore Courses <ArrowRightIcon size={16} />
        </Link>
      </div>
    </div>
  )
}
