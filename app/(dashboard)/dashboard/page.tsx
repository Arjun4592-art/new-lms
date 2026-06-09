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
  const { enrollments, loading: enrollmentsLoading } = useUserEnrollments(
    user?.uid,
    [],
  )
  const courseIds = useMemo(() => Object.keys(enrollments), [enrollments])
  const { courses: enrolledCourses, loading: coursesLoading } =
    useEnrolledCourses(courseIds)
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
  const [recentResources, setRecentResources] = useState<any[]>([])

  // ✅ authLoading hataya — layout already handle karta hai
  const loading = enrollmentsLoading || coursesLoading

  useEffect(() => {
    if (!user?.uid || courseIds.length === 0) return
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
  }, [user?.uid, courseIds])

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

  // ✅ authLoading bhi check karo — user load hone tak wait karo
  if (authLoading || loading) {
    return (
      <div className='space-y-6 max-w-5xl mx-auto animate-pulse'>
        <div
          className='h-40 rounded-2xl'
          style={{ backgroundColor: 'var(--color-surface)' }}
        />
        <div
          className='h-32 rounded-xl'
          style={{ backgroundColor: 'var(--color-surface)' }}
        />
        <div className='grid sm:grid-cols-3 gap-5'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='h-52 rounded-xl'
              style={{ backgroundColor: 'var(--color-surface)' }}
            />
          ))}
        </div>
      </div>
    )
  }

  // ✅ User null guard
  if (!user) return null

  return (
    <>
      <style>{`
        .db-card {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; padding: 24px;
        }
        .db-stat-card {
          background-color: var(--color-surface);
          border-radius: 10px; padding: 12px; text-align: center;
        }
        .db-session-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px;
          background-color: var(--color-surface);
          border: 1px solid var(--color-surface-border);
          border-radius: 10px;
        }
        .db-session-icon {
          width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
          background-color: var(--color-primary);
          display: flex; align-items: center; justify-content: center;
        }
        .db-resource-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px; border-radius: 10px; cursor: pointer;
          transition: background-color 0.15s;
        }
        .db-resource-item:hover { background-color: var(--color-surface); }
        .db-resource-icon {
          width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
          background-color: var(--color-surface);
          display: flex; align-items: center; justify-content: center;
        }
        .db-explore {
          background-color: var(--color-surface);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; padding: 24px;
          display: flex; flex-direction: column; gap: 16px;
          align-items: flex-start;
        }
        @media (min-width: 640px) {
          .db-explore { flex-direction: row; align-items: center; justify-content: space-between; }
        }
        .db-primary-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px;
          background-color: var(--color-primary);
          color: var(--color-bg);
          font-size: 14px; font-weight: 600;
          border-radius: 10px; text-decoration: none;
          transition: background-color 0.2s;
          flex-shrink: 0;
        }
        .db-primary-btn:hover { background-color: var(--color-primary-hover); }
      `}</style>

      <div className='space-y-6 max-w-5xl mx-auto'>
        {/* ── Welcome banner ── */}
        <div
          className='rounded-2xl p-7 relative overflow-hidden'
          style={{
            background:
              'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary-mid) 100%)',
          }}
        >
          <div
            className='absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none'
            style={{ background: 'rgba(255,255,255,0.07)' }}
          />
          <div className='relative'>
            <div className='flex items-center gap-2 mb-2'>
              <SparkleIcon
                size={18}
                style={{ color: 'var(--color-primary-muted)' }}
              />
              <span
                className='text-[13px] font-medium'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                Your healing journey
              </span>
            </div>
            <h1
              className='font-serif text-[28px] sm:text-[32px] font-medium mb-2'
              style={{ color: 'var(--color-primary-light)' }}
            >
              Welcome back, {user?.name?.split(' ')[0]} 🌿
            </h1>
            <p
              className='text-[14.5px] mb-5 font-light'
              style={{ color: 'var(--color-primary-accent)' }}
            >
              Keep going — every step forward is a step toward your power.
            </p>
            <div className='flex flex-wrap gap-6'>
              {[
                { value: `${totalProgress}%`, label: 'Overall progress' },
                { value: enrolledCourses.length, label: 'Enrolled courses' },
                { value: completedCourses, label: 'Completed' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className='text-[26px] font-semibold'
                    style={{ color: 'var(--color-primary-light)' }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className='text-[12px]'
                    style={{ color: 'var(--color-primary-muted)' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Overall progress ── */}
        <div className='db-card'>
          <div className='flex items-center justify-between mb-4'>
            <h2
              className='font-serif text-[17px] font-medium'
              style={{ color: 'var(--color-text)' }}
            >
              Overall Progress
            </h2>
            <span
              className='text-[13px] font-semibold'
              style={{ color: 'var(--color-primary)' }}
            >
              {totalProgress}% complete
            </span>
          </div>
          <ProgressBar value={totalProgress} showPercent={false} />
          <div className='mt-4 grid grid-cols-3 gap-3'>
            {[
              {
                label: 'Courses Enrolled',
                value: enrolledCourses.length,
                icon: (
                  <BookIcon
                    size={16}
                    style={{ color: 'var(--color-primary)' }}
                  />
                ),
              },
              {
                label: 'Lessons Done',
                value: totalLessonsDone,
                icon: <CheckIcon size={16} style={{ color: '#16A34A' }} />,
              },
              {
                label: 'Completed',
                value: completedCourses,
                icon: (
                  <ClockIcon
                    size={16}
                    style={{ color: 'var(--color-primary-muted)' }}
                  />
                ),
              },
            ].map((stat) => (
              <div key={stat.label} className='db-stat-card'>
                <div className='flex justify-center mb-1'>{stat.icon}</div>
                <p
                  className='text-[18px] font-semibold'
                  style={{ color: 'var(--color-text)' }}
                >
                  {stat.value}
                </p>
                <p
                  className='text-[11px]'
                  style={{ color: 'var(--color-primary-muted)' }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── My Courses ── */}
        {enrolledCourses.length > 0 ? (
          <div>
            <div className='flex items-center justify-between mb-4'>
              <h2
                className='font-serif text-[20px] font-medium'
                style={{ color: 'var(--color-text)' }}
              >
                My Courses
              </h2>
              <Link
                href='/dashboard/my-courses'
                className='text-[13px] font-semibold no-underline flex items-center gap-1'
                style={{ color: 'var(--color-primary)' }}
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
          <div className='db-card text-center py-10'>
            <p className='text-4xl mb-3'>📚</p>
            <h3
              className='font-serif text-[18px] font-medium mb-1'
              style={{ color: 'var(--color-text)' }}
            >
              No courses yet
            </h3>
            <p
              className='text-[14px] mb-5 font-light'
              style={{ color: 'var(--color-primary-muted)' }}
            >
              Enrol in a programme to begin your healing journey.
            </p>
            <Link href='/courses' className='db-primary-btn'>
              Browse Courses <ArrowRightIcon size={16} />
            </Link>
          </div>
        )}

        {/* ── Sessions + Resources ── */}
        <div className='grid lg:grid-cols-2 gap-6'>
          {/* Upcoming sessions */}
          <div className='db-card'>
            <h2
              className='font-serif text-[17px] font-medium mb-4'
              style={{ color: 'var(--color-text)' }}
            >
              Upcoming Sessions
            </h2>
            {upcomingSessions.length === 0 ? (
              <p
                className='text-[13.5px]'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                No upcoming sessions.
              </p>
            ) : (
              <div className='space-y-3'>
                {upcomingSessions.map((s) => (
                  <div key={s.id} className='db-session-item'>
                    <div className='db-session-icon'>
                      <ClockIcon
                        size={16}
                        style={{ color: 'var(--color-bg)' }}
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p
                        className='text-[13px] font-semibold truncate'
                        style={{ color: 'var(--color-text)' }}
                      >
                        {s.title}
                      </p>
                      <p
                        className='text-[11.5px]'
                        style={{ color: 'var(--color-primary-muted)' }}
                      >
                        {s.date} · {s.time}
                      </p>
                    </div>
                    <span
                      className='text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0'
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-primary)',
                        border: '1px solid var(--color-surface-border)',
                      }}
                    >
                      {s.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resources */}
          <div className='db-card'>
            <h2
              className='font-serif text-[17px] font-medium mb-4'
              style={{ color: 'var(--color-text)' }}
            >
              My Resources
            </h2>
            <div className='space-y-1'>
              {recentResources.length === 0 ? (
                <p
                  className='text-[13.5px]'
                  style={{ color: 'var(--color-primary-muted)' }}
                >
                  No resources yet.
                </p>
              ) : (
                recentResources.map((r) => (
                  <div key={r.id} className='db-resource-item group'>
                    <div className='db-resource-icon'>
                      <DownloadIcon
                        size={14}
                        style={{ color: 'var(--color-primary)' }}
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p
                        className='text-[13px] font-medium truncate'
                        style={{ color: 'var(--color-text)' }}
                      >
                        {r.title}
                      </p>
                      <p
                        className='text-[11px]'
                        style={{ color: 'var(--color-primary-muted)' }}
                      >
                        {r.type} · {r.size}
                      </p>
                    </div>
                    <DownloadIcon
                      size={14}
                      style={{
                        color: 'var(--color-primary-muted)',
                        flexShrink: 0,
                      }}
                      className='opacity-0 group-hover:opacity-100 transition-opacity'
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Explore more ── */}
        <div className='db-explore'>
          <div>
            <h3
              className='font-serif text-[18px] font-medium'
              style={{ color: 'var(--color-text)' }}
            >
              Ready for the next step?
            </h3>
            <p
              className='text-[14px] mt-1 font-light'
              style={{ color: 'var(--color-primary-mid)' }}
            >
              Explore more programmes to continue your transformation.
            </p>
          </div>
          <Link href='/courses' className='db-primary-btn'>
            Explore Courses <ArrowRightIcon size={16} />
          </Link>
        </div>
      </div>
    </>
  )
}
