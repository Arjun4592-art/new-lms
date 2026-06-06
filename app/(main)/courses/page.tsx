'use client'

import { useEffect, useRef, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
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

const LEARNINGS = [
  'Break free from emotional pain and patterns',
  'Set healthy boundaries without guilt',
  'Rebuild your self-worth from the inside out',
  'Release what no longer serves you',
  'Develop confidence and clarity',
  'Create a life rooted in joy and purpose',
  'Connect with a supportive community of people',
]

function CourseCardFirestore({
  course,
  index,
}: {
  course: Course
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('fc-card-visible'), index * 100)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <div ref={ref} className='fc-card-wrap'>
      <Link href={`/courses/${course.id}`} className='fc-card group'>
        <div
          className={`h-36 bg-gradient-to-br ${course.color} flex items-center justify-center relative`}
        >
          <span className='text-[52px]'>{course.emoji}</span>
          {course.isFree && <span className='fc-badge-free'>Free</span>}
          {!course.isFree && course.category && (
            <span className='fc-badge-cat'>{course.category}</span>
          )}
        </div>
        <div className='p-6'>
          <h3 className='fc-title font-serif text-[17px] font-medium mb-2 leading-snug'>
            {course.title}
          </h3>
          <p
            className='text-[13.5px] leading-relaxed mb-4 line-clamp-3 font-light'
            style={{ color: 'var(--color-primary)' }}
          >
            {course.description}
          </p>
          <div className='flex flex-wrap gap-x-4 gap-y-1.5 mb-4'>
            <div
              className='flex items-center gap-1.5 text-[12.5px]'
              style={{ color: 'var(--color-primary-muted)' }}
            >
              <ClockIcon size={13} style={{ color: 'var(--color-primary)' }} />{' '}
              {course.totalDuration} min
            </div>
            <div
              className='flex items-center gap-1.5 text-[12.5px]'
              style={{ color: 'var(--color-primary-muted)' }}
            >
              <PlayIcon size={13} style={{ color: 'var(--color-primary)' }} />{' '}
              {course.format}
            </div>
            <div
              className='flex items-center gap-1.5 text-[12.5px]'
              style={{ color: 'var(--color-primary-muted)' }}
            >
              <UsersIcon size={13} style={{ color: 'var(--color-primary)' }} />{' '}
              {course.totalLessons} lessons
            </div>
          </div>
          {course.includes && course.includes.length > 0 && (
            <div className='flex flex-wrap gap-1.5 mb-5'>
              {course.includes.slice(0, 3).map((item) => (
                <span key={item} className='fc-tag'>
                  {item}
                </span>
              ))}
            </div>
          )}
          <div
            className='pt-4 flex items-center justify-between'
            style={{ borderTop: '1px solid var(--color-surface)' }}
          >
            <p
              className='text-[18px] font-semibold'
              style={{ color: 'var(--color-text)' }}
            >
              {course.isFree
                ? 'Free'
                : `₹${course.price.toLocaleString('en-IN')}`}
            </p>
            <div
              className='flex items-center gap-1 text-[13px] font-semibold'
              style={{ color: 'var(--color-primary)' }}
            >
              Enroll <ArrowRightIcon size={15} className='fc-arrow' />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

function useScrollAnimate(selector: string, deps: any[] = []) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const els = ref.current?.querySelectorAll(selector)
    if (!els?.length) return
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('anim-in')
            observer.unobserve(e.target)
          }
        }),
      { threshold: 0.1 },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  const heroRef = useScrollAnimate('[data-hero]')
  const learnRef = useScrollAnimate('[data-learn]')
  const ctaRef = useScrollAnimate('[data-cta]')

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
      <style>{`
        /* ── Base ── */
        .courses-page { background-color: var(--color-bg); }

        /* ── Generic animate ── */
        [data-hero], [data-learn], [data-cta] {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        [data-hero].anim-in,
        [data-learn].anim-in,
        [data-cta].anim-in {
          opacity: 1;
          transform: translateY(0);
        }
        [data-delay="1"] { transition-delay: 0.1s; }
        [data-delay="2"] { transition-delay: 0.2s; }
        [data-delay="3"] { transition-delay: 0.3s; }
        [data-delay="4"] { transition-delay: 0.4s; }

        /* ── Learn items: slide from left ── */
        [data-learn] {
          transform: translateX(-12px);
        }
        [data-learn].anim-in {
          transform: translateX(0);
        }

        /* ── Hero ── */
        .courses-hero {
          background-color: var(--color-surface);
          border-bottom: 1px solid var(--color-surface-border);
        }
        .hero-eyebrow {
          display: inline-block;
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.13em;
          color: var(--color-primary);
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          padding: 5px 14px; border-radius: 9999px; margin-bottom: 20px;
        }
        .hero-title-accent { color: var(--color-primary); font-style: italic; }

        /* ── Card ── */
        .fc-card-wrap {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .fc-card-wrap.fc-card-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .fc-card {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px;
          overflow: hidden;
          display: block;
          text-decoration: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
        }
        .fc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(44,34,24,0.12);
        }
        .fc-card:hover .fc-title { color: var(--color-primary); }
        .fc-card:hover .fc-arrow { transform: translateX(4px); }
        .fc-title { color: var(--color-text); transition: color 0.2s; }
        .fc-arrow { transition: transform 0.2s; }
        .fc-badge-free {
          position: absolute; top: 10px; right: 10px;
          background: #2c2218; color: #f5f0e8;
          font-size: 10.5px; font-weight: 600;
          padding: 3px 9px; border-radius: 9999px;
        }
        .fc-badge-cat {
          position: absolute; top: 10px; left: 10px;
          background: rgba(0,0,0,0.45); color: #fff;
          border: 1px solid rgba(255,255,255,0.25);
          font-size: 10.5px; font-weight: 600;
          padding: 3px 9px; border-radius: 9999px;
          backdrop-filter: blur(6px);
        }
        .fc-tag {
          font-size: 11px;
          background-color: var(--color-surface);
          color: var(--color-primary);
          border: 1px solid var(--color-surface-border);
          padding: 2px 8px; border-radius: 9999px;
        }

        /* ── Skeleton ── */
        .fc-skeleton {
          border-radius: 12px;
          background-color: var(--color-surface);
          animation: skeleton-pulse 1.6s ease-in-out infinite;
        }
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.5; }
        }

        /* ── Learn section ── */
        .learn-section { background-color: var(--color-surface); }

        /* ── CTA section ── */
        .cta-section {
          background-color: var(--color-bg);
          border-top: 1px solid var(--color-surface-border);
        }
      `}</style>

      {/* ── Hero ── */}
      <section className='courses-hero pt-28 pb-16 px-4 relative overflow-hidden'>
        <div
          className='absolute top-10 right-10 w-64 h-64 rounded-full blur-3xl pointer-events-none'
          style={{
            backgroundColor: 'var(--color-primary-light)',
            opacity: 0.5,
          }}
        />
        <div ref={heroRef} className='max-w-4xl mx-auto text-center relative'>
          <span data-hero data-delay='1' className='hero-eyebrow'>
            Programs &amp; Courses
          </span>
          <h1
            data-hero
            data-delay='2'
            className='font-serif text-[44px] sm:text-[54px] font-medium leading-tight mb-6'
            style={{ color: 'var(--color-text)' }}
          >
            Choose Your Path to{' '}
            <span className='hero-title-accent'>Healing</span>
          </h1>
          <p
            data-hero
            data-delay='3'
            className='text-[17px] leading-relaxed max-w-2xl mx-auto font-light'
            style={{ color: 'var(--color-primary)' }}
          >
            Every individual&apos;s journey is unique. Whether you&apos;re just
            beginning or ready to go deep — there&apos;s a programme designed
            for exactly where you are right now.
          </p>
        </div>
      </section>

      {/* ── Courses grid ── */}
      <section className='courses-page py-16 px-4'>
        <div className='max-w-6xl mx-auto'>
          {loading ? (
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='fc-skeleton h-80' />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className='text-center py-20'>
              <p className='text-[48px] mb-4'>🌿</p>
              <h3
                className='font-serif text-[20px] font-medium mb-2'
                style={{ color: 'var(--color-text)' }}
              >
                No courses available yet
              </h3>
              <p
                className='text-[14px] font-light'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                Check back soon — new programmes are being added.
              </p>
            </div>
          ) : (
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {courses.map((course, i) => (
                <CourseCardFirestore
                  key={course.id}
                  course={course}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── What you'll learn ── */}
      <section className='learn-section py-16 px-4'>
        <div ref={learnRef} className='max-w-4xl mx-auto text-center'>
          <p
            data-learn
            className='text-[11px] font-semibold uppercase tracking-widest mb-2'
            style={{
              color: 'var(--color-primary-muted)',
              transitionDelay: '0s',
            }}
          >
            Across All Programs
          </p>
          <h2
            data-learn
            className='font-serif text-[32px] font-medium mb-10'
            style={{ color: 'var(--color-text)', transitionDelay: '0.1s' }}
          >
            What You Will Learn
          </h2>
          <div className='grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto'>
            {LEARNINGS.map((item, i) => (
              <div
                key={item}
                data-learn
                className='flex items-start gap-3'
                style={{ transitionDelay: `${0.15 + i * 0.07}s` }}
              >
                <span
                  className='mt-0.5 text-[14px]'
                  style={{ color: 'var(--color-primary-muted)' }}
                >
                  ✦
                </span>
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
      </section>

      {/* ── Not sure CTA ── */}
      <section className='cta-section py-16 px-4'>
        <div ref={ctaRef} className='max-w-3xl mx-auto text-center'>
          <h2
            data-cta
            data-delay='1'
            className='font-serif text-[30px] sm:text-[36px] font-medium mb-4'
            style={{ color: 'var(--color-text)' }}
          >
            Not sure which program is right for you?
          </h2>
          <p
            data-cta
            data-delay='2'
            className='text-[16px] leading-relaxed mb-8 font-light'
            style={{ color: 'var(--color-primary)' }}
          >
            Book a free 30-minute exploration call with Masuma. Together,
            we&apos;ll figure out the best next step for your healing journey.
          </p>
          <div data-cta data-delay='3'>
            <Button href='/contact' size='lg'>
              Book a Free Exploration Call <ArrowRightIcon size={18} />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
