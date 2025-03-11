'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PortableTextBlock } from '@portabletext/types'

interface TableOfContentsProps {
  content: PortableTextBlock[]
}

interface TocItem {
  id: string
  text: string
  level: number
}

export const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>('')
  const [tocItems, setTocItems] = useState<TocItem[]>([])

  // 解析內容中的標題
  useEffect(() => {
    const items: TocItem[] = []
    content.forEach((block) => {
      if (block.style === 'h2' || block.style === 'h3') {
        const text = block.children?.[0]?.text || ''
        const id = text.toLowerCase().replace(/\s+/g, '-')
        items.push({
          id,
          text,
          level: block.style === 'h2' ? 2 : 3,
        })
      }
    })
    setTocItems(items)
  }, [content])

  // 監聽滾動以更新當前位置
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0px -80% 0px',
      }
    )

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [tocItems])

  if (tocItems.length === 0) return null

  return (
    <nav className="space-y-2">
      {tocItems.map((item) => (
        <motion.a
          key={item.id}
          href={`#${item.id}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`
            block text-sm transition-colors duration-200
            ${item.level === 3 ? 'ml-4' : ''}
            ${
              activeId === item.id
                ? 'text-primary font-medium'
                : 'text-gray-600 hover:text-primary'
            }
          `}
          onClick={(e) => {
            e.preventDefault()
            const element = document.getElementById(item.id)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            }
          }}
        >
          {item.text}
        </motion.a>
      ))}
    </nav>
  )
} 