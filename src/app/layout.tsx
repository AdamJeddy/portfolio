import type { Metadata } from 'next'
import { Inter_Tight, Space_Grotesk, Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import GridProvider from '@/components/grid/GridProvider'
import Footer from '@/components/layout/Footer'
import Nav from '@/components/layout/Nav'
import SignalSweep from '@/components/SignalSweep'
import {
  GA_MEASUREMENT_ID,
  PERSON_NAME,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site'

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

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-studio-page',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${PERSON_NAME} — bruh.ae`,
    template: `%s — ${PERSON_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: PERSON_NAME, url: `${SITE_URL}/about` }],
  creator: PERSON_NAME,
  publisher: SITE_NAME,
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistSans.variable} ${geistMono.variable} ${interTight.variable}`}
    >
      <body>
        {process.env.NODE_ENV === 'production' && (
          <>
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
          </>
        )}
        <GridProvider>
          <Nav />
          <SignalSweep />
          <main id="app">{children}</main>
          <Footer />
        </GridProvider>
      </body>
    </html>
  )
}
