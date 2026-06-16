'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { LMSUser, Course, Enrollment } from '@/types'
import {
  ArrowRightIcon,
  BookIcon,
  CheckIcon,
  ClockIcon,
} from '@/components/ui/Icons'
import Link from 'next/link'
import ProgressBar from '@/components/dashboard/ProgressBar'

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [student, setStudent] = useState<LMSUser | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const { id } = await params
        const snap = await getDoc(doc(db, 'users', id))
        if (!snap.exists()) return
        const student = { uid: snap.id, ...snap.data() } as LMSUser
        setStudent(student)

        if (student.enrolledCourses?.length) {
          const [courseSnaps, enrollmentSnaps] = await Promise.all([
            Promise.all(
              student.enrolledCourses.map((cid) =>
                getDoc(doc(db, 'courses', cid)),
              ),
            ),
            Promise.all(
              student.enrolledCourses.map((cid) =>
                getDoc(doc(db, 'enrollments', `${id}_${cid}`)),
              ),
            ),
          ])
          setCourses(
            courseSnaps
              .filter((s) => s.exists())
              .map((s) => ({ id: s.id, ...s.data() }) as Course),
          )
          setEnrollments(
            enrollmentSnaps
              .filter((s) => s.exists())
              .map((s) => s.data() as Enrollment),
          )
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [params])

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse max-w-4xl mx-auto px-4 sm:px-6'>
        <div className='h-40 bg-surface rounded-2xl' />
        <div className='h-64 bg-surface rounded-2xl' />
      </div>
    )
  }

  if (!student) {
    return (
      <p className='text-center text-primary-muted py-12'>Student not found.</p>
    )
  }

  const completedCount = enrollments.filter((e) => e.progress === 100).length
  const overallProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length,
        )
      : 0

  return (
    <div className='space-y-6 max-w-4xl mx-auto px-4 sm:px-6'>
      {/* Back */}
      <Link
        href='/admin/students'
        className='inline-flex items-center gap-2 text-[13px] text-primary font-semibold no-underline hover:text-primary-hover transition-colors duration-150 animate-[fadeInDown_0.3s_ease_both]'
      >
        ← Back to Students
      </Link>

      {/* Profile card */}
      <div className='bg-primary-dark rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center sm:items-start gap-5 animate-[fadeInDown_0.4s_ease_both]'>
        <div className='w-20 h-20 rounded-full bg-[rgba(255,255,255,0.15)] border-4 border-[rgba(255,255,255,0.2)] flex items-center justify-center text-[30px] font-bold text-[#f5f0e8] shrink-0'>
          {student.name?.charAt(0).toUpperCase()}
        </div>
        <div className='text-center sm:text-left'>
          <h1 className='font-serif text-[22px] sm:text-[24px] font-bold text-[#f5f0e8]'>
            {student.name}
          </h1>
          <p className='text-primary-accent text-[14px] mt-0.5'>
            {student.email}
          </p>
          <p className='text-primary-accent text-[13px] mt-1'>
            Joined{' '}
            {new Date(student.createdAt).toLocaleDateString('en-IN', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-3 gap-3 sm:gap-4 animate-[fadeInUp_0.4s_ease_both]'>
        {[
          {
            label: 'Enrolled',
            value: courses.length,
            icon: <BookIcon size={16} className='text-primary' />,
          },
          {
            label: 'Completed',
            value: completedCount,
            icon: <CheckIcon size={16} className='text-green-600' />,
          },
          {
            label: 'Avg Progress',
            value: `${overallProgress}%`,
            icon: <ClockIcon size={16} className='text-primary-mid' />,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className='bg-[#f5f0e8] border border-surface-border rounded-2xl p-4 sm:p-5 text-center'
          >
            <div className='flex justify-center mb-2'>{stat.icon}</div>
            <p className='text-[20px] sm:text-[22px] font-bold text-primary-dark'>
              {stat.value}
            </p>
            <p className='text-[12px] text-primary-muted'>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Enrolled courses */}
      <div className='bg-[#f5f0e8] border border-surface-border rounded-2xl overflow-hidden animate-[fadeInUp_0.5s_ease_both]'>
        <div className='px-6 py-4 border-b border-surface-border bg-surface'>
          <h2 className='font-serif text-[17px] font-bold text-primary-dark'>
            Enrolled Courses
          </h2>
        </div>
        {courses.length === 0 ? (
          <p className='px-6 py-8 text-[13px] text-primary-muted'>
            Not enrolled in any courses yet.
          </p>
        ) : (
          <div className='divide-y divide-surface-border'>
            {courses.map((course, i) => {
              const enr = enrollments.find((e) => e.courseId === course.id)
              return (
                <div
                  key={course.id}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className='animate-[fadeInUp_0.35s_ease_both] px-4 sm:px-6 py-4 flex items-center gap-4 hover:bg-surface transition-colors duration-150'
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center text-[20px] shrink-0`}
                  >
                    {course.emoji}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-[13.5px] font-semibold text-primary-dark truncate'>
                      {course.title}
                    </p>
                    <p className='text-[12px] text-primary-muted'>
                      {enr?.completedLessons?.length ?? 0}/{course.totalLessons}{' '}
                      lessons
                    </p>
                  </div>
                  <div className='w-24 sm:w-32 shrink-0'>
                    <ProgressBar value={enr?.progress ?? 0} size='sm' />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
