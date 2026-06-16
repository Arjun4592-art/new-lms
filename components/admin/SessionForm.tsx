'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

interface SessionFormData {
  id?: string
  title: string
  date: string
  time: string
  type: string
  zoomLink: string
  recordingUrl: string
  courseId: string
  visibleTo: string
  duration: number
  isRecorded: boolean
  thumbnail: string
}

interface Props {
  initial?: Partial<SessionFormData>
  sessionId?: string
}

interface CourseOption {
  id: string
  title: string
  emoji: string
}

export default function SessionForm({ initial, sessionId }: Props) {
  const router = useRouter()
  const isEditing = !!sessionId

  const [courses, setCourses] = useState<CourseOption[]>([])
  const [coursesLoading, setCoursesLoading] = useState(false)

  const [form, setForm] = useState({
    title: initial?.title ?? '',
    date: initial?.date ?? '',
    time: initial?.time ?? '',
    type: initial?.type ?? 'Live',
    zoomLink: initial?.zoomLink ?? '',
    recordingUrl: initial?.recordingUrl ?? '',
    courseId: initial?.courseId ?? 'all',
    visibleTo: initial?.visibleTo ?? 'all',
    duration: initial?.duration ?? 60,
    isRecorded: initial?.isRecorded ?? false,
    thumbnail: initial?.thumbnail ?? '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCourses() {
      setCoursesLoading(true)
      try {
        const snap = await getDocs(
          query(collection(db, 'courses'), where('published', '==', true)),
        )
        setCourses(
          snap.docs.map((d) => ({
            id: d.id,
            title: d.data().title as string,
            emoji: d.data().emoji as string,
          })),
        )
      } catch (err) {
        console.error('Failed to fetch courses:', err)
      } finally {
        setCoursesLoading(false)
      }
    }
    fetchCourses()
  }, [])

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const data = {
        title: form.title,
        date: form.date,
        time: form.time,
        type: form.type,
        zoomLink: form.zoomLink,
        recordingUrl: form.recordingUrl,
        courseId: form.courseId,
        visibleTo: form.visibleTo,
        duration: Number(form.duration),
        isRecorded: form.isRecorded,
        thumbnail: form.thumbnail,
      }
      if (isEditing) {
        await setDoc(doc(db, 'sessions', sessionId), data, { merge: true })
      } else {
        await addDoc(collection(db, 'sessions'), {
          ...data,
          createdAt: serverTimestamp(),
        })
      }
      router.push('/admin/sessions')
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Failed to save session. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full px-4 py-[11px] border border-surface-border rounded-[10px] text-[14px] text-primary-dark bg-[#f5f0e8] font-sans outline-none transition-all duration-200 placeholder:text-primary-muted focus:border-primary focus:ring-2 focus:ring-[rgba(122,106,88,0.12)]'

  const labelClass = 'block text-[13px] font-semibold text-primary-mid mb-1.5'

  const cardClass =
    'bg-[#f5f0e8] border border-surface-border rounded-xl p-6 space-y-5'

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 max-w-3xl mx-auto animate-[fadeInUp_0.4s_ease_both]'
    >
      {/* Error */}
      {error && (
        <div className='px-4 py-3 rounded-xl text-[13px] bg-red-50 border border-red-200 text-red-600 animate-[fadeInDown_0.3s_ease_both]'>
          {error}
        </div>
      )}

      {/* Session Details */}
      <div className={cardClass}>
        <h2 className='font-serif text-[17px] font-medium text-primary-dark'>
          Session Details
        </h2>

        <div>
          <label className={labelClass}>Title *</label>
          <input
            type='text'
            name='title'
            required
            value={form.title}
            onChange={handleChange}
            placeholder='e.g. Group Zoom Call — Emotional Resilience'
            className={inputClass}
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className={labelClass}>Date *</label>
            <input
              type='date'
              name='date'
              required
              value={form.date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Time *</label>
            <input
              type='time'
              name='time'
              required
              value={form.time}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className={labelClass}>Session Type</label>
            <select
              name='type'
              value={form.type}
              onChange={handleChange}
              className={inputClass}
            >
              <option>Live</option>
              <option>1:1</option>
              <option>Group</option>
              <option>Workshop</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Duration (minutes)</label>
            <input
              type='number'
              name='duration'
              value={form.duration}
              onChange={handleChange}
              min={0}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Visible To</label>
          <select
            name='visibleTo'
            value={form.visibleTo}
            onChange={handleChange}
            className={inputClass}
          >
            <option value='all'>All Enrolled Students</option>
            <option value='course'>Specific Course Only</option>
          </select>
        </div>

        {form.visibleTo === 'course' && (
          <div className='animate-[fadeInUp_0.3s_ease_both]'>
            <label className={labelClass}>Select Course</label>
            {coursesLoading ? (
              <div className='w-full px-4 py-[11px] border border-surface-border rounded-[10px] bg-surface text-[13px] text-primary-muted animate-pulse'>
                Loading courses…
              </div>
            ) : courses.length === 0 ? (
              <div className='w-full px-4 py-[11px] border border-surface-border rounded-[10px] bg-surface text-[13px] text-primary-muted'>
                No published courses found
              </div>
            ) : (
              <select
                name='courseId'
                value={form.courseId}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value=''>— Select a course —</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Live Session */}
      <div className={cardClass}>
        <h2 className='font-serif text-[17px] font-medium text-primary-dark'>
          Live Session
        </h2>
        <div>
          <label className={labelClass}>Zoom Link</label>
          <input
            type='url'
            name='zoomLink'
            value={form.zoomLink}
            onChange={handleChange}
            placeholder='https://zoom.us/j/...'
            className={inputClass}
          />
        </div>
      </div>

      {/* Recording */}
      <div className={cardClass}>
        <h2 className='font-serif text-[17px] font-medium text-primary-dark'>
          Recording (after session)
        </h2>

        <label className='flex items-center gap-3 cursor-pointer'>
          <input
            type='checkbox'
            name='isRecorded'
            checked={form.isRecorded}
            onChange={handleChange}
            className='w-4 h-4 rounded accent-[#7a6a58] cursor-pointer shrink-0'
          />
          <span className='text-[14px] font-medium text-primary-mid'>
            Recording is available
          </span>
        </label>

        {form.isRecorded && (
          <div className='space-y-4 animate-[fadeInUp_0.3s_ease_both]'>
            <div>
              <label className={labelClass}>YouTube Video URL (Unlisted)</label>
              <input
                type='url'
                name='recordingUrl'
                value={form.recordingUrl}
                onChange={handleChange}
                placeholder='https://www.youtube.com/watch?v=...'
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Thumbnail URL (optional)</label>
              <input
                type='url'
                name='thumbnail'
                value={form.thumbnail}
                onChange={handleChange}
                placeholder='https://...'
                className={inputClass}
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className='flex items-center gap-4'>
        <button
          type='submit'
          disabled={saving}
          className='flex items-center gap-2 px-7 py-3 rounded-[10px] text-[14px] font-semibold bg-primary text-[#f5f0e8] hover:bg-primary-hover transition-colors duration-200 shadow-[0_4px_14px_rgba(122,106,88,0.22)] disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {saving && (
            <svg
              className='animate-spin w-4 h-4'
              viewBox='0 0 24 24'
              fill='none'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8v8H4z'
              />
            </svg>
          )}
          {saving ? 'Saving…' : isEditing ? 'Update Session' : 'Create Session'}
        </button>
        <button
          type='button'
          onClick={() => router.push('/admin/sessions')}
          className='px-6 py-3 rounded-[10px] text-[14px] font-semibold text-primary-mid bg-transparent border border-surface-border hover:bg-surface hover:border-primary-muted transition-colors duration-200'
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
