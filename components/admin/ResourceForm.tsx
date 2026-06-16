'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore'
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { db, storage } from '@/lib/firebase/config'

interface Course {
  id: string
  title: string
}

interface Props {
  initial?: any
  resourceId?: string
}

export default function ResourceForm({ initial, resourceId }: Props) {
  const router = useRouter()
  const isEditing = !!resourceId
  const fileInputRef = useRef<HTMLInputElement>(null)

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
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesLoading, setCoursesLoading] = useState(false)

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>(
    initial?.url ? 'url' : 'file',
  )
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (form.visibleTo !== 'course') return
    async function fetchCourses() {
      setCoursesLoading(true)
      try {
        const snap = await getDocs(collection(db, 'courses'))
        setCourses(
          snap.docs.map((d) => ({
            id: d.id,
            title: (d.data().title as string) ?? d.id,
          })),
        )
      } catch (err) {
        console.error(err)
      } finally {
        setCoursesLoading(false)
      }
    }
    fetchCourses()
  }, [form.visibleTo])

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)

    // Auto-detect type
    const ext = file.name.split('.').pop()?.toUpperCase() ?? ''
    const typeMap: Record<string, string> = {
      PDF: 'PDF',
      DOC: 'Doc',
      DOCX: 'Doc',
      XLS: 'Sheet',
      XLSX: 'Sheet',
      MP4: 'Video',
      MOV: 'Video',
    }
    const detectedType = typeMap[ext] ?? 'PDF'

    // Auto-format size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1)
    const sizeFormatted =
      file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(0)} KB`
        : `${sizeInMB} MB`

    setForm((prev) => ({
      ...prev,
      title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      type: detectedType,
      size: sizeFormatted,
    }))
  }

  async function uploadFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
      const storageRef = ref(storage, `resources/${fileName}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      setUploading(true)
      setUploadProgress(0)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          )
          setUploadProgress(progress)
        },
        (err) => {
          setUploading(false)
          reject(err)
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref)
          setUploading(false)
          resolve(url)
        },
      )
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      let finalUrl = form.url

      // Upload file if selected
      if (uploadMode === 'file' && selectedFile) {
        finalUrl = await uploadFile(selectedFile)
      }

      if (!finalUrl) {
        setError('Please upload a file or paste a URL.')
        setSaving(false)
        return
      }

      const data = {
        title: form.title,
        type: form.type,
        url: finalUrl,
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

  const inputClass =
    'w-full px-4 py-[11px] border border-surface-border rounded-[10px] text-[14px] text-primary-dark bg-[#f5f0e8] font-sans outline-none transition-all duration-200 placeholder:text-primary-muted focus:border-primary focus:ring-2 focus:ring-[rgba(122,106,88,0.12)] disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-surface'

  const labelClass = 'block text-[13px] font-semibold text-primary-mid mb-1.5'

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 max-w-3xl mx-auto animate-[fadeInUp_0.4s_ease_both]'
    >
      {error && (
        <div className='px-4 py-3 rounded-xl text-[13px] bg-red-50 border border-red-200 text-red-600 animate-[fadeInDown_0.3s_ease_both]'>
          {error}
        </div>
      )}

      {/* Resource Details */}
      <div className='bg-[#f5f0e8] border border-surface-border rounded-xl p-6 space-y-5'>
        <h2 className='font-serif text-[17px] font-medium text-primary-dark'>
          Resource Details
        </h2>

        {/* Title */}
        <div>
          <label className={labelClass}>Title *</label>
          <input
            type='text'
            name='title'
            required
            value={form.title}
            onChange={handleChange}
            placeholder='e.g. Emotional Patterns Worksheet'
            className={inputClass}
          />
        </div>

        {/* Type + Size */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className={labelClass}>Type</label>
            <select
              name='type'
              value={form.type}
              onChange={handleChange}
              className={inputClass}
            >
              <option>PDF</option>
              <option>Video</option>
              <option>Doc</option>
              <option>Sheet</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>File Size</label>
            <input
              type='text'
              name='size'
              value={form.size}
              onChange={handleChange}
              placeholder='e.g. 1.2 MB'
              className={inputClass}
            />
          </div>
        </div>

        {/* Upload Mode Toggle */}
        <div>
          <label className={labelClass}>File Source</label>
          <div className='flex rounded-[10px] border border-surface-border overflow-hidden'>
            <button
              type='button'
              onClick={() => setUploadMode('file')}
              className={`flex-1 py-2.5 text-[13px] font-semibold transition-colors duration-200 ${
                uploadMode === 'file'
                  ? 'bg-primary text-[#f5f0e8]'
                  : 'bg-[#f5f0e8] text-primary-muted hover:bg-surface'
              }`}
            >
              Upload File
            </button>
            <button
              type='button'
              onClick={() => setUploadMode('url')}
              className={`flex-1 py-2.5 text-[13px] font-semibold transition-colors duration-200 ${
                uploadMode === 'url'
                  ? 'bg-primary text-[#f5f0e8]'
                  : 'bg-[#f5f0e8] text-primary-muted hover:bg-surface'
              }`}
            >
              Paste URL
            </button>
          </div>
        </div>

        {/* File Upload */}
        {uploadMode === 'file' && (
          <div className='animate-[fadeInUp_0.3s_ease_both]'>
            <input
              ref={fileInputRef}
              type='file'
              accept='.pdf,.doc,.docx,.xls,.xlsx,.mp4,.mov'
              onChange={handleFileSelect}
              className='hidden'
            />

            {!selectedFile ? (
              <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                className='w-full border-2 border-dashed border-surface-border rounded-xl py-8 flex flex-col items-center gap-2 hover:border-primary hover:bg-surface transition-all duration-200 group'
              >
                <svg
                  className='w-8 h-8 text-primary-muted group-hover:text-primary transition-colors'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
                  />
                </svg>
                <span className='text-[13.5px] font-semibold text-primary-muted group-hover:text-primary transition-colors'>
                  Click to upload
                </span>
                <span className='text-[11.5px] text-primary-muted'>
                  PDF, Doc, Sheet, Video — max 50MB
                </span>
              </button>
            ) : (
              <div className='border border-surface-border rounded-xl p-4 bg-surface flex items-center gap-3 animate-[fadeInUp_0.25s_ease_both]'>
                <div className='w-10 h-10 rounded-lg bg-[#f5f0e8] border border-surface-border flex items-center justify-center shrink-0'>
                  <svg
                    className='w-5 h-5 text-primary'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
                    />
                  </svg>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-[13px] font-semibold text-primary-dark truncate'>
                    {selectedFile.name}
                  </p>
                  <p className='text-[11.5px] text-primary-muted'>
                    {form.size}
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className='text-primary-muted hover:text-red-500 transition-colors p-1'
                >
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Upload progress */}
            {uploading && (
              <div className='mt-3 space-y-1.5'>
                <div className='flex justify-between text-[12px] text-primary-muted'>
                  <span>Uploading…</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className='h-1.5 bg-surface rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-primary rounded-full transition-all duration-200'
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* URL Input */}
        {uploadMode === 'url' && (
          <div className='animate-[fadeInUp_0.3s_ease_both]'>
            <label className={labelClass}>File URL *</label>
            <input
              type='url'
              name='url'
              required={uploadMode === 'url'}
              value={form.url}
              onChange={handleChange}
              placeholder='https://drive.google.com/...'
              className={inputClass}
            />
            <p className='text-[11.5px] mt-1.5 text-primary-muted'>
              Upload to Google Drive or Firebase Storage and paste the link here
            </p>
          </div>
        )}

        {/* Visible To */}
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

        {/* Course Dropdown */}
        {form.visibleTo === 'course' && (
          <div className='animate-[fadeInUp_0.3s_ease_both]'>
            <label className={labelClass}>Select Course</label>
            {coursesLoading ? (
              <div className='w-full px-4 py-[11px] border border-surface-border rounded-[10px] bg-surface text-[13px] text-primary-muted animate-pulse'>
                Loading courses…
              </div>
            ) : courses.length === 0 ? (
              <div className='w-full px-4 py-[11px] border border-surface-border rounded-[10px] bg-surface text-[13px] text-primary-muted'>
                No courses found in Firestore
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
                    {c.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className='flex items-center gap-4'>
        <button
          type='submit'
          disabled={saving || uploading}
          className='flex items-center gap-2 px-7 py-3 rounded-[10px] text-[14px] font-semibold bg-primary text-[#f5f0e8] hover:bg-primary-hover transition-colors duration-200 shadow-[0_4px_14px_rgba(122,106,88,0.22)] disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {(saving || uploading) && (
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
          {uploading
            ? `Uploading ${uploadProgress}%`
            : saving
              ? 'Saving…'
              : isEditing
                ? 'Update Resource'
                : 'Add Resource'}
        </button>
        <button
          type='button'
          onClick={() => router.push('/admin/resources')}
          className='px-6 py-3 rounded-[10px] text-[14px] font-semibold text-primary-mid bg-transparent border border-surface-border hover:bg-surface hover:border-primary-muted transition-colors duration-200'
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
