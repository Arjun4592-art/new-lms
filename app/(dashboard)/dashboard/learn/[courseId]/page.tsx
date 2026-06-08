'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAuthContext } from '@/context/AuthContext'
import { useEnrollment } from '@/hooks/useEnrollment'
import { useCourse } from '@/hooks/useCourse'
import { markLessonComplete } from '@/hooks/useEnrollment'
import type { Section, Lesson } from '@/types'
import { CheckIcon, PlayIcon } from '@/components/ui/Icons'

export default function LearnPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const router = useRouter()
  const { user } = useAuthContext()

  const { course, loading: courseLoading } = useCourse(courseId)
  const { enrollment, loading: enrollLoading } = useEnrollment(
    user?.uid,
    courseId,
  )

  const [sections, setSections] = useState<Section[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [marking, setMarking] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(),
  )

  useEffect(() => {
    if (!courseId) return
    async function fetchContent() {
      try {
        const [secSnap, lesSnap] = await Promise.all([
          getDocs(
            query(
              collection(db, 'sections'),
              where('courseId', '==', courseId),
              orderBy('order'),
            ),
          ),
          getDocs(
            query(
              collection(db, 'lessons'),
              where('courseId', '==', courseId),
              orderBy('order'),
            ),
          ),
        ])
        const secs = secSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as Section,
        )
        const les = lesSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as Lesson,
        )
        setSections(secs)
        setLessons(les)
        if (les.length > 0) setActiveLesson(les[0])
      } catch (err: any) {
        console.error('Fetch content error:', err)
        setFetchError(err.message ?? 'Failed to load course content')
      }
    }
    fetchContent()
  }, [courseId])

  useEffect(() => {
    if (!enrollLoading && !enrollment) router.push(`/courses/${courseId}`)
  }, [enrollment, enrollLoading])

  useEffect(() => {
    if (enrollment?.completedLessons)
      setCompletedLessons(new Set(enrollment.completedLessons))
  }, [enrollment])

  async function handleMarkComplete() {
    if (!user || !activeLesson || !course) return
    setMarking(true)
    try {
      await markLessonComplete(
        user.uid,
        courseId,
        activeLesson.id,
        lessons.length,
      )
      setCompletedLessons((prev) => new Set([...prev, activeLesson.id]))
      const idx = lessons.findIndex((l) => l.id === activeLesson.id)
      if (idx < lessons.length - 1) setActiveLesson(lessons[idx + 1])
    } catch (err) {
      console.error(err)
    } finally {
      setMarking(false)
    }
  }

  if (courseLoading || enrollLoading) {
    return (
      <div className='animate-pulse max-w-6xl mx-auto space-y-4'>
        <div
          className='h-8 w-48 rounded'
          style={{ backgroundColor: 'var(--color-surface)' }}
        />
        <div
          className='aspect-video rounded-xl'
          style={{ backgroundColor: 'var(--color-surface)' }}
        />
      </div>
    )
  }

  const hasSections = sections.length > 0
  const unsectionedLessons = lessons.filter(
    (l) => !l.sectionId || !sections.find((s) => s.id === l.sectionId),
  )

  return (
    <>
      <style>{`
        .lp-card {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px;
        }
        .lp-mark-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 10px;
          font-size: 14px; font-weight: 600; border: none; cursor: pointer;
          background-color: var(--color-primary);
          color: var(--color-bg);
          transition: background-color 0.2s;
        }
        .lp-mark-btn:hover:not(:disabled) { background-color: var(--color-primary-hover); }
        .lp-mark-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .lp-outline-header {
          padding: 14px 20px;
          background-color: var(--color-surface);
          border-bottom: 1px solid var(--color-surface-border);
        }
        .lp-section-label {
          padding: 10px 20px;
          background-color: var(--color-surface);
          border-bottom: 1px solid var(--color-surface-border);
        }
        .lp-no-video {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 12px;
          background-color: var(--color-surface);
        }
      `}</style>

      <div className='max-w-6xl mx-auto'>
        <h1
          className='font-serif text-[22px] font-medium mb-4'
          style={{ color: 'var(--color-text)' }}
        >
          {course?.title}
        </h1>

        {fetchError && (
          <div
            className='mb-4 px-4 py-3 rounded-xl text-[13px]'
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
            }}
          >
            {fetchError}
          </div>
        )}

        <div className='grid lg:grid-cols-3 gap-6'>
          {/* ── Video player ── */}
          <div className='lg:col-span-2 space-y-4'>
            <div
              className='aspect-video rounded-xl overflow-hidden'
              style={{ backgroundColor: '#000' }}
            >
              {activeLesson?.videoUrl ? (
                activeLesson.videoUrl.includes('youtube') ||
                activeLesson.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={activeLesson.videoUrl.replace('watch?v=', 'embed/')}
                    className='w-full h-full'
                    allowFullScreen
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  />
                ) : (
                  <video
                    src={activeLesson.videoUrl}
                    controls
                    className='w-full h-full'
                  />
                )
              ) : (
                <div className='lp-no-video'>
                  <PlayIcon
                    size={48}
                    style={{ color: 'var(--color-primary-muted)' }}
                  />
                  <p
                    className='text-[14px]'
                    style={{ color: 'var(--color-primary-muted)' }}
                  >
                    {activeLesson
                      ? 'No video available for this lesson'
                      : 'Select a lesson to start'}
                  </p>
                </div>
              )}
            </div>

            {activeLesson && (
              <div className='lp-card p-5'>
                <h2
                  className='font-serif text-[18px] font-medium mb-1'
                  style={{ color: 'var(--color-text)' }}
                >
                  {activeLesson.title}
                </h2>
                {activeLesson.duration && (
                  <p
                    className='text-[13px] mb-4'
                    style={{ color: 'var(--color-primary-muted)' }}
                  >
                    {activeLesson.duration} min
                  </p>
                )}
                {!completedLessons.has(activeLesson.id) ? (
                  <button
                    onClick={handleMarkComplete}
                    disabled={marking}
                    className='lp-mark-btn'
                  >
                    <CheckIcon size={16} />
                    {marking ? 'Marking…' : 'Mark as Complete'}
                  </button>
                ) : (
                  <div
                    className='flex items-center gap-2 text-[14px] font-semibold'
                    style={{ color: '#16A34A' }}
                  >
                    <CheckIcon size={16} /> Completed
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Course outline ── */}
          <div className='lp-card overflow-hidden h-fit'>
            <div className='lp-outline-header'>
              <p
                className='font-semibold text-[14px]'
                style={{ color: 'var(--color-text)' }}
              >
                Course Content
              </p>
              <p
                className='text-[12px] mt-0.5'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                {completedLessons.size}/{lessons.length} completed
              </p>
            </div>

            <div className='overflow-y-auto max-h-[600px]'>
              {lessons.length === 0 ? (
                <div className='px-5 py-8 text-center'>
                  <p
                    className='text-[13.5px]'
                    style={{ color: 'var(--color-primary-muted)' }}
                  >
                    No lessons added yet.
                  </p>
                </div>
              ) : hasSections ? (
                <>
                  {sections.map((section) => {
                    const sectionLessons = lessons.filter(
                      (l) => l.sectionId === section.id,
                    )
                    if (sectionLessons.length === 0) return null
                    return (
                      <div key={section.id}>
                        <div className='lp-section-label'>
                          <p
                            className='text-[11.5px] font-semibold uppercase tracking-wide'
                            style={{ color: 'var(--color-primary-mid)' }}
                          >
                            {section.title}
                          </p>
                        </div>
                        {sectionLessons.map((lesson) => (
                          <LessonRow
                            key={lesson.id}
                            lesson={lesson}
                            active={activeLesson?.id === lesson.id}
                            done={completedLessons.has(lesson.id)}
                            onClick={() => setActiveLesson(lesson)}
                          />
                        ))}
                      </div>
                    )
                  })}
                  {unsectionedLessons.length > 0 && (
                    <div>
                      <div className='lp-section-label'>
                        <p
                          className='text-[11.5px] font-semibold uppercase tracking-wide'
                          style={{ color: 'var(--color-primary-mid)' }}
                        >
                          Other
                        </p>
                      </div>
                      {unsectionedLessons.map((lesson) => (
                        <LessonRow
                          key={lesson.id}
                          lesson={lesson}
                          active={activeLesson?.id === lesson.id}
                          done={completedLessons.has(lesson.id)}
                          onClick={() => setActiveLesson(lesson)}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                lessons.map((lesson) => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    active={activeLesson?.id === lesson.id}
                    done={completedLessons.has(lesson.id)}
                    onClick={() => setActiveLesson(lesson)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function LessonRow({
  lesson,
  active,
  done,
  onClick,
}: {
  lesson: Lesson
  active: boolean
  done: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className='w-full flex items-center gap-3 px-5 py-3 text-left transition-colors'
      style={{
        borderBottom: '1px solid var(--color-surface-border)',
        backgroundColor: active ? 'var(--color-surface)' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!active)
          e.currentTarget.style.backgroundColor = 'var(--color-surface)'
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <div
        className='w-6 h-6 rounded-full flex items-center justify-center shrink-0'
        style={{
          backgroundColor: done
            ? '#DCFCE7'
            : active
              ? 'var(--color-primary)'
              : 'var(--color-surface)',
        }}
      >
        {done ? (
          <CheckIcon size={12} style={{ color: '#16A34A' }} />
        ) : active ? (
          <PlayIcon size={10} style={{ color: 'var(--color-bg)' }} />
        ) : (
          <span
            className='text-[10px]'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            {lesson.order}
          </span>
        )}
      </div>
      <div className='flex-1 min-w-0'>
        <p
          className='text-[13px] truncate'
          style={{
            color: active ? 'var(--color-primary)' : 'var(--color-primary-mid)',
            fontWeight: active ? 600 : 400,
          }}
        >
          {lesson.title}
        </p>
        {lesson.duration && (
          <p
            className='text-[11px]'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            {lesson.duration} min
          </p>
        )}
      </div>
    </button>
  )
}
