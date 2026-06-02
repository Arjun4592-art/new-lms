'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from 'firebase/firestore'
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

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    recentStudents: [] as LMSUser[],
    recentEnrollments: [] as (Enrollment & {
      courseName?: string
      studentName?: string
    })[],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [studentsSnap, coursesSnap, enrollmentsSnap] = await Promise.all([
          getDocs(
            query(collection(db, 'users'), where('role', '==', 'student')),
          ),
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
          (d) => d.data() as Enrollment,
        )

        const totalRevenue = enrollments.reduce((s, e) => s + (e.price ?? 0), 0)

        // Enrich recent enrollments
        const recentEnrollments = enrollments
          .sort((a, b) => {
            const toMs = (val: any) =>
              val?.toDate ? val.toDate().getTime() : new Date(val).getTime()
            return toMs(b.enrolledAt) - toMs(a.enrolledAt)
          })
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
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className='space-y-6 animate-pulse'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='h-32 bg-purple-100 rounded-2xl' />
          ))}
        </div>
        <div className='h-64 bg-purple-100 rounded-2xl' />
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-6xl mx-auto'>
      {/* Stats */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard
          title='Total Students'
          value={stats.totalStudents}
          subtitle='Registered users'
          icon={<UsersIcon size={18} />}
          color='purple'
        />
        <StatCard
          title='Total Courses'
          value={stats.totalCourses}
          subtitle='Published courses'
          icon={<BookIcon size={18} />}
          color='blue'
        />
        <StatCard
          title='Enrollments'
          value={stats.totalEnrollments}
          subtitle='Total enrollments'
          icon={<CheckIcon size={18} />}
          color='green'
        />
        <StatCard
          title='Revenue'
          value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
          subtitle='Total earned'
          icon={<CreditCardIcon size={18} />}
          color='orange'
        />
      </div>

      <div className='grid lg:grid-cols-2 gap-6'>
        {/* Recent enrollments */}
        <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden'>
          <div className='px-6 py-4 border-b border-purple-100 flex items-center justify-between'>
            <h2 className='font-serif text-[16px] font-bold text-[#2D1B5E]'>
              Recent Enrollments
            </h2>
            <Link
              href='/admin/enrollments'
              className='text-[12px] text-[#7C5CBF] font-semibold no-underline flex items-center gap-1'
            >
              View all <ArrowRightIcon size={12} />
            </Link>
          </div>
          <div className='divide-y divide-purple-50'>
            {stats.recentEnrollments.length === 0 ? (
              <p className='px-6 py-4 text-[13px] text-[#8470A8]'>
                No enrollments yet
              </p>
            ) : (
              stats.recentEnrollments.map((e, i) => (
                <div
                  key={i}
                  className='px-6 py-3 flex items-center justify-between'
                >
                  <div>
                    <p className='text-[13px] font-semibold text-[#2D1B5E]'>
                      {e.studentName ?? 'Unknown'}
                    </p>
                    <p className='text-[12px] text-[#8470A8]'>
                      {e.courseName ?? e.courseId}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-[13px] font-bold text-[#2D1B5E]'>
                      {e.price === 0
                        ? 'Free'
                        : `₹${e.price.toLocaleString('en-IN')}`}
                    </p>
                    <p className='text-[11px] text-[#8470A8]'>
                      {new Date(e.enrolledAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent students */}
        <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden'>
          <div className='px-6 py-4 border-b border-purple-100 flex items-center justify-between'>
            <h2 className='font-serif text-[16px] font-bold text-[#2D1B5E]'>
              Recent Students
            </h2>
            <Link
              href='/admin/students'
              className='text-[12px] text-[#7C5CBF] font-semibold no-underline flex items-center gap-1'
            >
              View all <ArrowRightIcon size={12} />
            </Link>
          </div>
          <div className='divide-y divide-purple-50'>
            {stats.recentStudents.length === 0 ? (
              <p className='px-6 py-4 text-[13px] text-[#8470A8]'>
                No students yet
              </p>
            ) : (
              stats.recentStudents.map((s) => (
                <div key={s.uid} className='px-6 py-3 flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-gradient-to-br from-[#7C5CBF] to-[#C084F5] flex items-center justify-center text-white text-[11px] font-bold shrink-0'>
                    {s.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-[13px] font-semibold text-[#2D1B5E] truncate'>
                      {s.name}
                    </p>
                    <p className='text-[11px] text-[#8470A8] truncate'>
                      {s.email}
                    </p>
                  </div>
                  <span className='text-[11px] text-[#8470A8]'>
                    {s.enrolledCourses?.length ?? 0} courses
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
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
            className='flex items-center gap-3 p-4 bg-white border border-purple-100 rounded-2xl hover:bg-[#F9F5FF] hover:border-purple-200 transition-all no-underline group'
          >
            <div className='w-9 h-9 bg-[#F3EEFF] rounded-xl flex items-center justify-center text-[#7C5CBF] group-hover:bg-[#7C5CBF] group-hover:text-white transition-all'>
              {action.icon}
            </div>
            <span className='text-[14px] font-semibold text-[#2D1B5E]'>
              {action.label}
            </span>
            <ArrowRightIcon size={14} className='ml-auto text-[#A67DD4]' />
          </Link>
        ))}
      </div>
    </div>
  )
}
