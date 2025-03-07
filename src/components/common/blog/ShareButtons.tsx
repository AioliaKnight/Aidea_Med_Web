'use client'

import { memo } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
}

const ShareButton = memo(({ platform, url, title }: { platform: string; url: string; title: string }) => {
  let shareUrl = ''
  let icon = ''
  
  switch (platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
      icon = 'M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z'
      break
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
      icon = 'M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z'
      break
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
      icon = 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
      break
    case 'line':
      shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`
      icon = 'M52.62 103.78c-11.42.33-22.39-4.95-30.7-13.14-9.35-9.23-13.94-21.37-14.49-34.03-.55-12.63 3.36-25.46 12.18-34.93 8.51-9.15 20.69-14.79 32.96-15 13.23-.22 26.64 5.07 36.19 14.18 10.43 9.73 15.84 23.61 15.74 37.48-.1 13.69-5.28 27.36-15.22 37.27-8.9 8.84-20.97 13.14-32.69 13.44-1.32 0-2.64 0-3.97-.27z M39.86 47.53h-7.55c-1.12 0-2.03.9-2.03 2.01v16.08c0 1.11.91 2.02 2.03 2.02h7.55c1.12 0 2.03-.91 2.03-2.02V49.54c0-1.11-.91-2.01-2.03-2.01z M75.56 47.53h-7.55c-1.12 0-2.03.9-2.03 2.01v16.08c0 1.11.91 2.02 2.03 2.02h7.55c1.12 0 2.03-.91 2.03-2.02V49.54c0-1.11-.91-2.01-2.03-2.01z M66.45 56.19H59.2c-1.04.03-1.88.9-1.85 1.94-.03 1.04.81 1.91 1.85 1.94h7.25c1.05-.03 1.88-.9 1.85-1.94.04-1.04-.8-1.91-1.85-1.94-1.94z M50.19 47.53h-1.92c-1.12 0-2.03.9-2.03 2.01v7.17h5.99v-7.17c0-1.11-.92-2.01-2.04-2.01z M52.23 58.13h-5.99v7.49c0 1.11.91 2.02 2.03 2.02h1.92c1.12 0 2.04-.91 2.04-2.02v-7.49z'
      break
  }

  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`分享到 ${platform}`}
      className="hover:opacity-80 transition-opacity"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d={icon} />
      </svg>
    </a>
  )
})

ShareButton.displayName = 'ShareButton'

export const ShareButtons = memo(({ url, title }: ShareButtonsProps) => {
  return (
    <div className="flex space-x-3 sm:space-x-4 text-gray-600">
      <ShareButton platform="facebook" url={url} title={title} />
      <ShareButton platform="twitter" url={url} title={title} />
      <ShareButton platform="linkedin" url={url} title={title} />
      <ShareButton platform="line" url={url} title={title} />
    </div>
  )
})

ShareButtons.displayName = 'ShareButtons' 