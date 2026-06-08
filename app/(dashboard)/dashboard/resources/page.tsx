'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/context/AuthContext'
import {
  DownloadIcon,
  FileIcon,
  FileTextIcon,
  VideoIcon,
} from '@/components/ui/Icons'

interface Resource {
  id: string
  title: string
  type: string
  size: string
  url: string
  visibleTo: string
  courseId: string
}

function getIcon(type: string) {
  const style = { color: 'var(--color-primary)' }
  switch (type) {
    case 'Video':
      return <VideoIcon size={16} style={style} />
    case 'PDF':
      return <FileTextIcon size={16} style={style} />
    default:
      return <FileIcon size={16} style={style} />
  }
}

export default function ResourcesPage() {
  const { user } = useAuth()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) return
    async function fetchResources() {
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

        const publicSnap = await getDocs(
          query(collection(db, 'resources'), where('visibleTo', '==', 'all')),
        )
        const publicResources = publicSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as Resource,
        )

        let enrolledResources: Resource[] = []
        if (enrolledCourseIds.length > 0) {
          const enrolledSnap = await getDocs(
            query(
              collection(db, 'resources'),
              where('courseId', 'in', enrolledCourseIds),
            ),
          )
          enrolledResources = enrolledSnap.docs.map(
            (d) => ({ id: d.id, ...d.data() }) as Resource,
          )
        }

        const seen = new Set<string>()
        const merged = [...publicResources, ...enrolledResources].filter(
          (r) => {
            if (seen.has(r.id)) return false
            seen.add(r.id)
            return true
          },
        )
        setResources(merged)
      } catch (err) {
        console.error('Resources fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchResources()
  }, [user?.uid])

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse max-w-4xl mx-auto'>
        <div
          className='h-10 w-48 rounded'
          style={{ backgroundColor: 'var(--color-surface)' }}
        />
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className='h-16 rounded-xl'
            style={{ backgroundColor: 'var(--color-surface)' }}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <style>{`
        .res-list {
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; overflow: hidden;
        }
        .res-row {
          display: flex; align-items: center; gap: 16px;
          padding: 14px 24px;
          border-bottom: 1px solid var(--color-surface-border);
          transition: background-color 0.15s;
        }
        .res-row:last-child { border-bottom: none; }
        .res-row:hover { background-color: var(--color-surface); }
        .res-icon {
          width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
          background-color: var(--color-surface);
          display: flex; align-items: center; justify-content: center;
        }
        .res-dl-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 8px;
          font-size: 13px; font-weight: 600; text-decoration: none;
          flex-shrink: 0;
          background-color: var(--color-surface);
          color: var(--color-primary);
          border: 1px solid var(--color-surface-border);
          transition: background-color 0.2s, color 0.2s, border-color 0.2s;
        }
        .res-dl-btn:hover {
          background-color: var(--color-primary);
          color: var(--color-bg);
          border-color: var(--color-primary);
        }
        .res-empty {
          background-color: var(--color-surface);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; padding: 40px; text-align: center;
        }
        .res-footer {
          background-color: var(--color-surface);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px; padding: 18px; text-align: center;
        }
      `}</style>

      <div className='space-y-6 max-w-4xl mx-auto'>
        {/* Header */}
        <div>
          <p
            className='text-[11px] font-semibold uppercase tracking-widest mb-1'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            Student Portal
          </p>
          <h1
            className='font-serif text-[26px] sm:text-[30px] font-medium'
            style={{ color: 'var(--color-text)' }}
          >
            My Resources
          </h1>
          <p
            className='text-[14px] mt-1'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            {resources.length} resources available
          </p>
        </div>

        {/* Empty state */}
        {resources.length === 0 ? (
          <div className='res-empty'>
            <DownloadIcon
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
              No resources yet
            </p>
            <p
              className='text-[13px] font-light'
              style={{ color: 'var(--color-primary-muted)' }}
            >
              Resources will appear here once you enroll in a course.
            </p>
          </div>
        ) : (
          <div className='res-list'>
            {resources.map((r) => (
              <div key={r.id} className='res-row'>
                <div className='res-icon'>{getIcon(r.type)}</div>
                <div className='flex-1 min-w-0'>
                  <p
                    className='text-[14px] font-semibold truncate'
                    style={{ color: 'var(--color-text)' }}
                  >
                    {r.title}
                  </p>
                  <p
                    className='text-[12px]'
                    style={{ color: 'var(--color-primary-muted)' }}
                  >
                    {r.type} · {r.size}
                  </p>
                </div>
                <a
                  href={r.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='res-dl-btn'
                >
                  <DownloadIcon size={13} /> Download
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className='res-footer'>
          <p
            className='text-[14px] font-light leading-relaxed'
            style={{ color: 'var(--color-primary)' }}
          >
            🌿 New resources are added regularly. If you need something
            specific, reach out to Masuma directly.
          </p>
        </div>
      </div>
    </>
  )
}
