import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'

/**
 * 動態 OG 圖片生成 API
 * 用於社交媒體分享優化
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 獲取參數
    const title = searchParams.get('title') || 'Aidea:Med 醫療行銷顧問'
    const subtitle = searchParams.get('subtitle') || '為醫療診所注入數位活力，專業行銷解決方案'
    const type = searchParams.get('type') || 'general'
    const theme = searchParams.get('theme') || 'light'
    
    // 主題配色
    const themes = {
      light: {
        bg: '#ffffff',
        primary: '#e62733',
        secondary: '#1a1a1a',
        accent: '#f8f9fa'
      },
      dark: {
        bg: '#1a1a1a',
        primary: '#e62733',
        secondary: '#ffffff',
        accent: '#2d2d2d'
      }
    }
    
    const currentTheme = themes[theme as keyof typeof themes] || themes.light
    
    // 根據類型設置不同的佈局
    const typeConfig = {
      blog: {
        titleSize: 48,
        subtitleSize: 24,
        icon: '📝'
      },
      service: {
        titleSize: 52,
        subtitleSize: 26,
        icon: '🏥'
      },
      team: {
        titleSize: 50,
        subtitleSize: 25,
        icon: '👥'
      },
      general: {
        titleSize: 54,
        subtitleSize: 28,
        icon: '💡'
      }
    }
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.general

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: currentTheme.bg,
            backgroundImage: `linear-gradient(45deg, ${currentTheme.bg} 0%, ${currentTheme.accent} 100%)`,
            padding: '60px',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: currentTheme.primary,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                marginRight: '20px',
              }}
            >
              {config.icon}
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: currentTheme.primary,
              }}
            >
              Aidea:Med
            </div>
          </div>

          {/* 主標題 */}
          <div
            style={{
              fontSize: config.titleSize,
              fontWeight: 'bold',
              color: currentTheme.secondary,
              lineHeight: 1.2,
              marginBottom: '20px',
              maxWidth: '800px',
            }}
          >
            {title}
          </div>

          {/* 副標題 */}
          {subtitle && (
            <div
              style={{
                fontSize: config.subtitleSize,
                color: currentTheme.secondary,
                opacity: 0.8,
                lineHeight: 1.4,
                maxWidth: '700px',
                marginBottom: '40px',
              }}
            >
              {subtitle}
            </div>
          )}

          {/* 底部資訊 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              bottom: '60px',
              right: '60px',
              fontSize: '18px',
              color: currentTheme.secondary,
              opacity: 0.6,
            }}
          >
            www.aideamed.com
          </div>

          {/* 裝飾性元素 */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: currentTheme.primary,
              opacity: 0.1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '40px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: currentTheme.primary,
              opacity: 0.05,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Type': 'image/png',
        },
      }
    )
  } catch (error) {
    console.error('OG 圖片生成失敗:', error)
    
    return NextResponse.json(
      { error: 'Failed to generate OG image' },
      { status: 500 }
    )
  }
} 