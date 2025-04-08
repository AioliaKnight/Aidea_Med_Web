import { ImageResponse } from 'next/og'
import { caseStudies } from '@/data/cases'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }) {
  const id = params.id
  const caseStudy = caseStudies.find(c => c.id === id) || {
    name: '案例分享',
    category: '數位行銷',
    description: '牙醫診所數位行銷成功案例'
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '120px',
            backgroundColor: '#f0f9ff',
            borderRadius: '16px',
            color: '#0ea5e9',
            fontSize: 32,
            fontWeight: 600,
            marginBottom: 32,
          }}
        >
          {caseStudy.category}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            marginBottom: 24,
            color: '#0f172a',
            textAlign: 'center',
          }}
        >
          {caseStudy.name}
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#64748b',
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          {caseStudy.description.substring(0, 80)}
          {caseStudy.description.length > 80 ? '...' : ''}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 48,
          }}
        >
          <div
            style={{
              fontSize: 24,
              backgroundColor: '#0ea5e9',
              color: 'white',
              padding: '12px 32px',
              borderRadius: '50px',
            }}
          >
            查看詳細案例
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
} 