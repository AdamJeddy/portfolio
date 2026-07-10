'use client'

import { useEffect, useState } from 'react'

/**
 * Returns the current time string, updating every second.
 * Format: "FRIDAY 21:50:26"
 */
export function useLiveClock() {
  const [timeString, setTimeString] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const days = [
        'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY',
        'THURSDAY', 'FRIDAY', 'SATURDAY',
      ]
      const day = days[now.getDay()]
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setTimeString(`${day} ${hours}:${minutes}:${seconds}`)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return timeString
}
