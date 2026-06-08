'use client'

import { useEffect, useState, useCallback } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import StatCard from '@/components/admin/StatCard'
import {
  BookIcon,
  UsersIcon,
  CreditCardIcon,
  CheckIcon,
  ArrowRightIcon,
} from '@/components/ui/Icons'
import Link from 'next/link'
import type { LMSUser, Course, Enrollment } from '@/types'

interface EnrichedEnrollment extends Enrollment {
  courseName?: string
  studentName?: string
}

interface Stats {
  totalStudents: number
  totalCourses: number
  totalEnrollments: number
  totalRevenue: number
  recentStudents: LMSUser[]
  recentEnrollments: EnrichedEnrollment[]
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    recentStudents: [],
    recentEnrollments: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [studentsSnap, coursesSnap, enrollmentsSnap] = await Promise.all([
        getDocs(query(collection(db, 'users'), where('role', '==', 'student'))),
        getDocs(collection(db, 'courses')),
        getDocs(collection(db, 'enrollments')),
      ])

      const students = studentsSnap.docs.map(
        (d) => ({ uid: d.id, ...d.data() }) as LMSUser,
      )
      const courses = coursesSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Course,
      )
      const enrollments = enrollmentsSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Enrollment,
      )

      const totalRevenue = enrollments.reduce((s, e) => s + (e.price ?? 0), 0)

      const toMs = (val: any) =>
        val?.toDate ? val.toDate().getTime() : new Date(val ?? 0).getTime()

      const recentEnrollments: EnrichedEnrollment[] = enrollments
        .sort((a, b) => toMs(b.enrolledAt) - toMs(a.enrolledAt))
        .slice(0, 5)
        .map((e) => ({
          ...e,
          courseName: courses.find((c) => c.id === e.courseId)?.title,
          studentName: students.find((s) => s.uid === e.userId)?.name,
        }))

      setStats({
        totalStudents: students.length,
        totalCourses: courses.length,
        totalEnrollments: enrollments.length,
        totalRevenue,
        recentStudents: students.slice(0, 5),
        recentEnrollments,
      })
    } catch (err: any) {
      console.error('AdminOverview fetch error:', err)
      setError(err?.message ?? 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // ── Loading ──
  if (loading) {
    return (
      <div className='space-y-6 animate-pulse max-w-6xl mx-auto'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='h-32 rounded-xl'
              style={{ backgroundColor: 'var(--color-surface)' }}
            />
          ))}
        </div>
        <div className='grid lg:grid-cols-2 gap-6'>
          <div
            className='h-64 rounded-xl'
            style={{ backgroundColor: 'var(--color-surface)' }}
          />
          <div
            className='h-64 rounded-xl'
            style={{ backgroundColor: 'var(--color-surface)' }}
          />
        </div>
      </div>
    )
  }

  // ── Error ──
  if (error) {
    return (
      <div
        className='max-w-6xl mx-auto rounded-xl p-10 text-center'
        style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}
      >
        <p className='text-[32px] mb-3'>⚠️</p>
        <p
          className='text-[16px] font-semibold mb-2'
          style={{ color: '#B91C1C' }}
        >
          Failed to load dashboard
        </p>
        <p className='text-[13px] mb-5' style={{ color: '#DC2626' }}>
          {error}
        </p>
        <button
          onClick={fetchStats}
          className='px-6 py-2.5 rounded-xl font-semibold text-[14px]'
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-bg)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .ao-card {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; overflow: hidden;
        }
        .ao-card-header {
          padding: 14px 20px;
          border-bottom: 1px solid var(--color-surface-border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .ao-row {
          padding: 12px 20px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          border-bottom: 1px solid var(--color-surface-border);
        }
        .ao-row:last-child { border-bottom: none; }
        .ao-row:hover { background-color: var(--color-surface); }
        .ao-student-row {
          padding: 12px 20px;
          display: flex; align-items: center; gap: 12px;
          border-bottom: 1px solid var(--color-surface-border);
        }
        .ao-student-row:last-child { border-bottom: none; }
        .ao-avatar {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          background-color: var(--color-primary);
          color: var(--color-bg);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700;
        }
        .ao-action-card {
          display: flex; align-items: center; gap: 12px;
          padding: 16px;
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; text-decoration: none;
          transition: background-color 0.2s, border-color 0.2s, transform 0.2s;
        }
        .ao-action-card:hover {
          background-color: var(--color-surface);
          border-color: var(--color-primary-muted);
          transform: translateY(-2px);
        }
        .ao-action-card:hover .ao-action-icon {
          background-color: var(--color-primary);
          color: var(--color-bg);
        }
        .ao-action-icon {
          width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
          background-color: var(--color-surface);
          color: var(--color-primary);
          display: flex; align-items: center; justify-content: center;
          transition: background-color 0.2s, color 0.2s;
        }
        .ao-view-link {
          font-size: 12px; font-weight: 600; text-decoration: none;
          display: flex; align-items: center; gap: 4px;
          color: var(--color-primary);
          transition: color 0.15s;
        }
        .ao-view-link:hover { color: var(--color-primary-hover); }
      `}</style>

      <div className='space-y-6 max-w-6xl mx-auto'>
        {/* ── Stat cards ── */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatCard
            title='Total Students'
            value={stats.totalStudents}
            subtitle='Registered users'
            icon={<UsersIcon size={18} />}
            color='primary'
          />
          <StatCard
            title='Total Courses'
            value={stats.totalCourses}
            subtitle='Published courses'
            icon={<BookIcon size={18} />}
            color='primary'
          />
          <StatCard
            title='Enrollments'
            value={stats.totalEnrollments}
            subtitle='Total enrollments'
            icon={<CheckIcon size={18} />}
            color='primary'
          />
          <StatCard
            title='Revenue'
            value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
            subtitle='Total earned'
            icon={<CreditCardIcon size={18} />}
            color='primary'
          />
        </div>

        {/* ── Tables ── */}
        <div className='grid lg:grid-cols-2 gap-6'>
          {/* Recent enrollments */}
          <div className='ao-card'>
            <div className='ao-card-header'>
              <h2
                className='font-serif text-[16px] font-medium'
                style={{ color: 'var(--color-text)' }}
              >
                Recent Enrollments
              </h2>
              <Link href='/admin/enrollments' className='ao-view-link'>
                View all <ArrowRightIcon size={12} />
              </Link>
            </div>
            {stats.recentEnrollments.length === 0 ? (
              <p
                className='px-5 py-5 text-[13px]'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                No enrollments yet
              </p>
            ) : (
              stats.recentEnrollments.map((e, i) => (
                <div key={i} className='ao-row'>
                  <div className='min-w-0'>
                    <p
                      className='text-[13px] font-semibold truncate'
                      style={{ color: 'var(--color-text)' }}
                    >
                      {e.studentName ?? 'Unknown'}
                    </p>
                    <p
                      className='text-[12px] truncate'
                      style={{ color: 'var(--color-primary-muted)' }}
                    >
                      {e.courseName ?? e.courseId}
                    </p>
                  </div>
                  <div className='text-right shrink-0'>
                    <p
                      className='text-[13px] font-semibold'
                      style={{ color: 'var(--color-text)' }}
                    >
                      {e.price === 0
                        ? 'Free'
                        : `₹${e.price.toLocaleString('en-IN')}`}
                    </p>
                    <p
                      className='text-[11px]'
                      style={{ color: 'var(--color-primary-muted)' }}
                    >
                      {new Date(e.enrolledAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recent students */}
          <div className='ao-card'>
            <div className='ao-card-header'>
              <h2
                className='font-serif text-[16px] font-medium'
                style={{ color: 'var(--color-text)' }}
              >
                Recent Students
              </h2>
              <Link href='/admin/students' className='ao-view-link'>
                View all <ArrowRightIcon size={12} />
              </Link>
            </div>
            {stats.recentStudents.length === 0 ? (
              <p
                className='px-5 py-5 text-[13px]'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                No students yet
              </p>
            ) : (
              stats.recentStudents.map((s) => (
                <div key={s.uid} className='ao-student-row'>
                  <div className='ao-avatar'>
                    {s.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p
                      className='text-[13px] font-semibold truncate'
                      style={{ color: 'var(--color-text)' }}
                    >
                      {s.name}
                    </p>
                    <p
                      className='text-[11px] truncate'
                      style={{ color: 'var(--color-primary-muted)' }}
                    >
                      {s.email}
                    </p>
                  </div>
                  <span
                    className='text-[11px] shrink-0'
                    style={{ color: 'var(--color-primary-muted)' }}
                  >
                    {s.enrolledCourses?.length ?? 0} courses
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className='grid sm:grid-cols-3 gap-4'>
          {[
            {
              label: 'Add New Course',
              href: '/admin/courses/new',
              icon: <BookIcon size={16} />,
            },
            {
              label: 'Add Session',
              href: '/admin/sessions/new',
              icon: <UsersIcon size={16} />,
            },
            {
              label: 'Add Resource',
              href: '/admin/resources/new',
              icon: <CheckIcon size={16} />,
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className='ao-action-card'
            >
              <div className='ao-action-icon'>{action.icon}</div>
              <span
                className='text-[14px] font-semibold flex-1'
                style={{ color: 'var(--color-text)' }}
              >
                {action.label}
              </span>
              <ArrowRightIcon
                size={14}
                style={{ color: 'var(--color-primary-muted)', flexShrink: 0 }}
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
