'use client'

import { use, useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import ResourceForm from '@/components/admin/ResourceForm'

export default function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [resource, setResource] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const snap = await getDoc(doc(db, 'resources', id))
      if (snap.exists()) setResource({ id: snap.id, ...snap.data() })
      setLoading(false)
    }
    fetch()
  }, [id])

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse max-w-3xl mx-auto px-4 sm:px-6'>
        <div className='h-10 w-48 bg-surface rounded-lg' />
        <div className='h-96 bg-surface rounded-2xl' />
      </div>
    )
  }

  if (!resource) {
    return (
      <p className='text-center text-primary-muted py-12'>
        Resource not found.
      </p>
    )
  }

  return (
    <div className='space-y-6 max-w-3xl mx-auto px-4 sm:px-6'>
      <div className='animate-[fadeInDown_0.4s_ease_both]'>
        <p className='text-[12px] text-primary-muted font-semibold uppercase tracking-widest mb-1'>
          Admin · Resources
        </p>
        <h1 className='font-serif text-2xl sm:text-[26px] font-bold text-primary-dark'>
          Edit Resource
        </h1>
      </div>
      <div className='animate-[fadeInUp_0.4s_ease_both]'>
        <ResourceForm initial={resource} resourceId={resource.id} />
      </div>
    </div>
  )
}
