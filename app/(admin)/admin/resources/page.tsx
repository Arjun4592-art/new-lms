'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { FileIcon, ArrowRightIcon, DownloadIcon } from '@/components/ui/Icons'

interface Resource {
  id: string
  title: string
  type: string
  size: string
  url: string
  visibleTo: string
  courseId: string
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      try {
        const snap = await getDocs(collection(db, 'resources'))
        setResources(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Resource),
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this resource?')) return
    setDeleting(id)
    try {
      await deleteDoc(doc(db, 'resources', id))
      setResources((prev) => prev.filter((r) => r.id !== id))
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
            Resources
          </h1>
          <p className='text-[13px] text-[#8470A8]'>
            {resources.length} total resources
          </p>
        </div>
        <Link
          href='/admin/resources/new'
          className='flex items-center gap-2 px-5 py-2.5 bg-[#7C5CBF] text-white font-bold rounded-xl no-underline hover:bg-[#6A4DAD] transition-colors text-[13.5px]'
        >
          + Add Resource
        </Link>
      </div>

      <div className='bg-white border border-purple-100 rounded-2xl overflow-hidden'>
        <div className='px-6 py-3 border-b border-purple-100 bg-[#F9F5FF] grid grid-cols-12 gap-4'>
          <p className='col-span-4 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Title
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Type
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Size
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Visible To
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-[#8470A8] uppercase tracking-wider'>
            Actions
          </p>
        </div>

        {resources.length === 0 ? (
          <div className='px-6 py-12 text-center'>
            <FileIcon size={32} className='text-[#C084F5] mx-auto mb-3' />
            <p className='text-[15px] font-semibold text-[#2D1B5E] mb-1'>
              No resources yet
            </p>
            <Link
              href='/admin/resources/new'
              className='inline-flex items-center gap-2 px-5 py-2.5 bg-[#7C5CBF] text-white font-bold rounded-xl no-underline hover:bg-[#6A4DAD] transition-colors text-[13.5px] mt-3'
            >
              Add Resource <ArrowRightIcon size={14} />
            </Link>
          </div>
        ) : (
          <div className='divide-y divide-purple-50'>
            {resources.map((r) => (
              <div
                key={r.id}
                className='px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-[#FAFAFE]'
              >
                <div className='col-span-4 flex items-center gap-3'>
                  <div className='w-8 h-8 bg-[#F3EEFF] rounded-lg flex items-center justify-center shrink-0'>
                    <DownloadIcon size={14} className='text-[#7C5CBF]' />
                  </div>
                  <p className='text-[13.5px] font-semibold text-[#2D1B5E] truncate'>
                    {r.title}
                  </p>
                </div>
                <p className='col-span-2 text-[13px] text-[#8470A8]'>
                  {r.type}
                </p>
                <p className='col-span-2 text-[13px] text-[#8470A8]'>
                  {r.size}
                </p>
                <p className='col-span-2 text-[13px] text-[#8470A8] capitalize'>
                  {r.visibleTo === 'all' ? 'All students' : 'Course only'}
                </p>
                <div className='col-span-2 flex items-center gap-2'>
                  <Link
                    href={`/admin/resources/${r.id}`}
                    className='px-3 py-1.5 text-[12px] font-semibold text-[#7C5CBF] bg-[#F3EEFF] hover:bg-[#E8DEFF] rounded-lg no-underline transition-colors'
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={deleting === r.id}
                    className='px-3 py-1.5 text-[12px] font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50'
                  >
                    {deleting === r.id ? '...' : 'Delete'}
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
