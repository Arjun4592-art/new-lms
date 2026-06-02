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
    async function fetch() {
      const snap = await getDoc(doc(db, 'courses', id))
      if (snap.exists()) {
        setCourse({ id: snap.id, ...snap.data() } as Course)
      }
      setLoading(false)
    }
    fetch()
  }, [id])

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse max-w-3xl mx-auto'>
        <div className='h-10 w-48 bg-purple-100 rounded' />
        <div className='h-96 bg-purple-100 rounded-2xl' />
      </div>
    )
  }

  if (!course) {
    return <p className='text-[#8470A8] text-center py-12'>Course not found.</p>
  }

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-[12px] text-[#A67DD4] font-semibold uppercase tracking-widest mb-1'>
          Admin · Courses
        </p>
        <h1 className='font-serif text-[26px] font-bold text-[#2D1B5E]'>
          Edit Course
        </h1>
      </div>
      <CourseForm initial={course} courseId={course.id} />
    </div>
  )
}
