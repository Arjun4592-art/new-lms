'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/context/AuthContext'
import { ClockIcon, LinkIcon } from '@/components/ui/Icons'

interface Session {
  id: string
  title: string
  date: string
  time: string
  type: string
  zoomLink: string
  isRecorded: boolean
  visibleTo: string
  courseId: string
  duration: number
}

export default function SessionsPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function fetch() {
      try {
        const snap = await getDocs(collection(db, 'sessions'))
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Session)

        // Filter: show global sessions + sessions for enrolled courses
        const filtered = all.filter(
          (s) =>
            s.visibleTo === 'all' ||
            user!.enrolledCourses?.includes(s.courseId),
        )

        // Only upcoming sessions (not recorded yet)
        const upcoming = filtered
          .filter((s) => !s.isRecorded)
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          )

        setSessions(upcoming)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [user])

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse max-w-3xl mx-auto'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='h-24 bg-purple-100 rounded-2xl' />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-3xl mx-auto'>
      <div>
        <p className='text-[12px] text-[#A67DD4] font-semibold uppercase tracking-widest mb-1'>
          Dashboard
        </p>
        <h1 className='font-serif text-[26px] font-bold text-[#2D1B5E]'>
          Upcoming Sessions
        </h1>
        <p className='text-[13px] text-[#8470A8] mt-1'>
          {sessions.length} upcoming session{sessions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className='bg-[#F9F5FF] border border-purple-100 rounded-2xl p-10 text-center'>
          <ClockIcon size={32} className='text-[#C084F5] mx-auto mb-3' />
          <p className='text-[15px] font-semibold text-[#2D1B5E] mb-1'>
            No upcoming sessions
          </p>
          <p className='text-[13px] text-[#8470A8]'>
            Check back soon for new sessions.
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {sessions.map((session) => {
            const isToday =
              new Date(session.date).toDateString() ===
              new Date().toDateString()

            return (
              <div
                key={session.id}
                className='bg-white border border-purple-100 rounded-2xl p-5 flex items-start gap-4'
              >
                <div className='w-12 h-12 rounded-xl bg-[#7C5CBF] flex items-center justify-center text-white shrink-0'>
                  <ClockIcon size={20} />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <p className='text-[15px] font-bold text-[#2D1B5E]'>
                      {session.title}
                    </p>
                    <span className='px-2 py-0.5 bg-[#F3EEFF] text-[#7C5CBF] text-[11px] font-semibold rounded-full'>
                      {session.type}
                    </span>
                    {isToday && (
                      <span className='px-2 py-0.5 bg-green-50 text-green-600 text-[11px] font-semibold rounded-full'>
                        Today
                      </span>
                    )}
                  </div>
                  <p className='text-[13px] text-[#8470A8]'>
                    {new Date(session.date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}{' '}
                    · {session.time} · {session.duration} min
                  </p>
                  {session.zoomLink && isToday && (
                    <a
                      href={session.zoomLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#7C5CBF] text-white text-[13px] font-semibold rounded-xl no-underline hover:bg-[#6A4DAD] transition-colors'
                    >
                      <LinkIcon size={13} /> Join Zoom
                    </a>
                  )}
                  {session.zoomLink && !isToday && (
                    <p className='text-[12px] text-[#B0A0CC] mt-2'>
                      Zoom link will be available on the day of the session
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
