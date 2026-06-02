'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from 'firebase/firestore'
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
      <div className='space-y-4 animate-pulse'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='h-16 bg-purple-100 rounded-2xl' />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-6xl mx-auto'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-serif text-[26px] font-bold text-[#2D1B5E]'>
            Sessions
          </h1>
          <p className='text-[13px] text-[#8470A8]'>
            {sessions.length} total sessions
          </p>
        </div>
        <Link
          href='/admin/sessions/new'
          className='flex items-center gap-2 px-5 py-2.5 bg-[#7C5CBF] text-white font-bold rounded-xl no-underline hover:bg-[#6A4DAD] transition-colors text-[13.5px]'
        >
          + Add Session
        </Link>
      </div>

      <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden'>
        <div className='px-6 py-3 border-b border-purple-100 bg-[#F9F5FF] grid grid-cols-12 gap-4'>
          <p className='col-span-4 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Title
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Date
          </p>
          <p className='col-span-1 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Type
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Recording
          </p>
          <p className='col-span-3 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Actions
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className='px-6 py-12 text-center'>
            <CalendarIcon size={32} className='text-[#C084F5] mx-auto mb-3' />
            <p className='text-[15px] font-semibold text-[#2D1B5E] mb-1'>
              No sessions yet
            </p>
            <Link
              href='/admin/sessions/new'
              className='inline-flex items-center gap-2 px-5 py-2.5 bg-[#7C5CBF] text-white font-bold rounded-xl no-underline hover:bg-[#6A4DAD] transition-colors text-[13.5px] mt-3'
            >
              Add Session <ArrowRightIcon size={14} />
            </Link>
          </div>
        ) : (
          <div className='divide-y divide-purple-50'>
            {sessions.map((session) => (
              <div
                key={session.id}
                className='px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-[#FAFAFE]'
              >
                <div className='col-span-4'>
                  <p className='text-[13.5px] font-semibold text-[#2D1B5E] truncate'>
                    {session.title}
                  </p>
                  <p className='text-[11.5px] text-[#8470A8]'>
                    {session.time} · {session.duration}min
                  </p>
                </div>
                <p className='col-span-2 text-[13px] text-[#8470A8]'>
                  {session.date}
                </p>
                <div className='col-span-1'>
                  <span className='px-2 py-1 bg-[#F3EEFF] text-[#7C5CBF] text-[11px] font-semibold rounded-full'>
                    {session.type}
                  </span>
                </div>
                <div className='col-span-2'>
                  <span
                    className={`px-2 py-1 text-[11px] font-semibold rounded-full ${
                      session.isRecorded
                        ? 'bg-green-50 text-green-600'
                        : 'bg-orange-50 text-orange-500'
                    }`}
                  >
                    {session.isRecorded ? '✓ Available' : 'Not yet'}
                  </span>
                </div>
                <div className='col-span-3 flex items-center gap-2'>
                  <Link
                    href={`/admin/sessions/${session.id}`}
                    className='px-3 py-1.5 text-[12px] font-semibold text-[#7C5CBF] bg-[#F3EEFF] hover:bg-[#E8DEFF] rounded-lg no-underline transition-colors'
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(session.id)}
                    disabled={deleting === session.id}
                    className='px-3 py-1.5 text-[12px] font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50'
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
