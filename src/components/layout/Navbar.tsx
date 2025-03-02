'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Logo from '@/components/common/Logo'

// 導航項目定義
const navigation = [
  { name: '首頁', nameEn: 'HOME', href: '/' },
  { name: '服務項目', nameEn: 'SERVICES', href: '/service' },
  { name: '成功案例', nameEn: 'CASES', href: '/case' },
  { name: '專業團隊', nameEn: 'TEAM', href: '/team' },
  { name: '知識庫', nameEn: 'BLOG', href: '/blog' },
  { name: '聯絡我們', nameEn: 'CONTACT', href: '/contact' }
]

// 統一導航樣式設定
const navStyles = {
  // 默認樣式 - 主色調背景
  default: 'bg-primary backdrop-blur-sm border-b border-white/15',
  // 滾動樣式 - 白色背景
  scrolled: 'bg-white/95 border-b border-gray-200 shadow-sm',
  // 詳情頁樣式 - 深色透明背景
  detail: 'bg-black/70 backdrop-blur-sm border-b border-white/10'
}

// 統一導航文字樣式
const textStyles = {
  // 默認狀態文字樣式
  default: {
    active: 'text-white',
    normal: 'text-white/90 hover:text-white',
    activeSecondary: 'text-white/90',
    normalSecondary: 'text-white/75 group-hover:text-white/90',
    indicator: 'bg-white shadow-glow'
  },
  // 滾動狀態文字樣式
  scrolled: {
    active: 'text-primary',
    normal: 'text-gray-800 hover:text-primary',
    activeSecondary: 'text-primary/80',
    normalSecondary: 'text-gray-500 group-hover:text-primary/80',
    indicator: 'bg-primary'
  }
}

// 按鈕樣式
const buttonStyles = {
  default: 'bg-white text-primary hover:bg-white/90 shadow-sm',
  scrolled: 'bg-primary text-white hover:bg-primary/90'
}

// 簡化動畫變體
const menuVariants = {
  open: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.25, ease: 'easeOut', staggerChildren: 0.03 }
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
}

const menuItemVariants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  closed: { opacity: 0, y: -5, transition: { duration: 0.1 } }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  
  // 判斷頁面類型 - 統一詳情頁判斷邏輯
  const isDetailPage = 
    (pathname.startsWith('/case/') && pathname !== '/case') || 
    (pathname.startsWith('/blog/') && pathname !== '/blog') ||
    (pathname.startsWith('/team/') && pathname !== '/team') ||
    (pathname.startsWith('/service/') && pathname !== '/service')

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
  
  // 獲取背景樣式
  const getBackgroundStyle = () => {
    if (isScrolled) return navStyles.scrolled
    if (isDetailPage) return navStyles.detail
    return navStyles.default
  }
  
  // 獲取文字樣式集
  const getTextStyles = () => {
    return isScrolled ? textStyles.scrolled : textStyles.default
  }
  
  // 獲取按鈕樣式
  const getButtonStyle = () => {
    return isScrolled ? buttonStyles.scrolled : buttonStyles.default
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 font-gothic">
      {/* 導航欄背景 */}
      <motion.div 
        className={cn('absolute inset-0 transition-all duration-300', getBackgroundStyle())}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* 導航欄內容 */}
      <nav className="container relative h-16 md:h-20 mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Logo
          href="/"
          variant={isScrolled ? 'black' : 'white'}
          size="responsive"
          priority
        />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <div className="flex space-x-6 mr-6">
            {navigation.map((item) => {
              const isActive = 
                pathname === item.href || 
                (pathname.startsWith(item.href) && item.href !== '/');
              
              const styles = getTextStyles();
              
              return (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'relative group',
                    isActive ? styles.active : styles.normal
                  )}
                >
                  <div className="flex flex-col items-center py-3">
                    {/* 英文名稱 (主要) */}
                    <span className={cn(
                      "font-medium tracking-wide text-sm",
                      !isScrolled && "text-shadow-sm"
                    )}>
                      {item.nameEn}
                    </span>
                    
                    {/* 中文名稱 (輔助) */}
                    <span className={cn(
                      "text-xs tracking-wide mt-0.5",
                      isActive ? styles.activeSecondary : styles.normalSecondary
                    )}>
                      {item.name}
                    </span>
                    
                    {/* 活動指示器 */}
                    {isActive && (
                      <motion.span
                        className={cn(
                          "absolute -bottom-1 left-0 w-full h-[2px]",
                          styles.indicator
                        )}
                        layoutId="navIndicator"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
          
          {/* 諮詢按鈕 */}
          <Link href="/contact">
            <span className={cn(
              'inline-flex items-center px-5 py-2 font-medium text-sm tracking-wide transition-colors',
              getButtonStyle()
            )}>
              CONSULT
              <span className="ml-1 text-xs opacity-80">免費諮詢</span>
            </span>
          </Link>
        </div>
        
        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-5 h-4">
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                animate={{ 
                  rotate: isOpen && index !== 1 ? (index === 0 ? 45 : -45) : 0,
                  y: isOpen ? (index === 0 ? 6 : index === 2 ? -6 : 0) : 0,
                  opacity: isOpen && index === 1 ? 0 : 1
                }}
                className={cn(
                  'absolute left-0 block w-5 h-[1.5px] transition-colors',
                  isScrolled ? 'bg-gray-900' : 'bg-white shadow-glow',
                  index === 0 ? 'top-0' : index === 1 ? 'top-1/2 -translate-y-1/2' : 'bottom-0'
                )}
              />
            ))}
          </div>
        </button>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-full left-0 w-full bg-white overflow-hidden md:hidden shadow-md"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="container mx-auto px-6 py-3 flex flex-col">
                {navigation.map((item, index) => {
                  const isActive = 
                    pathname === item.href || 
                    (pathname.startsWith(item.href) && item.href !== '/');
                  
                  return (
                    <motion.div 
                      key={item.name} 
                      variants={menuItemVariants}
                      custom={index}
                    >
                      <Link 
                        href={item.href}
                        className={cn(
                          'flex items-center justify-between py-3 border-b border-gray-100',
                          isActive ? 'text-primary' : 'text-gray-800'
                        )}
                        onClick={closeMenu}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-sm tracking-wide">{item.nameEn}</span>
                          <span className="text-xs text-gray-500 mt-0.5">{item.name}</span>
                        </div>
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 16 16" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-gray-400"
                        >
                          <path 
                            d="M6 12L10 8L6 4" 
                            stroke="currentColor" 
                            strokeWidth="1" 
                            strokeLinecap="square"
                          />
                        </svg>
                      </Link>
                    </motion.div>
                  )
                })}
                
                <motion.div 
                  variants={menuItemVariants} 
                  custom={navigation.length}
                  className="mt-5 mb-3"
                >
                  <Link href="/contact" onClick={closeMenu}>
                    <span className="block w-full py-3 text-center font-medium text-white text-sm tracking-wide bg-primary hover:bg-primary/90 shadow-sm">
                      CONSULT <span className="text-xs opacity-80">免費諮詢</span>
                    </span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
} 