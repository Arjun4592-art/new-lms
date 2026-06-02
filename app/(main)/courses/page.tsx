'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { Course } from '@/types'
import Link from 'next/link'
import {
  ClockIcon,
  PlayIcon,
  UsersIcon,
  ArrowRightIcon,
} from '@/components/ui/Icons'
import Button from '@/components/ui/Button'

function CourseCardFirestore({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className='group block bg-white border border-purple-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-purple-100/60 hover:-translate-y-1 transition-all duration-300 no-underline'
    >
      {/* Header */}
      <div
        className={`h-36 bg-gradient-to-br ${course.color} flex items-center justify-center relative`}
      >
        <span className='text-[52px]'>{course.emoji}</span>
        {!course.isFree && (
          <div className='absolute top-3 left-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[11px] font-bold px-2.5 py-1 rounded-full'>
            {course.category}
          </div>
        )}
        {course.isFree && (
          <div className='absolute top-3 right-3 bg-green-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full'>
            Free
          </div>
        )}
      </div>

      {/* Body */}
      <div className='p-6'>
        <h3 className='font-serif text-[17px] font-bold text-[#2D1B5E] mb-2 group-hover:text-[#7C5CBF] transition-colors leading-snug'>
          {course.title}
        </h3>
        <p className='text-[13.5px] text-[#8470A8] leading-relaxed mb-4 line-clamp-3'>
          {course.description}
        </p>

        <div className='flex flex-wrap gap-x-4 gap-y-1.5 mb-4'>
          <div className='flex items-center gap-1.5 text-[12.5px] text-[#8470A8]'>
            <ClockIcon size={13} className='text-[#A67DD4]' />
            {course.totalDuration} min
          </div>
          <div className='flex items-center gap-1.5 text-[12.5px] text-[#8470A8]'>
            <PlayIcon size={13} className='text-[#A67DD4]' />
            {course.format}
          </div>
          <div className='flex items-center gap-1.5 text-[12.5px] text-[#8470A8]'>
            <UsersIcon size={13} className='text-[#A67DD4]' />
            {course.totalLessons} lessons
          </div>
        </div>

        {/* Includes tags */}
        {course.includes && course.includes.length > 0 && (
          <div className='flex flex-wrap gap-1.5 mb-5'>
            {course.includes.slice(0, 3).map((item) => (
              <span
                key={item}
                className='text-[11px] bg-[#F9F5FF] text-[#7C5CBF] border border-purple-100 px-2 py-0.5 rounded-full'
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className='pt-4 border-t border-purple-50 flex items-center justify-between'>
          <div>
            <p className='text-[18px] font-bold text-[#2D1B5E]'>
              {course.isFree
                ? 'Free'
                : `₹${course.price.toLocaleString('en-IN')}`}
            </p>
          </div>
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
  )
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const snap = await getDocs(
          query(collection(db, 'courses'), where('published', '==', true)),
        )
        setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Course))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  return (
    <>
      {/* Hero */}
      <section className='pt-28 pb-16 px-4 bg-gradient-to-br from-[#F9F5FF] via-[#F3EEFF] to-[#FDF4FF] relative overflow-hidden'>
        <div className='absolute top-10 right-10 w-64 h-64 bg-[#D4BEFF]/20 rounded-full blur-3xl' />
        <div className='max-w-4xl mx-auto text-center relative'>
          <span className='inline-block text-[12px] font-bold uppercase tracking-[0.15em] text-[#A67DD4] bg-[#F3EEFF] border border-purple-200 px-4 py-1.5 rounded-full mb-6'>
            Programs & Courses
          </span>
          <h1 className='font-serif text-[44px] sm:text-[54px] font-bold text-[#2D1B5E] leading-tight mb-6'>
            Choose Your Path to{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CBF] to-[#C084F5]'>
              Healing
            </span>
          </h1>
          <p className='text-[17px] text-[#6B5B8B] leading-relaxed max-w-2xl mx-auto'>
            Every woman's journey is unique. Whether you're just beginning or
            ready to go deep — there's a programme designed for exactly where
            you are right now.
          </p>
        </div>
      </section>

      {/* Courses grid */}
      <section className='py-16 px-4 bg-white'>
        <div className='max-w-6xl mx-auto'>
          {loading ? (
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className='h-80 bg-purple-50 rounded-2xl animate-pulse'
                />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className='text-center py-20'>
              <p className='text-[48px] mb-4'>🌸</p>
              <h3 className='font-serif text-[20px] font-bold text-[#2D1B5E] mb-2'>
                No courses available yet
              </h3>
              <p className='text-[14px] text-[#8470A8]'>
                Check back soon — new programmes are being added.
              </p>
            </div>
          ) : (
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {courses.map((course) => (
                <CourseCardFirestore key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* What you'll learn */}
      <section className='py-16 px-4 bg-[#F9F5FF]'>
        <div className='max-w-4xl mx-auto text-center'>
          <p className='text-[12px] text-[#A67DD4] font-semibold uppercase tracking-widest mb-2'>
            Across All Programs
          </p>
          <h2 className='font-serif text-[32px] font-bold text-[#2D1B5E] mb-10'>
            What You Will Learn
          </h2>
          <div className='grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto'>
            {[
              'Break free from emotional pain and patterns',
              'Set healthy boundaries without guilt',
              'Rebuild your self-worth from the inside out',
              'Release what no longer serves you',
              'Develop confidence and clarity',
              'Heal your inner child and past wounds',
              'Create a life rooted in joy and purpose',
              'Connect with a supportive community of women',
            ].map((item) => (
              <div key={item} className='flex items-start gap-3'>
                <span className='text-[#7C5CBF] mt-0.5 text-[16px]'>✦</span>
                <p className='text-[14px] text-[#4A3570]'>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Not sure section */}
      <section className='py-16 px-4 bg-white'>
        <div className='max-w-3xl mx-auto text-center'>
          <h2 className='font-serif text-[30px] sm:text-[36px] font-bold text-[#2D1B5E] mb-4'>
            Not sure which program is right for you?
          </h2>
          <p className='text-[16px] text-[#6B5B8B] leading-relaxed mb-8'>
            Book a free 30-minute exploration call with Masuma. Together, we'll
            figure out the best next step for your healing journey.
          </p>
          <Button href='/contact' size='lg'>
            Book a Free Exploration Call <ArrowRightIcon size={18} />
          </Button>
        </div>
      </section>
    </>
  )
}
