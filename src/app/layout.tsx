import type { Metadata } from 'next'
import { Oswald, Space_Grotesk } from 'next/font/google'
import './globals.css'

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--next-font-oswald',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--next-font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Adam's Portfolio",
  description: 'Software engineer · AI · Data',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  )
}
