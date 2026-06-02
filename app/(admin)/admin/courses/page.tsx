'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { Course } from '@/types'
import { ArrowRightIcon, BookIcon, CheckIcon } from '@/components/ui/Icons'

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function fetchCourses() {
    try {
      const snap = await getDocs(
        query(collection(db, 'courses'), orderBy('createdAt', 'desc')),
      )
      console.log(snap)
      setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Course))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this course?')) return
    setDeleting(id)
    try {
      await deleteDoc(doc(db, 'courses', id))
      setCourses((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='h-20 bg-purple-100 rounded-2xl' />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-6xl mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-serif text-[26px] font-bold text-[#2D1B5E]'>
            Courses
          </h1>
          <p className='text-[13px] text-[#8470A8]'>
            {courses.length} total courses
          </p>
        </div>
        <Link
          href='/admin/courses/new'
          className='flex items-center gap-2 px-5 py-2.5 bg-[#7C5CBF] text-white font-bold rounded-xl no-underline hover:bg-[#6A4DAD] transition-colors text-[13.5px]'
        >
          + Add Course
        </Link>
      </div>

      {/* Courses table */}
      <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden'>
        <div className='px-6 py-3 border-b border-purple-100 bg-[#F9F5FF] grid grid-cols-12 gap-4'>
          <p className='col-span-5 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Course
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Price
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Status
          </p>
          <p className='col-span-1 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Lessons
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Actions
          </p>
        </div>

        {courses.length === 0 ? (
          <div className='px-6 py-12 text-center'>
            <BookIcon size={32} className='text-[#C084F5] mx-auto mb-3' />
            <p className='text-[15px] font-semibold text-[#2D1B5E] mb-1'>
              No courses yet
            </p>
            <p className='text-[13px] text-[#8470A8] mb-4'>
              Add your first course to get started
            </p>
            <Link
              href='/admin/courses/new'
              className='inline-flex items-center gap-2 px-5 py-2.5 bg-[#7C5CBF] text-white font-bold rounded-xl no-underline hover:bg-[#6A4DAD] transition-colors text-[13.5px]'
            >
              Add Course <ArrowRightIcon size={14} />
            </Link>
          </div>
        ) : (
          <div className='divide-y divide-purple-50'>
            {courses.map((course) => (
              <div
                key={course.id}
                className='px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-[#FAFAFE]'
              >
                {/* Course info */}
                <div className='col-span-5 flex items-center gap-3 min-w-0'>
                  <div
                    className={`w-10 h-10 rounded-xl bg-linear-to-br ${course.color} flex items-center justify-center shrink-0 text-[20px]`}
                  >
                    {course.emoji}
                  </div>
                  <div className='min-w-0'>
                    <p className='text-[13.5px] font-semibold text-[#2D1B5E] truncate'>
                      {course.title}
                    </p>
                    <p className='text-[11.5px] text-[#8470A8] truncate'>
                      {course.format} · {course.category}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className='col-span-2'>
                  <p className='text-[13.5px] font-semibold text-[#2D1B5E]'>
                    {course.isFree
                      ? 'Free'
                      : `₹${course.price.toLocaleString('en-IN')}`}
                  </p>
                </div>

                {/* Status */}
                <div className='col-span-2'>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      course.published
                        ? 'bg-green-50 text-green-600'
                        : 'bg-orange-50 text-orange-600'
                    }`}
                  >
                    {course.published ? (
                      <>
                        <CheckIcon size={10} /> Published
                      </>
                    ) : (
                      'Draft'
                    )}
                  </span>
                </div>

                {/* Lessons */}
                <div className='col-span-1'>
                  <p className='text-[13.5px] text-[#2D1B5E]'>
                    {course.totalLessons}
                  </p>
                </div>

                {/* Actions */}
                <div className='col-span-2 flex items-center gap-2'>
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className='px-3 py-1.5 text-[12px] font-semibold text-[#7C5CBF] bg-[#F3EEFF] hover:bg-[#E8DEFF] rounded-lg no-underline transition-colors'
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(course.id)}
                    disabled={deleting === course.id}
                    className='px-3 py-1.5 text-[12px] font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50'
                  >
                    {deleting === course.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
