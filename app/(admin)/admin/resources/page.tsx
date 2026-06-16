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
            Resources
          </h1>
          <p className='text-[13px] text-primary-muted mt-0.5'>
            {resources.length} total resources
          </p>
        </div>
        <Link
          href='/admin/resources/new'
          className='flex items-center gap-2 px-5 py-2.5 bg-primary text-[#f5f0e8] font-semibold rounded-xl no-underline hover:bg-primary-hover transition-colors duration-200 text-[13.5px] w-fit'
        >
          + Add Resource
        </Link>
      </div>

      {/* Table */}
      <div className='bg-[#f5f0e8] border border-surface-border rounded-2xl overflow-hidden animate-[fadeInUp_0.4s_ease_both]'>
        {/* Table Header — hidden on mobile */}
        <div className='hidden sm:grid px-6 py-3 border-b border-surface-border bg-surface grid-cols-12 gap-4'>
          <p className='col-span-4 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Title
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Type
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Size
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Visible To
          </p>
          <p className='col-span-2 text-[12px] font-semibold text-primary-muted uppercase tracking-wider'>
            Actions
          </p>
        </div>

        {resources.length === 0 ? (
          <div className='px-6 py-12 text-center'>
            <FileIcon size={32} className='text-primary-muted mx-auto mb-3' />
            <p className='text-[15px] font-semibold text-primary-dark mb-1'>
              No resources yet
            </p>
            <Link
              href='/admin/resources/new'
              className='inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-[#f5f0e8] font-semibold rounded-xl no-underline hover:bg-primary-hover transition-colors duration-200 text-[13.5px] mt-3'
            >
              Add Resource <ArrowRightIcon size={14} />
            </Link>
          </div>
        ) : (
          <div className='divide-y divide-surface-border'>
            {resources.map((r, i) => (
              <div
                key={r.id}
                style={{ animationDelay: `${i * 60}ms` }}
                className='animate-[fadeInUp_0.35s_ease_both] px-4 sm:px-6 py-4 flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 items-start sm:items-center hover:bg-surface transition-colors duration-150'
              >
                {/* Title */}
                <div className='sm:col-span-4 flex items-center gap-3 w-full'>
                  <div className='w-8 h-8 bg-surface rounded-lg flex items-center justify-center shrink-0 border border-surface-border'>
                    <DownloadIcon size={14} className='text-primary' />
                  </div>
                  <p className='text-[13.5px] font-semibold text-primary-dark truncate'>
                    {r.title}
                  </p>
                </div>

                {/* Mobile: inline meta */}
                <div className='flex flex-wrap gap-x-4 gap-y-1 sm:contents'>
                  <p className='sm:col-span-2 text-[13px] text-primary-muted'>
                    <span className='sm:hidden text-[11px] uppercase tracking-wide text-primary-muted font-semibold mr-1'>
                      Type:{' '}
                    </span>
                    {r.type}
                  </p>
                  <p className='sm:col-span-2 text-[13px] text-primary-muted'>
                    <span className='sm:hidden text-[11px] uppercase tracking-wide text-primary-muted font-semibold mr-1'>
                      Size:{' '}
                    </span>
                    {r.size}
                  </p>
                  <p className='sm:col-span-2 text-[13px] text-primary-muted capitalize'>
                    <span className='sm:hidden text-[11px] uppercase tracking-wide text-primary-muted font-semibold mr-1'>
                      Visible:{' '}
                    </span>
                    {r.visibleTo === 'all' ? 'All students' : 'Course only'}
                  </p>
                </div>

                {/* Actions */}
                <div className='sm:col-span-2 flex items-center gap-2'>
                  <Link
                    href={`/admin/resources/${r.id}`}
                    className='px-3 py-1.5 text-[12px] font-semibold text-primary bg-surface hover:bg-surface-hover rounded-lg no-underline transition-colors duration-150 border border-surface-border'
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={deleting === r.id}
                    className='px-3 py-1.5 text-[12px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-150 disabled:opacity-50'
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
