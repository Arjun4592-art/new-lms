'use client'

import { useEffect, useState } from 'react'

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function useCountdown(daysFromNow = 3): CountdownTime {
  const [target] = useState(() => {
    const t = new Date()
    t.setDate(t.getDate() + daysFromNow)
    return t.getTime()
  })

  const [time, setTime] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    function calc() {
      const diff = target - Date.now()
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [target])

  return time
}

export const pad = (n: number) => String(n).padStart(2, '0')
