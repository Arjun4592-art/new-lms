'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { CalendarIcon, ArrowRightIcon } from '@/components/ui/Icons'

interface Session {
  id: string
  title: string
  date: string
  time: string
  type: string
  zoomLink: string
  recordingUrl: string
  isRecorded: boolean
  visibleTo: string
  duration: number
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function fetchSessions() {
    try {
      const snap = await getDocs(collection(db, 'sessions'))
      setSessions(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Session))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this session?')) return
    setDeleting(id)
    try {
      await deleteDoc(doc(db, 'sessions', id))
      setSessions((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse max-w-6xl mx-auto px-4 sm:px-6'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='h-16 bg-surface rounded-2xl' />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-6xl mx-auto px-4 sm:px-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-[fadeInDown_0.4s_ease_both]'>
        <div>
          <h1 className='font-serif text-2xl sm:text-[26px] font-bold text-primary-dark'>
            Sessions
          </h1>
          <p className='text-[13px] text-primary-muted mt-0.5'>
            {sessions.length} total sessions
          </p>
        </div>
        <Link
          href='/admin/sessions/new'
          className='flex items-center gap-2 px-5 py-2.5 bg-primary text-[#f5f0e8] font-semibold rounded-xl no-underline hover:bg-primary-hover transition-colors duration-200 text-[13.5px] w-fit'
        >
          + Add Session
        </Link>
      </div>

      {/* Table */}
      <div className='bg-[#f5f0e8] border border-surface-border rounded-2xl overflow-hidden animate-[fadeInUp_0.4s_ease_both]'>
        {/* Column headers — hidden on mobile */}
        <div className='hidden sm:grid px-6 py-3 border-b border-surface-border bg-surface grid-cols-12 gap-4'>
          <p className='col-span-4 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Title
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Date
          </p>
          <p className='col-span-1 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Type
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Recording
          </p>
          <p className='col-span-3 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Actions
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className='px-6 py-12 text-center'>
            <CalendarIcon
              size={32}
              className='text-primary-muted mx-auto mb-3'
            />
            <p className='text-[15px] font-semibold text-primary-dark mb-1'>
              No sessions yet
            </p>
            <Link
              href='/admin/sessions/new'
              className='inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-[#f5f0e8] font-semibold rounded-xl no-underline hover:bg-primary-hover transition-colors duration-200 text-[13.5px] mt-3'
            >
              Add Session <ArrowRightIcon size={14} />
            </Link>
          </div>
        ) : (
          <div className='divide-y divide-surface-border'>
            {sessions.map((session, i) => (
              <div
                key={session.id}
                style={{ animationDelay: `${i * 50}ms` }}
                className='animate-[fadeInUp_0.35s_ease_both] px-4 sm:px-6 py-4 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 sm:items-center hover:bg-surface transition-colors duration-150'
              >
                {/* Title */}
                <div className='sm:col-span-4'>
                  <p className='text-[13.5px] font-semibold text-primary-dark truncate'>
                    {session.title}
                  </p>
                  <p className='text-[11.5px] text-primary-muted'>
                    {session.time} · {session.duration}min
                  </p>
                </div>

                {/* Mobile: inline labels */}
                <div className='flex flex-wrap gap-x-4 gap-y-2 sm:contents'>
                  <p className='sm:col-span-2 text-[13px] text-primary-muted'>
                    <span className='sm:hidden text-[11px] uppercase tracking-wide font-semibold text-primary-muted mr-1'>
                      Date:{' '}
                    </span>
                    {session.date}
                  </p>

                  <div className='sm:col-span-1 flex items-center'>
                    <span className='px-2 py-1 bg-surface text-primary text-[11px] font-semibold rounded-full border border-surface-border'>
                      {session.type}
                    </span>
                  </div>

                  <div className='sm:col-span-2 flex items-center'>
                    <span
                      className={`px-2 py-1 text-[11px] font-semibold rounded-full ${
                        session.isRecorded
                          ? 'bg-green-50 text-green-600'
                          : 'bg-[#f5f0e8] text-primary-muted border border-surface-border'
                      }`}
                    >
                      {session.isRecorded ? '✓ Available' : 'Not yet'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className='sm:col-span-3 flex items-center gap-2'>
                  <Link
                    href={`/admin/sessions/${session.id}`}
                    className='px-3 py-1.5 text-[12px] font-semibold text-primary bg-surface hover:bg-surface-hover rounded-lg no-underline transition-colors duration-150 border border-surface-border'
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(session.id)}
                    disabled={deleting === session.id}
                    className='px-3 py-1.5 text-[12px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-150 disabled:opacity-50'
                  >
                    {deleting === session.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
