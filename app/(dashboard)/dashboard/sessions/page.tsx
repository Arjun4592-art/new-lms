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
    if (!user?.uid) return
    async function fetchSessions() {
      try {
        const enrollSnap = await getDocs(
          query(
            collection(db, 'enrollments'),
            where('userId', '==', user!.uid),
          ),
        )
        const enrolledCourseIds = enrollSnap.docs.map(
          (d) => d.data().courseId as string,
        )

        const allSessionsSnap = await getDocs(
          query(collection(db, 'sessions'), where('visibleTo', '==', 'all')),
        )
        const allSessions = allSessionsSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as Session,
        )

        let enrolledSessions: Session[] = []
        if (enrolledCourseIds.length > 0) {
          const enrolledSnap = await getDocs(
            query(
              collection(db, 'sessions'),
              where('courseId', 'in', enrolledCourseIds),
            ),
          )
          enrolledSessions = enrolledSnap.docs.map(
            (d) => ({ id: d.id, ...d.data() }) as Session,
          )
        }

        const seen = new Set<string>()
        const merged = [...allSessions, ...enrolledSessions].filter((s) => {
          if (seen.has(s.id)) return false
          seen.add(s.id)
          return true
        })

        setSessions(
          merged
            .filter((s) => !s.isRecorded)
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            ),
        )
      } catch (err) {
        console.error('Sessions fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [user?.uid])

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse max-w-3xl mx-auto'>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className='h-24 rounded-xl'
            style={{ backgroundColor: 'var(--color-surface)' }}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <style>{`
        .sess-card {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; padding: 20px;
          display: flex; align-items: flex-start; gap: 16px;
        }
        .sess-icon {
          width: 48px; height: 48px; border-radius: 10px; flex-shrink: 0;
          background-color: var(--color-primary);
          display: flex; align-items: center; justify-content: center;
        }
        .sess-type-badge {
          padding: 2px 8px; border-radius: 9999px;
          font-size: 11px; font-weight: 600;
          background-color: var(--color-surface);
          color: var(--color-primary);
          border: 1px solid var(--color-surface-border);
        }
        .sess-today-badge {
          padding: 2px 8px; border-radius: 9999px;
          font-size: 11px; font-weight: 600;
          background-color: #DCFCE7; color: #16A34A;
        }
        .sess-join-btn {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 12px; padding: 8px 16px;
          background-color: var(--color-primary);
          color: var(--color-bg);
          font-size: 13px; font-weight: 600;
          border-radius: 8px; text-decoration: none;
          transition: background-color 0.2s;
        }
        .sess-join-btn:hover { background-color: var(--color-primary-hover); }
        .sess-empty {
          background-color: var(--color-surface);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; padding: 40px; text-align: center;
        }
      `}</style>

      <div className='space-y-6 max-w-3xl mx-auto'>
        {/* Header */}
        <div>
          <p
            className='text-[11px] font-semibold uppercase tracking-widest mb-1'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            Dashboard
          </p>
          <h1
            className='font-serif text-[26px] font-medium'
            style={{ color: 'var(--color-text)' }}
          >
            Upcoming Sessions
          </h1>
          <p
            className='text-[13px] mt-1'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            {sessions.length} upcoming session{sessions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Empty state */}
        {sessions.length === 0 ? (
          <div className='sess-empty'>
            <ClockIcon
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
              No upcoming sessions
            </p>
            <p
              className='text-[13px] font-light'
              style={{ color: 'var(--color-primary-muted)' }}
            >
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
                <div key={session.id} className='sess-card'>
                  <div className='sess-icon'>
                    <ClockIcon size={20} style={{ color: 'var(--color-bg)' }} />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1 flex-wrap'>
                      <p
                        className='text-[15px] font-semibold'
                        style={{ color: 'var(--color-text)' }}
                      >
                        {session.title}
                      </p>
                      <span className='sess-type-badge'>{session.type}</span>
                      {isToday && (
                        <span className='sess-today-badge'>Today</span>
                      )}
                    </div>
                    <p
                      className='text-[13px]'
                      style={{ color: 'var(--color-primary-muted)' }}
                    >
                      {new Date(session.date).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}{' '}
                      · {session.time} · {session.duration} min
                    </p>
                    {session.zoomLink && isToday ? (
                      <a
                        href={session.zoomLink}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='sess-join-btn'
                      >
                        <LinkIcon size={13} /> Join Zoom
                      </a>
                    ) : session.zoomLink && !isToday ? (
                      <p
                        className='text-[12px] mt-2'
                        style={{ color: 'var(--color-primary-muted)' }}
                      >
                        Zoom link will be available on the day of the session
                      </p>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
