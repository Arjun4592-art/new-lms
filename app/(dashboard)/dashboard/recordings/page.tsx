'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/context/AuthContext'
import { PlayIcon, ClockIcon } from '@/components/ui/Icons'

interface Session {
  id: string
  title: string
  date: string
  type: string
  recordingUrl: string
  isRecorded: boolean
  visibleTo: string
  courseId: string
  duration: number
  thumbnail: string
}

function getYouTubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  return match?.[1] ?? null
}

export default function RecordingsPage() {
  const { user } = useAuth()
  const [recordings, setRecordings] = useState<Session[]>([])
  const [selected, setSelected] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function fetch() {
      try {
        const snap = await getDocs(collection(db, 'sessions'))
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Session)

        const filtered = all.filter(
          (s) =>
            s.isRecorded &&
            s.recordingUrl &&
            (s.visibleTo === 'all' ||
              user!.enrolledCourses?.includes(s.courseId)),
        )

        setRecordings(
          filtered.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        )
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
      <div className='space-y-4 animate-pulse max-w-5xl mx-auto'>
        <div className='h-10 w-48 bg-purple-100 rounded' />
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='h-52 bg-purple-100 rounded-2xl' />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-5xl mx-auto'>
      <div>
        <p className='text-[12px] text-[#A67DD4] font-semibold uppercase tracking-widest mb-1'>
          Dashboard
        </p>
        <h1 className='font-serif text-[26px] font-bold text-[#2D1B5E]'>
          Recorded Sessions
        </h1>
        <p className='text-[13px] text-[#8470A8] mt-1'>
          {recordings.length} recording{recordings.length !== 1 ? 's' : ''}{' '}
          available
        </p>
      </div>

      {/* Video player */}
      {selected && (
        <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden'>
          <div className='aspect-video bg-black'>
            {getYouTubeId(selected.recordingUrl) ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(selected.recordingUrl)}`}
                className='w-full h-full'
                allowFullScreen
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              />
            ) : (
              <video
                src={selected.recordingUrl}
                controls
                className='w-full h-full'
              />
            )}
          </div>
          <div className='p-5'>
            <h2 className='font-serif text-[18px] font-bold text-[#2D1B5E]'>
              {selected.title}
            </h2>
            <p className='text-[13px] text-[#8470A8] mt-1'>
              {new Date(selected.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}{' '}
              · {selected.duration} min · {selected.type}
            </p>
          </div>
        </div>
      )}

      {recordings.length === 0 ? (
        <div className='bg-[#F9F5FF] border border-purple-100 rounded-2xl p-10 text-center'>
          <PlayIcon size={32} className='text-[#C084F5] mx-auto mb-3' />
          <p className='text-[15px] font-semibold text-[#2D1B5E] mb-1'>
            No recordings yet
          </p>
          <p className='text-[13px] text-[#8470A8]'>
            Recordings will appear here after live sessions.
          </p>
        </div>
      ) : (
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {recordings.map((r) => {
            const ytId = getYouTubeId(r.recordingUrl)
            const thumb =
              r.thumbnail ||
              (ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null)

            return (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className={`text-left bg-white border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-purple-100/50 transition-all group ${
                  selected?.id === r.id
                    ? 'border-[#7C5CBF] ring-2 ring-[#7C5CBF]/20'
                    : 'border-purple-100'
                }`}
              >
                {/* Thumbnail */}
                <div className='relative h-40 bg-[#F3EEFF] flex items-center justify-center overflow-hidden'>
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={r.title}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <PlayIcon size={32} className='text-[#C084F5]' />
                  )}
                  <div className='absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                    <div className='w-12 h-12 rounded-full bg-white/90 flex items-center justify-center'>
                      <PlayIcon size={18} className='text-[#7C5CBF]' />
                    </div>
                  </div>
                  <span className='absolute bottom-2 right-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded-full'>
                    {r.duration} min
                  </span>
                </div>

                {/* Info */}
                <div className='p-4'>
                  <p className='text-[13.5px] font-bold text-[#2D1B5E] line-clamp-2 group-hover:text-[#7C5CBF] transition-colors'>
                    {r.title}
                  </p>
                  <div className='flex items-center gap-2 mt-1.5'>
                    <ClockIcon size={12} className='text-[#A67DD4]' />
                    <p className='text-[12px] text-[#8470A8]'>
                      {new Date(r.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <span className='px-2 py-0.5 bg-[#F3EEFF] text-[#7C5CBF] text-[10px] font-semibold rounded-full'>
                      {r.type}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
