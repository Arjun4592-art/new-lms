'use client'

import { use, useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import CourseForm from '@/components/admin/CourseForm'
import type { Course } from '@/types'

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourse() {
      const snap = await getDoc(doc(db, 'courses', id))
      if (snap.exists()) setCourse({ id: snap.id, ...snap.data() } as Course)
      setLoading(false)
    }
    fetchCourse()
  }, [id])

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse max-w-3xl mx-auto'>
        <div
          className='h-10 w-48 rounded'
          style={{ backgroundColor: 'var(--color-surface)' }}
        />
        <div
          className='h-96 rounded-xl'
          style={{ backgroundColor: 'var(--color-surface)' }}
        />
      </div>
    )
  }

  if (!course) {
    return (
      <p
        className='text-center py-12'
        style={{ color: 'var(--color-primary-muted)' }}
      >
        Course not found.
      </p>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <p
          className='text-[11px] font-semibold uppercase tracking-widest mb-1'
          style={{ color: 'var(--color-primary-muted)' }}
        >
          Admin · Courses
        </p>
        <h1
          className='font-serif text-[26px] font-medium'
          style={{ color: 'var(--color-text)' }}
        >
          Edit Course
        </h1>
      </div>
      <CourseForm initial={course} courseId={course.id} />
    </div>
  )
}
