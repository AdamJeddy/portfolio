import type { Metadata } from 'next'
import { Oswald, Space_Grotesk, Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import GridProvider from '@/components/grid/GridProvider'
import Footer from '@/components/layout/Footer'
import Nav from '@/components/layout/Nav'

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

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Adam's Portfolio",
  description: 'This is literally my portfolio',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${spaceGrotesk.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <GridProvider>
          <Nav />
          <main id="app">{children}</main>
          <Footer />
        </GridProvider>
      </body>
    </html>
  )
}
