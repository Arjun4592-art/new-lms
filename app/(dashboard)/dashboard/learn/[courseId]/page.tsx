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
import { CheckIcon, PlayIcon, LockIcon } from '@/components/ui/Icons'

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

  useEffect(() => {
    if (!courseId) return
    async function fetchContent() {
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
      const les = lesSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Lesson)
      setSections(secs)
      setLessons(les)
      if (les.length > 0) setActiveLesson(les[0])
    }
    fetchContent()
  }, [courseId])

  useEffect(() => {
    if (!enrollLoading && !enrollment) {
      router.push(`/courses/${courseId}`)
    }
  }, [enrollment, enrollLoading])

  const completedSet = new Set(enrollment?.completedLessons ?? [])

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
      completedSet.add(activeLesson.id)
      // Auto advance to next lesson
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
        <div className='h-8 w-48 bg-surface rounded' />
        <div className='aspect-video bg-surface rounded-2xl' />
      </div>
    )
  }

  return (
    <div className='max-w-6xl mx-auto'>
      <h1 className='font-serif text-[22px] font-bold text-primary-dark mb-4'>
        {course?.title}
      </h1>

      <div className='grid lg:grid-cols-3 gap-6'>
        {/* Video player */}
        <div className='lg:col-span-2 space-y-4'>
          <div className='aspect-video bg-black rounded-2xl overflow-hidden'>
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
              <div className='w-full h-full flex items-center justify-center text-primary-muted'>
                <PlayIcon size={48} />
              </div>
            )}
          </div>

          {activeLesson && (
            <div className='bg-white border border-surface-border rounded-2xl p-5'>
              <h2 className='font-serif text-[18px] font-bold text-primary-dark mb-2'>
                {activeLesson.title}
              </h2>
              <p className='text-[13px] text-primary-muted mb-4'>
                {activeLesson.duration} min
              </p>
              {!completedSet.has(activeLesson.id) ? (
                <button
                  onClick={handleMarkComplete}
                  disabled={marking}
                  className='px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl text-[14px] transition-colors disabled:opacity-60 flex items-center gap-2'
                >
                  <CheckIcon size={16} />
                  {marking ? 'Marking...' : 'Mark as Complete'}
                </button>
              ) : (
                <div className='flex items-center gap-2 text-green-600 text-[14px] font-semibold'>
                  <CheckIcon size={16} /> Completed
                </div>
              )}
            </div>
          )}
        </div>

        {/* Course outline */}
        <div className='bg-white border border-surface-border rounded-2xl overflow-hidden h-fit'>
          <div className='px-5 py-4 border-b border-surface-border bg-surface'>
            <p className='font-semibold text-primary-dark text-[14px]'>
              Course Content
            </p>
            <p className='text-[12px] text-primary-muted mt-0.5'>
              {completedSet.size}/{lessons.length} completed
            </p>
          </div>
          <div className='overflow-y-auto max-h-[600px]'>
            {sections.map((section) => (
              <div key={section.id}>
                <div className='px-5 py-3 bg-surface border-b border-surface-border'>
                  <p className='text-[12px] font-bold text-primary-mid uppercase tracking-wide'>
                    {section.title}
                  </p>
                </div>
                {lessons
                  .filter((l) => l.sectionId === section.id)
                  .map((lesson) => {
                    const done = completedSet.has(lesson.id)
                    const active = activeLesson?.id === lesson.id
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full flex items-center gap-3 px-5 py-3 text-left border-b border-surface-border transition-colors ${
                          active ? 'bg-surface' : 'hover:bg-surface'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            done
                              ? 'bg-green-100'
                              : active
                                ? 'bg-primary'
                                : 'bg-surface'
                          }`}
                        >
                          {done ? (
                            <CheckIcon size={12} className='text-green-600' />
                          ) : active ? (
                            <PlayIcon size={10} className='text-white' />
                          ) : (
                            <span className='text-[10px] text-primary-muted'>
                              {lesson.order}
                            </span>
                          )}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p
                            className={`text-[13px] truncate ${active ? 'font-semibold text-primary' : 'text-primary-mid'}`}
                          >
                            {lesson.title}
                          </p>
                          <p className='text-[11px] text-primary-muted'>
                            {lesson.duration} min
                          </p>
                        </div>
                      </button>
                    )
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
