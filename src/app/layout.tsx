import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Film Contests — All Creative AI Film Competitions in One Place',
  description: 'Discover every AI film competition, festival, grant, and challenge. Subscribe to get instant alerts for new contests in the creative AI filmmaking space.',
  keywords: ['AI film contest', 'AI film festival', 'creative AI competition', 'Runway contest', 'Sora competition', 'AI filmmaking'],
  openGraph: {
    title: 'AI Film Contests',
    description: 'All creative AI film competitions in one place. Never miss a deadline.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
