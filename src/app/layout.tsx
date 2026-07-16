import type { Metadata } from 'next'
import { Oswald, Space_Grotesk, Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import GridProvider from '@/components/grid/GridProvider'
import Footer from '@/components/layout/Footer'
import Nav from '@/components/layout/Nav'
import {
  GA_MEASUREMENT_ID,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  X_HANDLE,
} from '@/lib/site'

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
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  creator: 'Adam',
  publisher: SITE_NAME,
  twitter: {
    creator: X_HANDLE,
  },
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <GridProvider>
          <Nav />
          <main id="app">{children}</main>
          <Footer />
        </GridProvider>
      </body>
    </html>
  )
}
