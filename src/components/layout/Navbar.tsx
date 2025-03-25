'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Logo from '@/components/common/Logo'
import React from 'react'

// 導航項目定義（統一導航項配置）
const navigation = [
  { name: '首頁', nameEn: 'HOME', href: '/' },
  { name: '服務項目', nameEn: 'SERVICES', href: '/service' },
  { name: '成功案例', nameEn: 'CASES', href: '/case' },
  { name: '專業團隊', nameEn: 'TEAM', href: '/team' },
  { name: '聯絡我們', nameEn: 'CONTACT', href: '/contact' }
]

// 統一導航樣式設定
const navStyles = {
  // 默認樣式 - 主色調背景
  default: 'bg-primary border-b border-white/10',
  // 滾動樣式 - 白色背景
  scrolled: 'bg-white border-b border-gray-100',
  // 詳情頁樣式 - 深色透明背景
  detail: 'bg-black/90 border-b border-white/10'
}

// 統一導航文字樣式
const textStyles = {
  // 默認狀態文字樣式
  default: {
    active: 'text-white',
    normal: 'text-white/90 hover:text-white',
    activeSecondary: 'text-white/90',
    normalSecondary: 'text-white/75 group-hover:text-white/90',
    indicator: 'bg-white'
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
  default: 'bg-white text-primary hover:bg-white/95 transition-colors duration-300',
  scrolled: 'bg-primary text-white hover:bg-primary/90 transition-colors duration-300'
}

// 優化的NavItem組件 - 使用React.memo避免不必要重渲染
const NavItem = React.memo(({ 
  item, 
  isActive, 
  navMode 
}: { 
  item: typeof navigation[0]; 
  isActive: boolean; 
  navMode: 'default' | 'scrolled'; 
}) => {
  const activeStyle = useMemo(() => 
    isActive ? textStyles[navMode].active : textStyles[navMode].normal,
    [isActive, navMode]
  )
  
  const secondaryStyle = useMemo(() => 
    isActive ? textStyles[navMode].activeSecondary : textStyles[navMode].normalSecondary,
    [isActive, navMode]
  )

  return (
    <Link
      href={item.href}
      className={cn(
        "relative px-3 py-2 group transition-colors duration-300 flex flex-col items-center justify-center",
        activeStyle
      )}
      aria-current={isActive ? 'page' : undefined}
      role="menuitem"
    >
      <div className="flex flex-col items-center">
        <span className="text-base font-medium text-center">{item.name}</span>
        <span className={cn(
          "text-xs mt-0.5 font-light tracking-wide transition-colors duration-300 text-center",
          secondaryStyle
        )}>
          {item.nameEn}
        </span>
      </div>
      
      <div className="absolute bottom-0 inset-x-0 h-0.5 flex justify-center">
        {isActive && (
          <motion.div
            layoutId="navIndicator"
            className={cn(
              "h-0.5 rounded-full",
              textStyles[navMode].indicator
            )}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '24px', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.4, 0, 0.2, 1],
              opacity: { duration: 0.2 }
            }}
          />
        )}
      </div>
    </Link>
  )
})
NavItem.displayName = 'NavItem'

