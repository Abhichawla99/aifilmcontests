import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AI Film Contests — Every Creative AI Film Competition, One Place'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#FBFAF8',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #3730a3 0%, #5b21b6 100%)',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 12 12">
              <path d="M2.5 1.2L10 6L2.5 10.8V1.2Z" fill="white" />
            </svg>
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, color: '#3E3A33', display: 'flex' }}>
            AI Film Contests
          </div>
        </div>

        <div
          style={{
            marginTop: 56,
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.15,
            color: '#3E3A33',
            maxWidth: 980,
            display: 'flex',
          }}
        >
          Every AI film contest, in one place.
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            color: '#4F46E5',
            fontWeight: 500,
            display: 'flex',
          }}
        >
          Updated daily · Never miss a deadline
        </div>
      </div>
    ),
    { ...size }
  )
}
