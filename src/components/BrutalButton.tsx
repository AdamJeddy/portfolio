import Link from 'next/link'

interface BrutalButtonProps {
  href?: string
  children: React.ReactNode
  variant?: 'default' | 'red'
  onClick?: () => void
  type?: 'button' | 'submit'
}

export default function BrutalButton({
  href,
  children,
  variant = 'default',
  onClick,
  type = 'button',
}: BrutalButtonProps) {
  const cls = `brutal-btn${variant === 'red' ? ' brutal-btn-red' : ''}`

  if (href) {
    return <Link href={href} className={cls}>{children}</Link>
  }

  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  )
}
