'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { Course } from '@/types'
import SectionHeading from '@/components/ui/SectionHeading'
import {
  ClockIcon,
  ArrowRightIcon,
  PlayIcon,
  UsersIcon,
} from '@/components/ui/Icons'
import Button from '@/components/ui/Button'

export default function CoursesPreview() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      try {
        // Same query as CoursesPage — no orderBy so no index needed
        const snap = await getDocs(
          query(
            collection(db, 'courses'),
            where('published', '==', true),
            limit(4),
          ),
        )
        setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Course))
      } catch (err) {
        console.error('CoursesPreview error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  return (
    <section className='py-20 px-4 bg-white'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12'>
          <SectionHeading
            eyebrow='Programs & Courses'
            title='Choose Your Path to Healing'
            subtitle="Every woman's journey is unique. Find the program that speaks to your heart."
          />
          <Button
            href='/courses'
            variant='outline'
            size='sm'
            className='shrink-0'
          >
            View All Programs <ArrowRightIcon size={16} />
          </Button>
        </div>

        {/* Skeleton */}
        {loading && (
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className='rounded-2xl overflow-hidden border border-purple-100 animate-pulse'
              >
                <div className='h-36 bg-purple-100' />
                <div className='p-5 space-y-3'>
                  <div className='h-4 bg-purple-100 rounded w-3/4' />
                  <div className='h-3 bg-purple-50 rounded' />
                  <div className='h-3 bg-purple-50 rounded w-5/6' />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && courses.length === 0 && (
          <div className='text-center py-16'>
            <p className='text-[15px] text-[#8470A8]'>
              No programmes available yet. Check back soon.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && courses.length > 0 && (
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className='group block bg-white border border-purple-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-purple-100/60 hover:-translate-y-1 transition-all duration-300 no-underline'
              >
                <div
                  className={`h-36 bg-gradient-to-br ${course.color} flex items-center justify-center relative`}
                >
                  <span className='text-[48px]'>{course.emoji}</span>
                  {course.isFree && (
                    <div className='absolute top-3 right-3 bg-green-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full'>
                      Free
                    </div>
                  )}
                  {!course.isFree && course.category && (
                    <div className='absolute top-3 left-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[11px] font-bold px-2.5 py-1 rounded-full'>
                      {course.category}
                    </div>
                  )}
                </div>

                <div className='p-5'>
                  <h3 className='font-serif text-[16px] font-bold text-[#2D1B5E] mb-2 group-hover:text-[#7C5CBF] transition-colors leading-snug'>
                    {course.title}
                  </h3>
                  <p className='text-[13px] text-[#8470A8] leading-relaxed mb-4 line-clamp-3'>
                    {course.description}
                  </p>

                  <div className='space-y-1.5'>
                    <div className='flex items-center gap-2 text-[12px] text-[#8470A8]'>
                      <ClockIcon size={13} className='text-[#A67DD4]' />
                      {course.totalDuration} min
                    </div>
                    <div className='flex items-center gap-2 text-[12px] text-[#8470A8]'>
                      <PlayIcon size={13} className='text-[#A67DD4]' />
                      {course.format}
                    </div>
                    <div className='flex items-center gap-2 text-[12px] text-[#8470A8]'>
                      <UsersIcon size={13} className='text-[#A67DD4]' />
                      {course.totalLessons} lessons
                    </div>
                  </div>

                  <div className='mt-4 pt-4 border-t border-purple-50 flex items-center justify-between'>
                    <p className='text-[16px] font-bold text-[#2D1B5E]'>
                      {course.isFree
                        ? 'Free'
                        : `₹${course.price?.toLocaleString('en-IN')}`}
                    </p>
                    <div className='flex items-center gap-1 text-[#7C5CBF] font-semibold text-[13px]'>
                      Enroll{' '}
                      <ArrowRightIcon
                        size={15}
                        className='group-hover:translate-x-1 transition-transform'
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
