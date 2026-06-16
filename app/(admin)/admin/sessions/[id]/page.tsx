'use client'

import { use, useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import SessionForm from '@/components/admin/SessionForm'

export default function EditSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const snap = await getDoc(doc(db, 'sessions', id))
      if (snap.exists()) setSession({ id: snap.id, ...snap.data() })
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

  if (!session) {
    return (
      <p className='text-center text-primary-muted py-12'>Session not found.</p>
    )
  }

  return (
    <div className='space-y-6 max-w-3xl mx-auto px-4 sm:px-6'>
      <div className='animate-[fadeInDown_0.4s_ease_both]'>
        <p className='text-[12px] text-primary-muted font-semibold uppercase tracking-widest mb-1'>
          Admin · Sessions
        </p>
        <h1 className='font-serif text-2xl sm:text-[26px] font-bold text-primary-dark'>
          Edit Session
        </h1>
      </div>
      <div className='animate-[fadeInUp_0.4s_ease_both]'>
        <SessionForm initial={session} sessionId={session.id} />
      </div>
    </div>
  )
}
