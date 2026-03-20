import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Film Contests — Every Creative AI Film Competition, One Place',
  description: 'The definitive tracker for AI film competitions, festivals, grants, and challenges. Updated daily by an AI agent. Never miss a deadline.',
  keywords: ['AI film contest', 'AI film festival', 'creative AI competition', 'Runway contest', 'generative AI filmmaking', 'AI animation competition'],
  openGraph: {
    title: 'AI Film Contests',
    description: 'Every creative AI film competition in one place. Updated daily.',
    type: 'website',
    url: 'https://aifilmcontests.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Film Contests',
    description: 'Every creative AI film competition in one place. Updated daily.',
  },
  robots: 'index, follow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#050508" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
