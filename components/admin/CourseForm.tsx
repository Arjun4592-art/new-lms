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
import type { Course } from '@/types'

interface Props {
  initial?: Partial<Course>
  courseId?: string
}

const COLORS = [
  'from-[#7C5CBF] to-[#A67DD4]',
  'from-[#C084F5] to-[#A67DD4]',
  'from-[#8B5CF6] to-[#9B6FC8]',
  'from-[#A67DD4] to-[#C084F5]',
  'from-[#9B6FC8] to-[#7C5CBF]',
]

const EMOJIS = ['🔥', '🌸', '🌿', '✨', '💬', '🌺', '🦋', '💜', '🌙', '⭐']

export default function CourseForm({ initial, courseId }: Props) {
  const router = useRouter()
  const isEditing = !!courseId

  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    emoji: initial?.emoji ?? '🔥',
    color: initial?.color ?? COLORS[0],
    price: initial?.price ?? 0,
    isFree: initial?.isFree ?? false,
    format: initial?.format ?? 'Recorded',
    totalLessons: initial?.totalLessons ?? 0,
    totalDuration: initial?.totalDuration ?? 0,
    category: initial?.category ?? 'Healing',
    tags: initial?.tags?.join(', ') ?? '',
    published: initial?.published ?? false,
    instructorName: initial?.instructorName ?? 'Masuma',
    whatYouLearn: initial?.whatYouLearn?.join('\n') ?? '',
    includes: initial?.includes?.join('\n') ?? '',
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
        description: form.description,
        emoji: form.emoji,
        color: form.color,
        price: form.isFree ? 0 : Number(form.price),
        isFree: form.isFree,
        format: form.format,
        totalLessons: Number(form.totalLessons),
        totalDuration: Number(form.totalDuration),
        category: form.category,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        published: form.published,
        instructorName: form.instructorName,
        instructorId: 'admin',
        whatYouLearn: form.whatYouLearn.split('\n').filter(Boolean),
        includes: form.includes.split('\n').filter(Boolean),
        thumbnail: form.thumbnail,
        rating: initial?.rating ?? 0,
        reviewCount: initial?.reviewCount ?? 0,
      }
      if (isEditing) {
        await setDoc(doc(db, 'courses', courseId), data, { merge: true })
      } else {
        await addDoc(collection(db, 'courses'), {
          ...data,
          createdAt: serverTimestamp(),
        })
      }
      router.push('/admin/courses')
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Failed to save course. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <style>{`
        .cf-card {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; padding: 24px;
        }
        .cf-card-title {
          font-family: var(--font-serif);
          font-size: 17px; font-weight: 500;
          color: var(--color-text); margin-bottom: 18px;
        }
        .cf-label {
          display: block; font-size: 13px; font-weight: 600;
          color: var(--color-primary-mid); margin-bottom: 6px;
        }
        .cf-input {
          width: 100%; padding: 11px 16px;
          border: 1px solid var(--color-surface-border);
          border-radius: 10px; font-size: 14px;
          color: var(--color-text);
          background-color: var(--color-bg);
          font-family: var(--font-sans);
          outline: none; resize: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .cf-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(122,106,88,0.12);
        }
        .cf-input::placeholder { color: var(--color-primary-muted); }

        .cf-emoji-btn {
          width: 40px; height: 40px; border-radius: 10px;
          font-size: 20px; display: flex; align-items: center; justify-content: center;
          border: none; cursor: pointer; transition: background-color 0.15s;
          background-color: var(--color-surface);
        }
        .cf-emoji-btn:hover { background-color: var(--color-surface-hover); }
        .cf-emoji-btn.selected {
          background-color: var(--color-primary);
          box-shadow: 0 4px 12px rgba(122,106,88,0.25);
        }

        .cf-color-btn {
          width: 40px; height: 40px; border-radius: 10px;
          border: 2px solid transparent; cursor: pointer;
          transition: transform 0.15s;
        }
        .cf-color-btn.selected {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }
        .cf-color-btn:hover { transform: scale(1.1); }

        .cf-checkbox-label {
          display: flex; align-items: center; gap: 10px; cursor: pointer;
        }
        .cf-checkbox {
          width: 16px; height: 16px;
          accent-color: var(--color-primary); cursor: pointer;
        }

        .cf-submit-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 10px;
          font-size: 14px; font-weight: 600; border: none; cursor: pointer;
          background-color: var(--color-primary);
          color: var(--color-bg);
          font-family: var(--font-sans);
          transition: background-color 0.2s;
          box-shadow: 0 4px 14px rgba(122,106,88,0.22);
        }
        .cf-submit-btn:hover:not(:disabled) { background-color: var(--color-primary-hover); }
        .cf-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .cf-cancel-btn {
          padding: 12px 22px; border-radius: 10px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          background: transparent;
          color: var(--color-primary-mid);
          border: 1px solid var(--color-surface-border);
          font-family: var(--font-sans);
          transition: background-color 0.2s, border-color 0.2s;
        }
        .cf-cancel-btn:hover {
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

        {/* ── Basic info ── */}
        <div className='cf-card space-y-5'>
          <h2 className='cf-card-title'>Basic Information</h2>

          <div>
            <label className='cf-label'>Course Title *</label>
            <input
              type='text'
              name='title'
              required
              value={form.title}
              onChange={handleChange}
              placeholder='e.g. Pain to Power Masterclass'
              className='cf-input'
            />
          </div>

          <div>
            <label className='cf-label'>Description *</label>
            <textarea
              name='description'
              required
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder='Describe what this course is about...'
              className='cf-input'
            />
          </div>

          {/* Emoji */}
          <div>
            <label className='cf-label'>Emoji</label>
            <div className='flex flex-wrap gap-2'>
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type='button'
                  onClick={() => setForm((p) => ({ ...p, emoji }))}
                  className={`cf-emoji-btn ${form.emoji === emoji ? 'selected' : ''}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className='cf-label'>Card Color</label>
            <div className='flex flex-wrap gap-2'>
              {COLORS.map((color) => (
                <button
                  key={color}
                  type='button'
                  onClick={() => setForm((p) => ({ ...p, color }))}
                  className={`cf-color-btn bg-gradient-to-br ${color} ${form.color === color ? 'selected' : ''}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className='cf-label'>Thumbnail URL</label>
            <input
              type='url'
              name='thumbnail'
              value={form.thumbnail}
              onChange={handleChange}
              placeholder='https://...'
              className='cf-input'
            />
          </div>
        </div>

        {/* ── Pricing ── */}
        <div className='cf-card space-y-5'>
          <h2 className='cf-card-title'>Pricing</h2>
          <label className='cf-checkbox-label'>
            <input
              type='checkbox'
              name='isFree'
              checked={form.isFree}
              onChange={handleChange}
              className='cf-checkbox'
            />
            <span
              className='text-[14px] font-medium'
              style={{ color: 'var(--color-primary-mid)' }}
            >
              This is a free course
            </span>
          </label>
          {!form.isFree && (
            <div>
              <label className='cf-label'>Price (₹)</label>
              <input
                type='number'
                name='price'
                value={form.price}
                onChange={handleChange}
                min={0}
                placeholder='12999'
                className='cf-input'
              />
            </div>
          )}
        </div>

        {/* ── Course details ── */}
        <div className='cf-card space-y-5'>
          <h2 className='cf-card-title'>Course Details</h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='cf-label'>Format</label>
              <select
                name='format'
                value={form.format}
                onChange={handleChange}
                className='cf-input'
              >
                <option>Recorded</option>
                <option>Live</option>
                <option>Live + Recorded</option>
              </select>
            </div>
            <div>
              <label className='cf-label'>Category</label>
              <select
                name='category'
                value={form.category}
                onChange={handleChange}
                className='cf-input'
              >
                <option>Healing</option>
                <option>Workshops</option>
                <option>Coaching</option>
                <option>Self-Development</option>
              </select>
            </div>
            <div>
              <label className='cf-label'>Total Lessons</label>
              <input
                type='number'
                name='totalLessons'
                value={form.totalLessons}
                onChange={handleChange}
                min={0}
                className='cf-input'
              />
            </div>
            <div>
              <label className='cf-label'>Duration (minutes)</label>
              <input
                type='number'
                name='totalDuration'
                value={form.totalDuration}
                onChange={handleChange}
                min={0}
                className='cf-input'
              />
            </div>
          </div>

          <div>
            <label className='cf-label'>Tags (comma separated)</label>
            <input
              type='text'
              name='tags'
              value={form.tags}
              onChange={handleChange}
              placeholder='healing, confidence, boundaries'
              className='cf-input'
            />
          </div>
          <div>
            <label className='cf-label'>Instructor Name</label>
            <input
              type='text'
              name='instructorName'
              value={form.instructorName}
              onChange={handleChange}
              className='cf-input'
            />
          </div>
        </div>

        {/* ── What you'll learn ── */}
        <div className='cf-card space-y-5'>
          <h2 className='cf-card-title'>What You&apos;ll Learn</h2>
          <div>
            <label className='cf-label'>One point per line</label>
            <textarea
              name='whatYouLearn'
              value={form.whatYouLearn}
              onChange={handleChange}
              rows={4}
              placeholder={
                'Break emotional patterns\nBuild confidence\nSet healthy boundaries'
              }
              className='cf-input'
            />
          </div>
          <div>
            <label className='cf-label'>Course Includes (one per line)</label>
            <textarea
              name='includes'
              value={form.includes}
              onChange={handleChange}
              rows={4}
              placeholder={
                '8 live Zoom sessions\nRecorded replays\n1:1 coaching call'
              }
              className='cf-input'
            />
          </div>
        </div>

        {/* ── Publish ── */}
        <div className='cf-card'>
          <label className='cf-checkbox-label'>
            <input
              type='checkbox'
              name='published'
              checked={form.published}
              onChange={handleChange}
              className='cf-checkbox'
            />
            <div>
              <p
                className='text-[14px] font-semibold'
                style={{ color: 'var(--color-primary-mid)' }}
              >
                Publish this course
              </p>
              <p
                className='text-[12px]'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                Published courses are visible to students
              </p>
            </div>
          </label>
        </div>

        {/* ── Submit ── */}
        <div className='flex items-center gap-4'>
          <button type='submit' disabled={saving} className='cf-submit-btn'>
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
            {saving ? 'Saving…' : isEditing ? 'Update Course' : 'Create Course'}
          </button>
          <button
            type='button'
            onClick={() => router.push('/admin/courses')}
            className='cf-cancel-btn'
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}
