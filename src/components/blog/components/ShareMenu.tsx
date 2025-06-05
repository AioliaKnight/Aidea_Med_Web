/**
 * 分享選單組件
 * 提供多種社交媒體分享選項
 */

import React, { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FacebookIcon, TwitterIcon, LinkIcon } from 'lucide-react'
import { BLOG_STYLES, BLOG_ANIMATIONS } from '../types'

interface ShareMenuProps {
  isVisible: boolean
  onFacebookShare: () => void
  onTwitterShare: () => void
  onLineShare: () => void
  onCopyLink: () => void
}

const ShareMenu = forwardRef<HTMLDivElement, ShareMenuProps>(({
  isVisible,
  onFacebookShare,
  onTwitterShare,
  onLineShare,
  onCopyLink
}, ref) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={ref}
          initial={BLOG_ANIMATIONS.SLIDE_IN_RIGHT.initial}
          animate={BLOG_ANIMATIONS.SLIDE_IN_RIGHT.animate}
          exit={BLOG_ANIMATIONS.SLIDE_IN_RIGHT.exit}
          transition={BLOG_ANIMATIONS.SLIDE_IN_RIGHT.transition}
          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
        >
          <button
            onClick={onFacebookShare}
            className={BLOG_STYLES.SHARE_BUTTON}
          >
            <FacebookIcon className="w-4 h-4 text-blue-600" />
            <span>分享到 Facebook</span>
          </button>
          
          <button
            onClick={onTwitterShare}
            className={BLOG_STYLES.SHARE_BUTTON}
          >
            <TwitterIcon className="w-4 h-4 text-blue-400" />
            <span>分享到 Twitter</span>
          </button>
          
          <button
            onClick={onLineShare}
            className={BLOG_STYLES.SHARE_BUTTON}
          >
            <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">L</span>
            </div>
            <span>分享到 LINE</span>
          </button>
          
          <button
            onClick={onCopyLink}
            className={BLOG_STYLES.SHARE_BUTTON}
          >
            <LinkIcon className="w-4 h-4 text-gray-600" />
            <span>複製連結</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

ShareMenu.displayName = 'ShareMenu'

export default ShareMenu 