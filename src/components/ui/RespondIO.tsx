'use client'

import Script from 'next/script'

export default function RespondIO() {
  return (
    <Script
      id="respondio__widget"
      src="https://cdn.respond.io/webchat/widget/widget.js?cId=5ba9ba94598090a0cbb6e9144389f13"
      strategy="afterInteractive"
      onError={(e) => {
        console.error('Respond.io widget error:', e)
      }}
      onLoad={() => {
        console.log('Respond.io widget loaded successfully')
        // 確保全局對象存在
        if (typeof window !== 'undefined' && !window.__RESPOND_IO_CONFIG__) {
          window.__RESPOND_IO_CONFIG__ = {
            channelId: '5ba9ba94598090a0cbb6e9144389f13'
          }
        }
      }}
    />
  )
} 