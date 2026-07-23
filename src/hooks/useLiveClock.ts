'use client'

import { useEffect, useState } from 'react'

/**
 * Returns the current Dubai time string, updating every second.
 * Format: "FRIDAY 21:50:26"
 */
export function useLiveClock() {
  const [timeString, setTimeString] = useState('')

  useEffect(() => {
    const update = () => {
      const parts = new Intl.DateTimeFormat('en', {
        timeZone: 'Asia/Dubai',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      }).formatToParts(new Date())

      const getPart = (type: Intl.DateTimeFormatPartTypes) => (
        parts.find((part) => part.type === type)?.value ?? ''
      )

      const day = getPart('weekday').toUpperCase()
      const hours = getPart('hour')
      const minutes = getPart('minute')
      const seconds = getPart('second')
      setTimeString(`${day} ${hours}:${minutes}:${seconds}`)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return timeString
}
