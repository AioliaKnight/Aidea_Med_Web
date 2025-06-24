import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 獲取參數
    const title = searchParams.get('title') ?? 'Aidea:Med 醫療行銷顧問'
    const subtitle = searchParams.get('subtitle') ?? '為醫療診所注入數位活力，專業行銷解決方案'
    const type = searchParams.get('type') ?? 'general'
    const theme = searchParams.get('theme') ?? 'light'
    
    // 根據類型選擇背景色和風格
    const getThemeColors = (type: string, theme: string) => {
      const colors = {
        general: {
          light: { bg: '#ffffff', primary: '#e62733', secondary: '#2d3748', accent: '#f7fafc' },
          dark: { bg: '#1a202c', primary: '#e62733', secondary: '#e2e8f0', accent: '#2d3748' }
        },
        blog: {
          light: { bg: '#f8fafc', primary: '#3182ce', secondary: '#2d3748', accent: '#e2e8f0' },
          dark: { bg: '#2d3748', primary: '#63b3ed', secondary: '#e2e8f0', accent: '#4a5568' }
        },
        service: {
          light: { bg: '#f0fff4', primary: '#38a169', secondary: '#2d3748', accent: '#c6f6d5' },
          dark: { bg: '#1a202c', primary: '#68d391', secondary: '#e2e8f0', accent: '#2d3748' }
        },
        team: {
          light: { bg: '#fffaf0', primary: '#d69e2e', secondary: '#2d3748', accent: '#fbd38d' },
          dark: { bg: '#2d3748', primary: '#f6e05e', secondary: '#e2e8f0', accent: '#4a5568' }
        }
      }
      
      return colors[type as keyof typeof colors]?.[theme as keyof typeof colors.general] || colors.general.light
    }
    
    const themeColors = getThemeColors(type, theme)
    
    // 生成 SVG 圖案作為背景
    const backgroundPattern = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${themeColors.accent}" stroke-width="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    `
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: themeColors.bg,
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(backgroundPattern)}")`,
            position: 'relative',
                         fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* 漸層背景覆蓋 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${themeColors.bg}E6, ${themeColors.accent}80)`,
              zIndex: 1,
            }}
          />
          
          {/* 主要內容容器 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              maxWidth: '1000px',
              textAlign: 'center',
              zIndex: 2,
              position: 'relative',
            }}
          >
            {/* Logo 區域 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              {/* 簡化的 Logo - 使用文字版本 */}
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: themeColors.primary,
                  letterSpacing: '-0.5px',
                }}
              >
                Aidea:Med
              </div>
            </div>
            
            {/* 主標題 */}
            <h1
              style={{
                fontSize: title.length > 40 ? '48px' : '64px',
                fontWeight: 'bold',
                color: themeColors.secondary,
                lineHeight: '1.2',
                marginBottom: '20px',
                textAlign: 'center',
                maxWidth: '900px',
              }}
            >
              {title}
            </h1>
            
            {/* 副標題 */}
            {subtitle && (
              <p
                style={{
                  fontSize: '24px',
                  color: themeColors.secondary,
                  opacity: 0.8,
                  lineHeight: '1.4',
                  marginBottom: '40px',
                  maxWidth: '800px',
                }}
              >
                {subtitle}
              </p>
            )}
            
            {/* 類型標籤 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: themeColors.primary,
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '18px',
                fontWeight: '600',
                marginTop: '20px',
              }}
            >
              {type === 'blog' && '📖 行銷新知'}
              {type === 'service' && '🏥 專業服務'}
              {type === 'team' && '👥 專業團隊'}
              {type === 'general' && '🚀 醫療行銷顧問'}
            </div>
          </div>
          
          {/* 底部品牌資訊 */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '80px',
              right: '80px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '16px',
              color: themeColors.secondary,
              opacity: 0.7,
              zIndex: 2,
            }}
          >
            <div>台北市大安區敦化南路二段99號13樓</div>
            <div>www.aideamed.com</div>
          </div>
          
          {/* 右上角裝飾圖案 */}
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              backgroundColor: themeColors.primary,
              opacity: 0.1,
              zIndex: 1,
            }}
          />
          
          {/* 左下角裝飾圖案 */}
          <div
            style={{
              position: 'absolute',
              bottom: '-100px',
              left: '-100px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              backgroundColor: themeColors.accent,
              opacity: 0.3,
              zIndex: 1,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        // fonts: [
        //   {
        //     name: 'Noto Sans TC',
        //     data: await fetch(
        //       new URL('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap')
        //     ).then((res) => res.arrayBuffer()),
        //     style: 'normal',
        //   },
        // ],
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
} 