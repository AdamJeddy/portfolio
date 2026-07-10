'use client'

import { useReveal } from '@/hooks/useReveal'

interface RevealProps {
  children: React.ReactNode
  type?: 'fade' | 'slide-up'
  delay?: number
  className?: string
}

/**
 * Wraps content in a scroll-triggered reveal animation.
 * Use `data-reveal-child` on children that should stagger in.
 */
export default function Reveal({
  children,
  type = 'fade',
  delay = 100,
  className,
}: RevealProps) {
  const { ref, revealed, ...dataAttrs } = useReveal({ type, delay })

  return (
    <div
      ref={ref}
      className={`${className ?? ''} ${revealed ? 'revealed' : ''}`.trim()}
      data-reveal={dataAttrs['data-reveal']}
      data-init={dataAttrs['data-init']}
    >
      {children}
    </div>
  )
}
