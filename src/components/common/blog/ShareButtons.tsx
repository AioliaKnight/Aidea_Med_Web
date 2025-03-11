'use client'

import { FaFacebook, FaTwitter, FaLine, FaLink } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface ShareButtonsProps {
  url: string
  title: string
}

export const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const shareButtons = [
    {
      icon: FaFacebook,
      label: 'Facebook',
      onClick: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
      },
      bgColor: 'bg-[#1877F2] hover:bg-[#0C63D4]'
    },
    {
      icon: FaTwitter,
      label: 'Twitter',
      onClick: () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
      },
      bgColor: 'bg-[#1DA1F2] hover:bg-[#0C8BD9]'
    },
    {
      icon: FaLine,
      label: 'Line',
      onClick: () => {
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`, '_blank')
      },
      bgColor: 'bg-[#00B900] hover:bg-[#009900]'
    },
    {
      icon: FaLink,
      label: '複製連結',
      onClick: () => {
        navigator.clipboard.writeText(url).then(() => {
          toast.success('已複製連結')
        })
      },
      bgColor: 'bg-gray-600 hover:bg-gray-700'
    }
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {shareButtons.map((button) => (
        <motion.button
          key={button.label}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={button.onClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${button.bgColor}`}
        >
          <button.icon className="text-lg" />
          <span className="text-sm">{button.label}</span>
        </motion.button>
      ))}
    </div>
  )
} 