'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
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

export default function SessionForm({ initial, sessionId }: Props) {
  const router = useRouter()
  const isEditing = !!sessionId

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

  return (
    <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl mx-auto'>
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl'>
          {error}
        </div>
      )}

      <div className='bg-white border border-purple-100 rounded-2xl p-6 space-y-5'>
        <h2 className='font-serif text-[17px] font-bold text-[#2D1B5E]'>
          Session Details
        </h2>

        <div>
          <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
            Title *
          </label>
          <input
            type='text'
            name='title'
            required
            value={form.title}
            onChange={handleChange}
            placeholder='e.g. Group Zoom Call — Emotional Resilience'
            className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
              Date *
            </label>
            <input
              type='date'
              name='date'
              required
              value={form.date}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
            />
          </div>
          <div>
            <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
              Time *
            </label>
            <input
              type='time'
              name='time'
              required
              value={form.time}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
              Session Type
            </label>
            <select
              name='type'
              value={form.type}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
            >
              <option>Live</option>
              <option>1:1</option>
              <option>Group</option>
              <option>Workshop</option>
            </select>
          </div>
          <div>
            <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
              Duration (minutes)
            </label>
            <input
              type='number'
              name='duration'
              value={form.duration}
              onChange={handleChange}
              min={0}
              className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
            />
          </div>
        </div>

        <div>
          <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
            Visible To
          </label>
          <select
            name='visibleTo'
            value={form.visibleTo}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
          >
            <option value='all'>All Enrolled Students</option>
            <option value='course'>Specific Course Only</option>
          </select>
        </div>

        {form.visibleTo === 'course' && (
          <div>
            <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
              Course ID
            </label>
            <input
              type='text'
              name='courseId'
              value={form.courseId}
              onChange={handleChange}
              placeholder='Enter course ID from Firestore'
              className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
            />
          </div>
        )}
      </div>

      {/* Live session */}
      <div className='bg-white border border-purple-100 rounded-2xl p-6 space-y-5'>
        <h2 className='font-serif text-[17px] font-bold text-[#2D1B5E]'>
          Live Session
        </h2>
        <div>
          <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
            Zoom Link
          </label>
          <input
            type='url'
            name='zoomLink'
            value={form.zoomLink}
            onChange={handleChange}
            placeholder='https://zoom.us/j/...'
            className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
          />
        </div>
      </div>

      {/* Recording */}
      <div className='bg-white border border-purple-100 rounded-2xl p-6 space-y-5'>
        <h2 className='font-serif text-[17px] font-bold text-[#2D1B5E]'>
          Recording (after session)
        </h2>

        <label className='flex items-center gap-3 cursor-pointer'>
          <input
            type='checkbox'
            name='isRecorded'
            checked={form.isRecorded}
            onChange={handleChange}
            className='w-4 h-4 accent-[#7C5CBF]'
          />
          <span className='text-[14px] font-medium text-[#4A3570]'>
            Recording is available
          </span>
        </label>

        {form.isRecorded && (
          <>
            <div>
              <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
                YouTube Video URL (Unlisted)
              </label>
              <input
                type='url'
                name='recordingUrl'
                value={form.recordingUrl}
                onChange={handleChange}
                placeholder='https://www.youtube.com/watch?v=...'
                className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
              />
            </div>
            <div>
              <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
                Thumbnail URL (optional)
              </label>
              <input
                type='url'
                name='thumbnail'
                value={form.thumbnail}
                onChange={handleChange}
                placeholder='https://...'
                className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
              />
            </div>
          </>
        )}
      </div>

      {/* Submit */}
      <div className='flex items-center gap-4'>
        <button
          type='submit'
          disabled={saving}
          className='flex items-center gap-2 px-8 py-3.5 bg-[#7C5CBF] hover:bg-[#6A4DAD] text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-200 disabled:opacity-60'
        >
          {saving && (
            <svg className='animate-spin w-4 h-4' viewBox='0 0 24 24' fill='none'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' />
            </svg>
          )}
          {saving ? 'Saving...' : isEditing ? 'Update Session' : 'Create Session'}
        </button>
        <button
          type='button'
          onClick={() => router.push('/admin/sessions')}
          className='px-6 py-3.5 border border-purple-200 text-[#6B5B8B] font-semibold rounded-xl hover:bg-[#F9F5FF] transition-colors'
        >
          Cancel
        </button>
      </div>
    </form>
  )
}