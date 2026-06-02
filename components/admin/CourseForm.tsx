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
    <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl mx-auto'>
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl'>
          {error}
        </div>
      )}

      {/* Basic info */}
      <div className='bg-white border border-purple-100 rounded-2xl p-6 space-y-5'>
        <h2 className='font-serif text-[17px] font-bold text-[#2D1B5E]'>
          Basic Information
        </h2>

        {/* Title */}
        <div>
          <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
            Course Title *
          </label>
          <input
            type='text'
            name='title'
            required
            value={form.title}
            onChange={handleChange}
            placeholder='e.g. Pain to Power Masterclass'
            className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
          />
        </div>

        {/* Description */}
        <div>
          <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
            Description *
          </label>
          <textarea
            name='description'
            required
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder='Describe what this course is about...'
            className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all resize-none'
          />
        </div>

        {/* Emoji picker */}
        <div>
          <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
            Emoji
          </label>
          <div className='flex flex-wrap gap-2'>
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type='button'
                onClick={() => setForm((p) => ({ ...p, emoji }))}
                className={`w-10 h-10 rounded-xl text-[20px] flex items-center justify-center transition-all ${
                  form.emoji === emoji
                    ? 'bg-[#7C5CBF] shadow-lg'
                    : 'bg-[#F3EEFF] hover:bg-[#E8DEFF]'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div>
          <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
            Card Color
          </label>
          <div className='flex flex-wrap gap-2'>
            {COLORS.map((color) => (
              <button
                key={color}
                type='button'
                onClick={() => setForm((p) => ({ ...p, color }))}
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} transition-all ${
                  form.color === color
                    ? 'ring-2 ring-[#7C5CBF] ring-offset-2'
                    : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
            Thumbnail URL
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
      </div>

      {/* Pricing */}
      <div className='bg-white border border-purple-100 rounded-2xl p-6 space-y-5'>
        <h2 className='font-serif text-[17px] font-bold text-[#2D1B5E]'>
          Pricing
        </h2>

        <label className='flex items-center gap-3 cursor-pointer'>
          <input
            type='checkbox'
            name='isFree'
            checked={form.isFree}
            onChange={handleChange}
            className='w-4 h-4 accent-[#7C5CBF]'
          />
          <span className='text-[14px] font-medium text-[#4A3570]'>
            This is a free course
          </span>
        </label>

        {!form.isFree && (
          <div>
            <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
              Price (₹)
            </label>
            <input
              type='number'
              name='price'
              value={form.price}
              onChange={handleChange}
              min={0}
              placeholder='12999'
              className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
            />
          </div>
        )}
      </div>

      {/* Course details */}
      <div className='bg-white border border-purple-100 rounded-2xl p-6 space-y-5'>
        <h2 className='font-serif text-[17px] font-bold text-[#2D1B5E]'>
          Course Details
        </h2>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
              Format
            </label>
            <select
              name='format'
              value={form.format}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
            >
              <option>Recorded</option>
              <option>Live</option>
              <option>Live + Recorded</option>
            </select>
          </div>

          <div>
            <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
              Category
            </label>
            <select
              name='category'
              value={form.category}
              onChange={handleChange}
              className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
            >
              <option>Healing</option>
              <option>Workshops</option>
              <option>Coaching</option>
              <option>Self-Development</option>
            </select>
          </div>

          <div>
            <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
              Total Lessons
            </label>
            <input
              type='number'
              name='totalLessons'
              value={form.totalLessons}
              onChange={handleChange}
              min={0}
              className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
            />
          </div>

          <div>
            <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
              Duration (minutes)
            </label>
            <input
              type='number'
              name='totalDuration'
              value={form.totalDuration}
              onChange={handleChange}
              min={0}
              className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
            />
          </div>
        </div>

        <div>
          <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
            Tags (comma separated)
          </label>
          <input
            type='text'
            name='tags'
            value={form.tags}
            onChange={handleChange}
            placeholder='healing, confidence, women'
            className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
          />
        </div>

        <div>
          <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
            Instructor Name
          </label>
          <input
            type='text'
            name='instructorName'
            value={form.instructorName}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
          />
        </div>
      </div>

      {/* What you'll learn */}
      <div className='bg-white border border-purple-100 rounded-2xl p-6 space-y-5'>
        <h2 className='font-serif text-[17px] font-bold text-[#2D1B5E]'>
          What You'll Learn
        </h2>
        <div>
          <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
            One point per line
          </label>
          <textarea
            name='whatYouLearn'
            value={form.whatYouLearn}
            onChange={handleChange}
            rows={4}
            placeholder={
              'Break emotional patterns\nBuild confidence\nSet healthy boundaries'
            }
            className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all resize-none'
          />
        </div>

        <div>
          <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
            Course Includes (one per line)
          </label>
          <textarea
            name='includes'
            value={form.includes}
            onChange={handleChange}
            rows={4}
            placeholder={
              '8 live Zoom sessions\nRecorded replays\n1:1 coaching call'
            }
            className='w-full px-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all resize-none'
          />
        </div>
      </div>

      {/* Publish */}
      <div className='bg-white border border-purple-100 rounded-2xl p-6'>
        <label className='flex items-center gap-3 cursor-pointer'>
          <input
            type='checkbox'
            name='published'
            checked={form.published}
            onChange={handleChange}
            className='w-4 h-4 accent-[#7C5CBF]'
          />
          <div>
            <p className='text-[14px] font-semibold text-[#4A3570]'>
              Publish this course
            </p>
            <p className='text-[12px] text-[#8470A8]'>
              Published courses are visible to students
            </p>
          </div>
        </label>
      </div>

      {/* Submit */}
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
          {saving ? 'Saving...' : isEditing ? 'Update Course' : 'Create Course'}
        </button>
        <button
          type='button'
          onClick={() => router.push('/admin/courses')}
          className='px-6 py-3.5 border border-purple-200 text-[#6B5B8B] font-semibold rounded-xl hover:bg-[#F9F5FF] transition-colors'
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
