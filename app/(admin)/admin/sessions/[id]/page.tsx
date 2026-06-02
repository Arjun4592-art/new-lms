'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
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
      <div className='space-y-4 animate-pulse max-w-3xl mx-auto'>
        <div className='h-10 w-48 bg-purple-100 rounded' />
        <div className='h-96 bg-purple-100 rounded-2xl' />
      </div>
    )
  }

  if (!session) {
    return (
      <p className='text-center text-[#8470A8] py-12'>Session not found.</p>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <p className='text-[12px] text-[#A67DD4] font-semibold uppercase tracking-widest mb-1'>
          Admin · Sessions
        </p>
        <h1 className='font-serif text-[26px] font-bold text-[#2D1B5E]'>
          Edit Session
        </h1>
      </div>
      <SessionForm initial={session} sessionId={session.id} />
    </div>
  )
}
