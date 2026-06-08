'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
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
    <>
      <style>{`
        .sf-card {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; padding: 24px;
        }
        .sf-card-title {
          font-family: var(--font-serif);
          font-size: 17px; font-weight: 500;
          color: var(--color-text); margin-bottom: 18px;
        }
        .sf-label {
          display: block; font-size: 13px; font-weight: 600;
          color: var(--color-primary-mid); margin-bottom: 6px;
        }
        .sf-input {
          width: 100%; padding: 11px 16px;
          border: 1px solid var(--color-surface-border);
          border-radius: 10px; font-size: 14px;
          color: var(--color-text);
          background-color: var(--color-bg);
          font-family: var(--font-sans);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .sf-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(122,106,88,0.12);
        }
        .sf-input::placeholder { color: var(--color-primary-muted); }
        .sf-checkbox-label {
          display: flex; align-items: center; gap: 10px; cursor: pointer;
        }
        .sf-checkbox {
          width: 16px; height: 16px;
          accent-color: var(--color-primary); cursor: pointer; flex-shrink: 0;
        }
        .sf-submit-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 10px;
          font-size: 14px; font-weight: 600; border: none; cursor: pointer;
          background-color: var(--color-primary);
          color: var(--color-bg);
          font-family: var(--font-sans);
          transition: background-color 0.2s;
          box-shadow: 0 4px 14px rgba(122,106,88,0.22);
        }
        .sf-submit-btn:hover:not(:disabled) { background-color: var(--color-primary-hover); }
        .sf-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .sf-cancel-btn {
          padding: 12px 22px; border-radius: 10px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          background: transparent;
          color: var(--color-primary-mid);
          border: 1px solid var(--color-surface-border);
          font-family: var(--font-sans);
          transition: background-color 0.2s, border-color 0.2s;
        }
        .sf-cancel-btn:hover {
          background-color: var(--color-surface);
          border-color: var(--color-primary-muted);
        }
      `}</style>

      <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl mx-auto'>
        {error && (
          <div
            className='px-4 py-3 rounded-xl text-[13px]'
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
            }}
          >
            {error}
          </div>
        )}

        {/* ── Session Details ── */}
        <div className='sf-card space-y-5'>
          <h2 className='sf-card-title'>Session Details</h2>

          <div>
            <label className='sf-label'>Title *</label>
            <input
              type='text'
              name='title'
              required
              value={form.title}
              onChange={handleChange}
              placeholder='e.g. Group Zoom Call — Emotional Resilience'
              className='sf-input'
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='sf-label'>Date *</label>
              <input
                type='date'
                name='date'
                required
                value={form.date}
                onChange={handleChange}
                className='sf-input'
              />
            </div>
            <div>
              <label className='sf-label'>Time *</label>
              <input
                type='time'
                name='time'
                required
                value={form.time}
                onChange={handleChange}
                className='sf-input'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='sf-label'>Session Type</label>
              <select
                name='type'
                value={form.type}
                onChange={handleChange}
                className='sf-input'
              >
                <option>Live</option>
                <option>1:1</option>
                <option>Group</option>
                <option>Workshop</option>
              </select>
            </div>
            <div>
              <label className='sf-label'>Duration (minutes)</label>
              <input
                type='number'
                name='duration'
                value={form.duration}
                onChange={handleChange}
                min={0}
                className='sf-input'
              />
            </div>
          </div>

          <div>
            <label className='sf-label'>Visible To</label>
            <select
              name='visibleTo'
              value={form.visibleTo}
              onChange={handleChange}
              className='sf-input'
            >
              <option value='all'>All Enrolled Students</option>
              <option value='course'>Specific Course Only</option>
            </select>
          </div>

          {form.visibleTo === 'course' && (
            <div>
              <label className='sf-label'>Course ID</label>
              <input
                type='text'
                name='courseId'
                value={form.courseId}
                onChange={handleChange}
                placeholder='Enter course ID from Firestore'
                className='sf-input'
              />
            </div>
          )}
        </div>

        {/* ── Live Session ── */}
        <div className='sf-card space-y-5'>
          <h2 className='sf-card-title'>Live Session</h2>
          <div>
            <label className='sf-label'>Zoom Link</label>
            <input
              type='url'
              name='zoomLink'
              value={form.zoomLink}
              onChange={handleChange}
              placeholder='https://zoom.us/j/...'
              className='sf-input'
            />
          </div>
        </div>

        {/* ── Recording ── */}
        <div className='sf-card space-y-5'>
          <h2 className='sf-card-title'>Recording (after session)</h2>

          <label className='sf-checkbox-label'>
            <input
              type='checkbox'
              name='isRecorded'
              checked={form.isRecorded}
              onChange={handleChange}
              className='sf-checkbox'
            />
            <span
              className='text-[14px] font-medium'
              style={{ color: 'var(--color-primary-mid)' }}
            >
              Recording is available
            </span>
          </label>

          {form.isRecorded && (
            <>
              <div>
                <label className='sf-label'>YouTube Video URL (Unlisted)</label>
                <input
                  type='url'
                  name='recordingUrl'
                  value={form.recordingUrl}
                  onChange={handleChange}
                  placeholder='https://www.youtube.com/watch?v=...'
                  className='sf-input'
                />
              </div>
              <div>
                <label className='sf-label'>Thumbnail URL (optional)</label>
                <input
                  type='url'
                  name='thumbnail'
                  value={form.thumbnail}
                  onChange={handleChange}
                  placeholder='https://...'
                  className='sf-input'
                />
              </div>
            </>
          )}
        </div>

        {/* ── Submit ── */}
        <div className='flex items-center gap-4'>
          <button type='submit' disabled={saving} className='sf-submit-btn'>
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
            {saving
              ? 'Saving…'
              : isEditing
                ? 'Update Session'
                : 'Create Session'}
          </button>
          <button
            type='button'
            onClick={() => router.push('/admin/sessions')}
            className='sf-cancel-btn'
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}
