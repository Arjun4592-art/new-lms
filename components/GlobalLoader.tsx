'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import RadiantRiseLoader from './RadiantRiseLoader'

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 3500)
    return () => clearTimeout(t)
  }, [pathname])

  if (!loading) return null

  return (
    <div
      className='fixed inset-0 z-9999 flex items-center justify-center'
      style={{
        background: 'linear-gradient(160deg, #F9F5EE 0%, #EDE5D8 100%)',
      }}
    >
      <div className='w-full max-w-lg px-6'>
        <RadiantRiseLoader />
      </div>
    </div>
  )
}
