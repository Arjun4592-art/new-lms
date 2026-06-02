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
      <div className='space-y-4 animate-pulse max-w-4xl mx-auto'>
        <div className='h-40 bg-purple-100 rounded-2xl' />
        <div className='h-64 bg-purple-100 rounded-2xl' />
      </div>
    )
  }

  if (!student) {
    return (
      <p className='text-center text-[#8470A8] py-12'>Student not found.</p>
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
    <div className='space-y-6 max-w-4xl mx-auto'>
      {/* Back */}
      <Link
        href='/admin/students'
        className='flex items-center gap-2 text-[13px] text-[#7C5CBF] font-semibold no-underline hover:text-[#6A4DAD]'
      >
        ← Back to Students
      </Link>

      {/* Profile card */}
      <div className='bg-gradient-to-br from-[#7C5CBF] to-[#A67DD4] rounded-2xl p-7 text-white flex items-center gap-6'>
        <div className='w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-[30px] font-bold shrink-0'>
          {student.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className='font-serif text-[24px] font-bold'>{student.name}</h1>
          <p className='text-purple-200 text-[14px]'>{student.email}</p>
          <p className='text-purple-200 text-[13px] mt-1'>
            Joined{' '}
            {new Date(student.createdAt).toLocaleDateString('en-IN', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-3 gap-4'>
        {[
          {
            label: 'Enrolled',
            value: courses.length,
            icon: <BookIcon size={16} className='text-[#7C5CBF]' />,
          },
          {
            label: 'Completed',
            value: completedCount,
            icon: <CheckIcon size={16} className='text-green-500' />,
          },
          {
            label: 'Avg Progress',
            value: `${overallProgress}%`,
            icon: <ClockIcon size={16} className='text-[#A67DD4]' />,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className='bg-white border border-purple-100 rounded-2xl p-5 text-center'
          >
            <div className='flex justify-center mb-2'>{stat.icon}</div>
            <p className='text-[22px] font-bold text-[#2D1B5E]'>{stat.value}</p>
            <p className='text-[12px] text-[#8470A8]'>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Enrolled courses */}
      <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden'>
        <div className='px-6 py-4 border-b border-purple-100 bg-[#F9F5FF]'>
          <h2 className='font-serif text-[17px] font-bold text-[#2D1B5E]'>
            Enrolled Courses
          </h2>
        </div>
        {courses.length === 0 ? (
          <p className='px-6 py-8 text-[13px] text-[#8470A8]'>
            Not enrolled in any courses yet.
          </p>
        ) : (
          <div className='divide-y divide-purple-50'>
            {courses.map((course) => {
              const enr = enrollments.find((e) => e.courseId === course.id)
              return (
                <div
                  key={course.id}
                  className='px-6 py-4 flex items-center gap-4'
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center text-[20px] shrink-0`}
                  >
                    {course.emoji}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-[13.5px] font-semibold text-[#2D1B5E] truncate'>
                      {course.title}
                    </p>
                    <p className='text-[12px] text-[#8470A8]'>
                      {enr?.completedLessons?.length ?? 0}/{course.totalLessons}{' '}
                      lessons
                    </p>
                  </div>
                  <div className='w-32 shrink-0'>
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
