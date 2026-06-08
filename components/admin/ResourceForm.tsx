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

interface Props {
  initial?: any
  resourceId?: string
}

export default function ResourceForm({ initial, resourceId }: Props) {
  const router = useRouter()
  const isEditing = !!resourceId

  const [form, setForm] = useState({
    title: initial?.title ?? '',
    type: initial?.type ?? 'PDF',
    url: initial?.url ?? '',
    size: initial?.size ?? '',
    courseId: initial?.courseId ?? '',
    visibleTo: initial?.visibleTo ?? 'all',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const data = {
        title: form.title,
        type: form.type,
        url: form.url,
        size: form.size,
        courseId: form.visibleTo === 'all' ? 'all' : form.courseId,
        visibleTo: form.visibleTo,
      }
      if (isEditing) {
        await setDoc(doc(db, 'resources', resourceId), data, { merge: true })
      } else {
        await addDoc(collection(db, 'resources'), {
          ...data,
          createdAt: serverTimestamp(),
        })
      }
      router.push('/admin/resources')
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Failed to save resource. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <style>{`
        .rf-card {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; padding: 24px;
        }
        .rf-label {
          display: block; font-size: 13px; font-weight: 600;
          color: var(--color-primary-mid); margin-bottom: 6px;
        }
        .rf-input {
          width: 100%; padding: 11px 16px;
          border: 1px solid var(--color-surface-border);
          border-radius: 10px; font-size: 14px;
          color: var(--color-text);
          background-color: var(--color-bg);
          font-family: var(--font-sans);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .rf-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(122,106,88,0.12);
        }
        .rf-input::placeholder { color: var(--color-primary-muted); }
        .rf-submit-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 10px;
          font-size: 14px; font-weight: 600; border: none; cursor: pointer;
          background-color: var(--color-primary);
          color: var(--color-bg);
          font-family: var(--font-sans);
          transition: background-color 0.2s;
          box-shadow: 0 4px 14px rgba(122,106,88,0.22);
        }
        .rf-submit-btn:hover:not(:disabled) { background-color: var(--color-primary-hover); }
        .rf-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .rf-cancel-btn {
          padding: 12px 22px; border-radius: 10px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          background: transparent;
          color: var(--color-primary-mid);
          border: 1px solid var(--color-surface-border);
          font-family: var(--font-sans);
          transition: background-color 0.2s, border-color 0.2s;
        }
        .rf-cancel-btn:hover {
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

        <div className='rf-card space-y-5'>
          <h2
            className='font-serif text-[17px] font-medium'
            style={{ color: 'var(--color-text)' }}
          >
            Resource Details
          </h2>

          <div>
            <label className='rf-label'>Title *</label>
            <input
              type='text'
              name='title'
              required
              value={form.title}
              onChange={handleChange}
              placeholder='e.g. Emotional Patterns Worksheet'
              className='rf-input'
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='rf-label'>Type</label>
              <select
                name='type'
                value={form.type}
                onChange={handleChange}
                className='rf-input'
              >
                <option>PDF</option>
                <option>Video</option>
                <option>Doc</option>
                <option>Sheet</option>
              </select>
            </div>
            <div>
              <label className='rf-label'>File Size</label>
              <input
                type='text'
                name='size'
                value={form.size}
                onChange={handleChange}
                placeholder='e.g. 1.2 MB'
                className='rf-input'
              />
            </div>
          </div>

          <div>
            <label className='rf-label'>File URL *</label>
            <input
              type='url'
              name='url'
              required
              value={form.url}
              onChange={handleChange}
              placeholder='https://drive.google.com/...'
              className='rf-input'
            />
            <p
              className='text-[11.5px] mt-1.5'
              style={{ color: 'var(--color-primary-muted)' }}
            >
              Upload to Google Drive or Firebase Storage and paste the link here
            </p>
          </div>

          <div>
            <label className='rf-label'>Visible To</label>
            <select
              name='visibleTo'
              value={form.visibleTo}
              onChange={handleChange}
              className='rf-input'
            >
              <option value='all'>All Enrolled Students</option>
              <option value='course'>Specific Course Only</option>
            </select>
          </div>

          {form.visibleTo === 'course' && (
            <div>
              <label className='rf-label'>Course ID</label>
              <input
                type='text'
                name='courseId'
                value={form.courseId}
                onChange={handleChange}
                placeholder='Enter course ID from Firestore'
                className='rf-input'
              />
            </div>
          )}
        </div>

        <div className='flex items-center gap-4'>
          <button type='submit' disabled={saving} className='rf-submit-btn'>
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
                ? 'Update Resource'
                : 'Add Resource'}
          </button>
          <button
            type='button'
            onClick={() => router.push('/admin/resources')}
            className='rf-cancel-btn'
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}
