import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/site'

export const alt = 'Fortune India — Premium Electronics, Drone & RC Parts'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#141414',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', width: 36, height: 36, background: '#FF5A1F', borderRadius: 10 }} />
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: '#FF5A1F',
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            FORTUNE INDIA
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.05,
              maxWidth: 980,
            }}
          >
            Premium Electronics, Drone Parts & Industrial Components
          </div>
          <div style={{ fontSize: 30, color: '#B5B5B5', maxWidth: 900 }}>
            Premium B2B supplier of RC & Drone Parts, Sensors, Carbon Fiber,
            Development Boards & Industrial Supplies. Pan-India delivery.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            fontSize: 26,
            color: '#7A7A7A',
          }}
        >
          <div style={{ display: 'flex', width: 14, height: 14, background: '#FF5A1F', borderRadius: 7 }} />
          {SITE.url.replace(/^https?:\/\//, '')}
        </div>
      </div>
    ),
    { ...size },
  )
}
