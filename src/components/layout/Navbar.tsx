'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Logo from '@/components/common/Logo'

// 導航項目定義
const navigation = [
  { name: '首頁', nameEn: 'Home', href: '/' },
  { name: '服務項目', nameEn: 'Services', href: '/service' },
  { name: '成功案例', nameEn: 'Cases', href: '/case' },
  { name: '專業團隊', nameEn: 'Team', href: '/team' },
  { name: '知識庫', nameEn: 'Blog', href: '/blog' },
  { name: '聯絡我們', nameEn: 'Contact', href: '/contact' }
]

// 動畫變體
const menuVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      staggerChildren: 0.05
    }
  },
  closed: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
      staggerChildren: 0.05
    }
  }
}

const menuItemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  closed: {
    opacity: 0,
    y: -5,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
}

const indicatorVariants = {
  initial: { width: 0 },
  animate: { 
    width: '100%',
    transition: { duration: 0.2, ease: 'easeOut' }
  }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // 處理滾動
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 關閉選單
  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white text-gray-900 h-16'
          : 'bg-primary text-white h-20'
      )}
    >
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Logo
          href="/"
          variant={isScrolled ? 'black' : 'white'}
          size="responsive"
          priority
        />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative py-2"
            >
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                  {item.nameEn}
                </span>
              </div>
              {pathname === item.href && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-current"
                  variants={indicatorVariants}
                  initial="initial"
                  animate="animate"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 -mr-2 text-current"
          aria-label={isOpen ? '關閉選單' : '開啟選單'}
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span
              className={cn(
                'w-full h-0.5 bg-current transition-all duration-300',
                isOpen && 'rotate-45 translate-y-2'
              )}
            />
            <span
              className={cn(
                'w-full h-0.5 bg-current transition-all duration-300',
                isOpen && 'opacity-0'
              )}
            />
            <span
              className={cn(
                'w-full h-0.5 bg-current transition-all duration-300',
                isOpen && '-rotate-45 -translate-y-2'
              )}
            />
          </div>
        </button>

        {/* Mobile Menu */}
        <motion.div
          className={cn(
            'fixed inset-0 top-[64px] bg-white lg:hidden',
            !isOpen && 'pointer-events-none'
          )}
          variants={menuVariants}
          initial="closed"
          animate={isOpen ? 'open' : 'closed'}
        >
          <div className="container h-full mx-auto px-4 py-8">
            <div className="grid gap-4">
              {navigation.map((item) => (
                <motion.div key={item.href} variants={menuItemVariants}>
                  <Link
                    href={item.href}
                    className={cn(
                      'block py-3 text-center',
                      pathname === item.href
                        ? 'bg-primary/5 text-primary'
                        : 'text-gray-900 hover:text-primary'
                    )}
                    onClick={closeMenu}
                  >
                    <div className="text-lg font-medium">{item.name}</div>
                    <div className="text-sm opacity-60">{item.nameEn}</div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </nav>
  )
} 