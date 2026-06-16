'use client'

import { useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useCourse } from '@/hooks/useCourse'
import { useEnrollment } from '@/hooks/useEnrollment'
import { useAuthContext } from '@/context/AuthContext'
import EnrollButton from '@/components/courses/EnrollButton'
import {
  ClockIcon,
  PlayIcon,
  UsersIcon,
  CheckIcon,
} from '@/components/ui/Icons'

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { course, loading, error } = useCourse(courseId)
  const { user } = useAuthContext()
  const { enrollment } = useEnrollment(user?.uid, courseId)

  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const els = contentRef.current?.querySelectorAll('[data-anim]')
    if (!els?.length) return
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('anim-in')
            observer.unobserve(e.target)
          }
        }),
      { threshold: 0.08 },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [loading])

  // ── Loading ──
  if (loading) {
    return (
      <>
        <style>{`
          .cd-skeleton { background-color: var(--color-surface); animation: cd-pulse 1.6s ease-in-out infinite; border-radius: 12px; }
          @keyframes cd-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        `}</style>
        <div
          className='min-h-screen pt-24 px-4'
          style={{ backgroundColor: 'var(--color-bg)' }}
        >
          <div className='max-w-6xl mx-auto space-y-6'>
            <div className='cd-skeleton h-64 rounded-2xl' />
            <div className='grid lg:grid-cols-3 gap-8'>
              <div className='lg:col-span-2 space-y-4'>
                <div className='cd-skeleton h-8 w-2/3' />
                <div className='cd-skeleton h-32' />
              </div>
              <div className='cd-skeleton h-64' />
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── Error ──
  if (error || !course) {
    return (
      <div
        className='min-h-screen flex items-center justify-center'
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <p style={{ color: 'var(--color-primary-muted)' }}>Course not found.</p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .cd-page { background-color: var(--color-bg); min-height: 100vh; }

        /* Animate in */
        [data-anim] {
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        [data-anim].anim-in { opacity: 1; transform: translateY(0); }
        [data-anim-delay="1"] { transition-delay: 0.1s; }
        [data-anim-delay="2"] { transition-delay: 0.2s; }
        [data-anim-delay="3"] { transition-delay: 0.3s; }
        [data-anim-delay="4"] { transition-delay: 0.4s; }

        /* Hero */
        .cd-hero { position: relative; overflow: hidden; }
        .cd-hero-blob {
          position: absolute; border-radius: 50%; pointer-events: none;
          background: rgba(255,255,255,0.08); filter: blur(40px);
        }
        .cd-hero-meta { display: flex; flex-wrap: wrap; gap: 20px; }
        .cd-hero-meta-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px;
        }

        /* Cards */
        .cd-card {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; padding: 24px;
        }
        .cd-card-title {
          font-family: var(--font-serif);
          font-size: 20px; font-weight: 500;
          color: var(--color-text); margin-bottom: 18px;
        }

        /* Check items */
        .cd-check-dot {
          width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
          background-color: var(--color-surface);
          border: 1px solid var(--color-surface-border);
          display: flex; align-items: center; justify-content: center;
          margin-top: 2px;
        }
        .cd-check-row { display: flex; align-items: center; gap: 10px; }
        .cd-check-row-top { display: flex; align-items: flex-start; gap: 10px; }

        /* Hero fade-in on mount */
        @keyframes heroFadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .cd-hero-emoji  { animation: heroFadeUp 0.5s 0.05s ease both; }
        .cd-hero-title  { animation: heroFadeUp 0.5s 0.15s ease both; }
        .cd-hero-desc   { animation: heroFadeUp 0.5s 0.25s ease both; }
        .cd-hero-meta   { animation: heroFadeUp 0.5s 0.35s ease both; }
      `}</style>

      <div className='cd-page'>
        {/* ── Hero ── */}
        <div
          className='cd-hero pt-28 pb-16 px-4 sm:px-6'
          style={{
            background:
              'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-mid) 100%)',
          }}
        >
          <div
            className='cd-hero-blob'
            style={{ width: 300, height: 300, top: -80, right: -60 }}
          />
          <div
            className='cd-hero-blob'
            style={{ width: 200, height: 200, bottom: -60, left: -40 }}
          />

          <div className='relative max-w-6xl mx-auto'>
            <span className='cd-hero-emoji text-[60px] block mb-4'>
              {course.emoji}
            </span>
            <h1
              className='cd-hero-title font-serif text-[34px] sm:text-[44px] font-medium leading-tight mb-4'
              style={{ color: 'var(--color-primary-light)' }}
            >
              {course.title}
            </h1>
            <p
              className='cd-hero-desc text-[16px] sm:text-[17px] leading-relaxed max-w-2xl mb-7 font-light'
              style={{ color: 'var(--color-primary-accent)' }}
            >
              {course.description}
            </p>
            <div className='cd-hero-meta'>
              <div
                className='cd-hero-meta-item'
                style={{ color: 'var(--color-primary-accent)' }}
              >
                <ClockIcon
                  size={15}
                  style={{ color: 'var(--color-primary-muted)' }}
                />
                {course.totalDuration} min total
              </div>
              <div
                className='cd-hero-meta-item'
                style={{ color: 'var(--color-primary-accent)' }}
              >
                <PlayIcon
                  size={15}
                  style={{ color: 'var(--color-primary-muted)' }}
                />
                {course.totalLessons} lessons
              </div>
              <div
                className='cd-hero-meta-item'
                style={{ color: 'var(--color-primary-accent)' }}
              >
                <UsersIcon
                  size={15}
                  style={{ color: 'var(--color-primary-muted)' }}
                />
                {course.format}
              </div>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div
          ref={contentRef}
          className='max-w-6xl mx-auto px-4 sm:px-6 py-12 grid lg:grid-cols-3 gap-8'
        >
          <div className='lg:col-span-2 space-y-6'>
            {/* What you'll learn */}
            {course.whatYouLearn && course.whatYouLearn.length > 0 && (
              <div data-anim data-anim-delay='1' className='cd-card'>
                <h2 className='cd-card-title'>What You Will Learn</h2>
                <div className='grid sm:grid-cols-2 gap-3'>
                  {course.whatYouLearn.map((item) => (
                    <div key={item} className='cd-check-row-top'>
                      <div className='cd-check-dot'>
                        <CheckIcon
                          size={9}
                          style={{ color: 'var(--color-primary)' }}
                        />
                      </div>
                      <p
                        className='text-[14px] font-light'
                        style={{ color: 'var(--color-primary-mid)' }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Includes */}
            {course.includes && course.includes.length > 0 && (
              <div data-anim data-anim-delay='2' className='cd-card'>
                <h2 className='cd-card-title'>This Course Includes</h2>
                <div className='space-y-2.5'>
                  {course.includes.map((item) => (
                    <div key={item} className='cd-check-row'>
                      <CheckIcon
                        size={14}
                        style={{ color: 'var(--color-primary)', flexShrink: 0 }}
                      />
                      <p
                        className='text-[14px] font-light'
                        style={{ color: 'var(--color-primary-mid)' }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enroll sidebar */}
          <div data-anim data-anim-delay='3'>
            <EnrollButton
              courseId={courseId}
              courseTitle={course.title}
              price={course.price}
              isFree={course.isFree}
              isEnrolled={!!enrollment}
            />
          </div>
        </div>
      </div>
    </>
  )
}
