'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { Course } from '@/types'
import { ArrowRightIcon, BookIcon, CheckIcon } from '@/components/ui/Icons'

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function fetchCourses() {
    try {
      const snap = await getDocs(
        query(collection(db, 'courses'), orderBy('createdAt', 'desc')),
      )
      setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Course))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this course?')) return
    setDeleting(id)
    try {
      await deleteDoc(doc(db, 'courses', id))
      setCourses((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse max-w-6xl mx-auto'>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className='h-20 rounded-xl'
            style={{ backgroundColor: 'var(--color-surface)' }}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <style>{`
        .ac-table {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; overflow: hidden;
        }
        .ac-table-header {
          padding: 12px 20px;
          background-color: var(--color-surface);
          border-bottom: 1px solid var(--color-surface-border);
          display: grid; grid-template-columns: 5fr 2fr 2fr 1fr 2fr; gap: 16px;
          align-items: center;
        }
        .ac-col-label {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--color-primary-muted);
        }
        .ac-row {
          padding: 14px 20px;
          display: grid; grid-template-columns: 5fr 2fr 2fr 1fr 2fr; gap: 16px;
          align-items: center;
          border-bottom: 1px solid var(--color-surface-border);
          transition: background-color 0.15s;
        }
        .ac-row:last-child { border-bottom: none; }
        .ac-row:hover { background-color: var(--color-surface); }

        /* Mobile: stack */
        @media (max-width: 640px) {
          .ac-table-header { display: none; }
          .ac-row {
            grid-template-columns: 1fr;
            gap: 10px; padding: 14px 16px;
          }
        }

        .ac-edit-btn {
          padding: 5px 12px; border-radius: 7px;
          font-size: 12px; font-weight: 600; text-decoration: none;
          background-color: var(--color-surface);
          color: var(--color-primary);
          border: 1px solid var(--color-surface-border);
          transition: background-color 0.15s, border-color 0.15s;
        }
        .ac-edit-btn:hover {
          background-color: var(--color-surface-hover);
          border-color: var(--color-primary-muted);
        }
        .ac-delete-btn {
          padding: 5px 12px; border-radius: 7px;
          font-size: 12px; font-weight: 600;
          background-color: #FEF2F2; color: #EF4444;
          border: none; cursor: pointer;
          transition: background-color 0.15s;
        }
        .ac-delete-btn:hover { background-color: #FEE2E2; color: #DC2626; }
        .ac-delete-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .ac-add-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 18px; border-radius: 10px;
          font-size: 13.5px; font-weight: 600; text-decoration: none;
          background-color: var(--color-primary);
          color: var(--color-bg);
          transition: background-color 0.2s;
        }
        .ac-add-btn:hover { background-color: var(--color-primary-hover); }

        .ac-published-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 9px; border-radius: 9999px;
          font-size: 11px; font-weight: 600;
          background-color: #DCFCE7; color: #16A34A;
        }
        .ac-draft-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 9px; border-radius: 9999px;
          font-size: 11px; font-weight: 600;
          background-color: #FFF7ED; color: #EA580C;
        }
      `}</style>

      <div className='space-y-6 max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between gap-4 flex-wrap'>
          <div>
            <h1
              className='font-serif text-[26px] font-medium'
              style={{ color: 'var(--color-text)' }}
            >
              Courses
            </h1>
            <p
              className='text-[13px]'
              style={{ color: 'var(--color-primary-muted)' }}
            >
              {courses.length} total courses
            </p>
          </div>
          <Link href='/admin/courses/new' className='ac-add-btn'>
            + Add Course
          </Link>
        </div>

        {/* Table */}
        <div className='ac-table'>
          <div className='ac-table-header'>
            <span className='ac-col-label'>Course</span>
            <span className='ac-col-label'>Price</span>
            <span className='ac-col-label'>Status</span>
            <span className='ac-col-label'>Lessons</span>
            <span className='ac-col-label'>Actions</span>
          </div>

          {courses.length === 0 ? (
            <div className='px-6 py-12 text-center'>
              <BookIcon
                size={32}
                style={{
                  color: 'var(--color-primary-muted)',
                  margin: '0 auto 12px',
                }}
              />
              <p
                className='text-[15px] font-medium mb-1'
                style={{ color: 'var(--color-text)' }}
              >
                No courses yet
              </p>
              <p
                className='text-[13px] mb-4 font-light'
                style={{ color: 'var(--color-primary-muted)' }}
              >
                Add your first course to get started
              </p>
              <Link href='/admin/courses/new' className='ac-add-btn'>
                Add Course <ArrowRightIcon size={14} />
              </Link>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className='ac-row'>
                {/* Course info */}
                <div className='flex items-center gap-3 min-w-0'>
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center shrink-0 text-[20px]`}
                  >
                    {course.emoji}
                  </div>
                  <div className='min-w-0'>
                    <p
                      className='text-[13.5px] font-semibold truncate'
                      style={{ color: 'var(--color-text)' }}
                    >
                      {course.title}
                    </p>
                    <p
                      className='text-[11.5px]'
                      style={{ color: 'var(--color-primary-muted)' }}
                    >
                      {course.format} · {course.category}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <p
                    className='text-[13.5px] font-semibold'
                    style={{ color: 'var(--color-text)' }}
                  >
                    {course.isFree
                      ? 'Free'
                      : `₹${course.price.toLocaleString('en-IN')}`}
                  </p>
                </div>

                {/* Status */}
                <div>
                  {course.published ? (
                    <span className='ac-published-badge'>
                      <CheckIcon size={9} /> Published
                    </span>
                  ) : (
                    <span className='ac-draft-badge'>Draft</span>
                  )}
                </div>

                {/* Lessons */}
                <div>
                  <p
                    className='text-[13.5px]'
                    style={{ color: 'var(--color-text)' }}
                  >
                    {course.totalLessons}
                  </p>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-2'>
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className='ac-edit-btn'
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(course.id)}
                    disabled={deleting === course.id}
                    className='ac-delete-btn'
                  >
                    {deleting === course.id ? '…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
