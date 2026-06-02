'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
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
      <div className='space-y-4 animate-pulse max-w-3xl mx-auto'>
        <div className='h-10 w-48 bg-purple-100 rounded' />
        <div className='h-96 bg-purple-100 rounded-2xl' />
      </div>
    )
  }

  if (!resource) {
    return (
      <p className='text-center text-[#8470A8] py-12'>Resource not found.</p>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-[12px] text-[#A67DD4] font-semibold uppercase tracking-widest mb-1'>
          Admin · Resources
        </p>
        <h1 className='font-serif text-[26px] font-bold text-[#2D1B5E]'>
          Edit Resource
        </h1>
      </div>
      <ResourceForm initial={resource} resourceId={resource.id} />
    </div>
  )
}
