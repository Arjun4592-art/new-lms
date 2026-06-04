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
  switch (type) {
    case 'Video':
      return <VideoIcon size={16} className='text-[#7C5CBF]' />
    case 'PDF':
      return <FileTextIcon size={16} className='text-[#7C5CBF]' />
    default:
      return <FileIcon size={16} className='text-[#7C5CBF]' />
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
        // Step 1 — get enrolled courseIds
        const enrollSnap = await getDocs(
          query(
            collection(db, 'enrollments'),
            where('userId', '==', user!.uid),
          ),
        )
        const enrolledCourseIds = enrollSnap.docs.map(
          (d) => d.data().courseId as string,
        )

        // Step 2 — fetch public resources
        const publicSnap = await getDocs(
          query(collection(db, 'resources'), where('visibleTo', '==', 'all')),
        )
        const publicResources = publicSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as Resource,
        )

        // Step 3 — fetch enrolled-course resources
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

        // Step 4 — merge and deduplicate
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
        <div className='h-10 w-48 bg-purple-100 rounded' />
        {[...Array(4)].map((_, i) => (
          <div key={i} className='h-16 bg-purple-100 rounded-2xl' />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-4xl mx-auto'>
      <div>
        <p className='text-[12px] text-[#A67DD4] font-semibold uppercase tracking-widest mb-1'>
          Student Portal
        </p>
        <h1 className='font-serif text-[26px] sm:text-[30px] font-bold text-[#2D1B5E]'>
          My Resources
        </h1>
        <p className='text-[14px] text-[#8470A8] mt-1'>
          {resources.length} resources available
        </p>
      </div>

      {resources.length === 0 ? (
        <div className='bg-[#F9F5FF] border border-purple-100 rounded-2xl p-10 text-center'>
          <DownloadIcon size={32} className='text-[#C084F5] mx-auto mb-3' />
          <p className='text-[15px] font-semibold text-[#2D1B5E] mb-1'>
            No resources yet
          </p>
          <p className='text-[13px] text-[#8470A8]'>
            Resources will appear here once you enroll in a course.
          </p>
        </div>
      ) : (
        <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden'>
          <div className='divide-y divide-purple-50'>
            {resources.map((r) => (
              <div
                key={r.id}
                className='flex items-center gap-4 px-6 py-4 hover:bg-[#F9F5FF] transition-colors group'
              >
                <div className='w-10 h-10 bg-[#F3EEFF] rounded-xl flex items-center justify-center shrink-0'>
                  {getIcon(r.type)}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-[14px] font-semibold text-[#2D1B5E] truncate'>
                    {r.title}
                  </p>
                  <p className='text-[12px] text-[#8470A8]'>
                    {r.type} · {r.size}
                  </p>
                </div>
                <a
                  href={r.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 px-4 py-2 bg-[#F3EEFF] hover:bg-[#7C5CBF] text-[#7C5CBF] hover:text-white rounded-xl text-[13px] font-semibold transition-all no-underline shrink-0'
                >
                  <DownloadIcon size={14} /> Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='bg-[#F9F5FF] border border-purple-100 rounded-2xl p-5 text-center'>
        <p className='text-[14px] text-[#6B5B8B] leading-relaxed'>
          🌸 New resources are added regularly. If you need something specific,
          reach out to Masuma directly.
        </p>
      </div>
    </div>
  )
}
