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
    <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl mx-auto'>
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl'>
          {error}
        </div>
      )}

      <div className='bg-white border border-purple-100 rounded-2xl p-6 space-y-5'>
        <h2 className='font-serif text-[17px] font-bold text-[#2D1B5E]'>
          Resource Details
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
            placeholder='e.g. Emotional Patterns Worksheet'
            className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
              Type
            </label>
            <select
              name='type'
              value={form.type}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
            >
              <option>PDF</option>
              <option>Video</option>
              <option>Doc</option>
              <option>Sheet</option>
            </select>
          </div>
          <div>
            <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
              File Size
            </label>
            <input
              type='text'
              name='size'
              value={form.size}
              onChange={handleChange}
              placeholder='e.g. 1.2 MB'
              className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
            />
          </div>
        </div>

        <div>
          <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
            File URL *
          </label>
          <input
            type='url'
            name='url'
            required
            value={form.url}
            onChange={handleChange}
            placeholder='https://drive.google.com/...'
            className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
          />
          <p className='text-[11.5px] text-[#B0A0CC] mt-1'>
            Upload to Google Drive or Firebase Storage and paste the link here
          </p>
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

      <div className='flex items-center gap-4'>
        <button
          type='submit'
          disabled={saving}
          className='flex items-center gap-2 px-8 py-3.5 bg-[#7C5CBF] hover:bg-[#6A4DAD] text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-200 disabled:opacity-60'
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
          {saving
            ? 'Saving...'
            : isEditing
              ? 'Update Resource'
              : 'Add Resource'}
        </button>
        <button
          type='button'
          onClick={() => router.push('/admin/resources')}
          className='px-6 py-3.5 border border-purple-200 text-[#6B5B8B] font-semibold rounded-xl hover:bg-[#F9F5FF] transition-colors'
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