// 主导航组件
export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // 計算當前頁面類型與導航模式 - 使用useMemo記憶結果避免重複計算
  const { isDetailPage, navMode } = useMemo(() => {
    const isDetail = pathname?.includes('/case/') || pathname?.includes('/service/') || pathname?.includes('/team/')
    const mode = scrolled ? 'scrolled' : 'default'
    return { isDetailPage: isDetail, navMode: mode as 'default' | 'scrolled' }
  }, [pathname, scrolled])

  // 使用useCallback優化滾動處理函數
  const handleScroll = useCallback(() => {
    if (window.scrollY > 20) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  }, [])

  // 使用useCallback優化移動菜單切換
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])

  // 添加滾動監聽器
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // 計算當前導航樣式 - 使用useMemo記憶結果避免重複計算
  const currentNavStyle = useMemo(() => {
    if (isDetailPage) return navStyles.detail
    return scrolled ? navStyles.scrolled : navStyles.default
  }, [isDetailPage, scrolled])

  // 計算當前按鈕樣式 - 使用useMemo記憶結果避免重複計算
  const currentButtonStyle = useMemo(() => 
    scrolled ? buttonStyles.scrolled : buttonStyles.default,
    [scrolled]
  )

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-16",
        currentNavStyle
      )}
      id="main-header"
    >
      {/* 導航內容 */}
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo區域 */}
        <div className="flex-shrink-0">
          <Link href="/" aria-label="回到首頁">
            <Logo variant={scrolled ? 'black' : 'white'} className="h-10 w-auto" />
          </Link>
        </div>

        {/* 桌面導航項目 */}
        <nav 
          className="hidden lg:flex items-center space-x-2"
          role="navigation"
          aria-label="主導航選單"
        >
          <div role="menubar" className="flex items-center space-x-2">
            {navigation.map((item) => (
              <NavItem 
                key={item.href}
                item={item}
                isActive={pathname === item.href}
                navMode={navMode}
              />
            ))}
          </div>
        </nav>

        {/* 聯絡按鈕 */}
        <div className="hidden lg:block">
          <Link
            href="/contact"
            className={cn(
              "rounded-lg py-2.5 px-5 text-sm font-medium transition-all duration-300 hover:scale-105",
              currentButtonStyle
            )}
            aria-label="預約專屬顧問諮詢"
          >
            預約專屬顧問
          </Link>
        </div>

        {/* 移動設備菜單按鈕 */}
        <button
          type="button"
          className="lg:hidden rounded-md p-2 transition-colors duration-300"
          onClick={toggleMobileMenu}
          aria-controls="mobile-menu"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "關閉選單" : "開啟選單"}
        >
          <span className="sr-only">{mobileMenuOpen ? "關閉主選單" : "開啟主選單"}</span>
          <div className="relative w-6 h-5">
            <span
              className={cn(
                "absolute h-0.5 w-6 transform transition duration-300 ease-in-out",
                mobileMenuOpen ? "rotate-45 translate-y-2.5" : "-translate-y-2",
                scrolled ? "bg-gray-800" : "bg-white"
              )}
            />
            <span
              className={cn(
                "absolute h-0.5 w-6 transform transition-opacity duration-300 ease-in-out",
                mobileMenuOpen ? "opacity-0" : "opacity-100",
                scrolled ? "bg-gray-800" : "bg-white"
              )}
            />
            <span
              className={cn(
                "absolute h-0.5 w-6 transform transition duration-300 ease-in-out",
                mobileMenuOpen ? "-rotate-45 translate-y-2.5" : "translate-y-2",
                scrolled ? "bg-gray-800" : "bg-white"
              )}
            />
          </div>
        </button>
      </div>

      {/* 移動設備菜單 */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "lg:hidden overflow-hidden shadow-lg",
              scrolled ? "bg-white" : "bg-primary"
            )}
            role="dialog"
            aria-modal="true"
            aria-label="行動版選單"
          >
            <nav className="px-4 pt-2 pb-4 space-y-1" role="menu">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2.5 font-medium rounded-lg transition-all duration-300",
                    pathname === item.href
                      ? scrolled
                        ? "bg-primary/10 text-primary"
                        : "bg-white/10 text-white"
                      : scrolled
                      ? "text-gray-700 hover:bg-gray-50"
                      : "text-white/90 hover:bg-white/5"
                  )}
                  onClick={toggleMobileMenu}
                  role="menuitem"
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  <span className="block">{item.name}</span>
                  <span className="block text-xs mt-0.5 opacity-75">{item.nameEn}</span>
                </Link>
              ))}
              <Link
                href="/contact"
                className={cn(
                  "block px-3 py-2.5 mt-2 text-center font-medium rounded-lg transition-all duration-300 hover:scale-105",
                  scrolled
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-white text-primary hover:bg-white/95"
                )}
                onClick={toggleMobileMenu}
                role="menuitem"
              >
                預約顧問諮詢
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
} 