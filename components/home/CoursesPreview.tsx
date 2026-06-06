'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
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
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchCourses() {
      try {
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

  // Animate cards in when they appear
  useEffect(() => {
    if (loading || courses.length === 0) return
    const els = sectionRef.current?.querySelectorAll('[data-card]')
    if (!els) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('card-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [loading, courses])

  return (
    <>
      <style>{`
        .courses-section { background-color: var(--color-bg); }

        /* Heading row */
        .courses-header {
          opacity: 0; transform: translateY(18px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .courses-header.header-visible {
          opacity: 1; transform: translateY(0);
        }

        /* Cards */
        [data-card] {
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.55s ease, transform 0.55s ease,
                      box-shadow 0.3s ease, translate 0.3s ease;
        }
        [data-card].card-visible { opacity: 1; transform: translateY(0); }
        [data-card]:nth-child(1) { transition-delay: 0.05s; }
        [data-card]:nth-child(2) { transition-delay: 0.13s; }
        [data-card]:nth-child(3) { transition-delay: 0.21s; }
        [data-card]:nth-child(4) { transition-delay: 0.29s; }

        /* Hover lift */
        .course-card-link:hover {
          translate: 0 -4px;
          box-shadow: 0 16px 40px rgba(44,34,24,0.12);
        }
        .course-card-link:hover .card-title {
          color: var(--color-primary) !important;
        }
        .course-card-link:hover .enroll-arrow {
          transform: translateX(4px);
        }

        /* Skeleton pulse */
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .skeleton { animation: skeleton-pulse 1.6s ease-in-out infinite; }

        /* Category badge on card image */
        .card-badge {
          position: absolute; top: 10px;
          font-size: 10.5px; font-weight: 600;
          padding: 3px 9px; border-radius: 9999px;
          letter-spacing: 0.04em;
        }
        .card-badge-free {
          right: 10px;
          background: #2c2218;
          color: #f5f0e8;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .card-badge-cat {
          left: 10px;
          background: rgba(0,0,0,0.45);
          border: 1px solid rgba(255,255,255,0.25);
          color: #ffffff;
          backdrop-filter: blur(6px);
        }

        .enroll-arrow { transition: transform 0.2s ease; }
      `}</style>

      <section ref={sectionRef} className='courses-section py-20 px-4 sm:px-6'>
        <div className='max-w-6xl mx-auto'>
          {/* Header row */}
          <div className='courses-header header-visible flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12'>
            <SectionHeading
              eyebrow='Programs & Courses'
              title='Choose Your Path to Healing'
              subtitle="Every individual's journey is unique. Find the program that speaks to your heart."
            />
            <Button
              href='/courses'
              variant='outline'
              size='sm'
              className='shrink-0 self-start sm:self-auto'
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
                  className='skeleton rounded-xl overflow-hidden'
                  style={{ border: '1px solid var(--color-surface-border)' }}
                >
                  <div
                    className='h-36'
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  />
                  <div className='p-5 space-y-3'>
                    <div
                      className='h-3.5 rounded w-3/4'
                      style={{ backgroundColor: 'var(--color-surface)' }}
                    />
                    <div
                      className='h-3 rounded'
                      style={{ backgroundColor: 'var(--color-primary-light)' }}
                    />
                    <div
                      className='h-3 rounded w-5/6'
                      style={{ backgroundColor: 'var(--color-primary-light)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && courses.length === 0 && (
            <div className='text-center py-16'>
              <p
                className='text-[15px]'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                No programmes available yet. Check back soon.
              </p>
            </div>
          )}

          {/* Grid */}
          {!loading && courses.length > 0 && (
            <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5'>
              {courses.map((course, idx) => (
                <div key={course.id} data-card>
                  <Link
                    href={`/courses/${course.id}`}
                    className='course-card-link block rounded-xl overflow-hidden no-underline h-full'
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-surface-border)',
                    }}
                  >
                    {/* Card image area */}
                    <div
                      className={`h-36 flex items-center justify-center relative bg-linear-to-br ${course.color}`}
                    >
                      <span className='text-[46px]'>{course.emoji}</span>
                      {course.isFree && (
                        <span className='card-badge card-badge-free'>Free</span>
                      )}
                      {!course.isFree && course.category && (
                        <span className='card-badge card-badge-cat'>
                          {course.category}
                        </span>
                      )}
                    </div>

                    {/* Card body */}
                    <div className='p-5'>
                      <h3
                        className='card-title font-serif text-[16px] font-medium mb-2 leading-snug transition-colors'
                        style={{ color: 'var(--color-text)' }}
                      >
                        {course.title}
                      </h3>
                      <p
                        className='text-[13px] leading-relaxed mb-4 line-clamp-3 font-light'
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {course.description}
                      </p>

                      {/* Meta */}
                      <div className='space-y-1.5'>
                        <div
                          className='flex items-center gap-2 text-[12px]'
                          style={{ color: 'var(--color-primary-muted)' }}
                        >
                          <ClockIcon
                            size={13}
                            style={{ color: 'var(--color-primary)' }}
                          />
                          {course.totalDuration} min
                        </div>
                        <div
                          className='flex items-center gap-2 text-[12px]'
                          style={{ color: 'var(--color-primary-muted)' }}
                        >
                          <PlayIcon
                            size={13}
                            style={{ color: 'var(--color-primary)' }}
                          />
                          {course.format}
                        </div>
                        <div
                          className='flex items-center gap-2 text-[12px]'
                          style={{ color: 'var(--color-primary-muted)' }}
                        >
                          <UsersIcon
                            size={13}
                            style={{ color: 'var(--color-primary)' }}
                          />
                          {course.totalLessons} lessons
                        </div>
                      </div>

                      {/* Footer */}
                      <div
                        className='mt-4 pt-4 flex items-center justify-between'
                        style={{ borderTop: '1px solid var(--color-surface)' }}
                      >
                        <p
                          className='text-[16px] font-semibold'
                          style={{ color: 'var(--color-text)' }}
                        >
                          {course.isFree
                            ? 'Free'
                            : `₹${course.price?.toLocaleString('en-IN')}`}
                        </p>
                        <div
                          className='flex items-center gap-1 text-[13px] font-semibold'
                          style={{ color: 'var(--color-primary)' }}
                        >
                          Enroll
                          <ArrowRightIcon size={15} className='enroll-arrow' />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
