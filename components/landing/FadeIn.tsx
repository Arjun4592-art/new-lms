'use client'

import { useEffect, useRef, useState } from 'react'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'left' | 'right'
}

export default function FadeIn({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const transforms = {
    up: visible ? 'translateY(0)' : 'translateY(32px)',
    left: visible ? 'translateX(0)' : 'translateX(-32px)',
    right: visible ? 'translateX(0)' : 'translateX(32px)',
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: transforms[direction],
        transition: `opacity 0.75s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.75s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
