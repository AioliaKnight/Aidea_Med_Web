'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import { cn } from '@/lib/utils'

// 動畫變體系統
const animations = {
  menu: {
    initial: { 
      opacity: 0,
      y: -20,
      transformOrigin: 'top'
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    }
  },
  dropdown: {
    initial: { 
      opacity: 0,
      y: -8,
      height: 0,
      transformOrigin: 'top'
    },
    animate: { 
      opacity: 1,
      y: 0,
      height: 'auto',
      transition: { 
        height: { 
          type: "spring",
          stiffness: 500,
          damping: 30
        },
        opacity: { 
          duration: 0.2,
          ease: 'easeOut'
        }
      }
    },
    exit: { 
      opacity: 0,
      y: -8,
      height: 0,
      transition: {
        height: { 
          type: "spring",
          stiffness: 500,
          damping: 30
        },
        opacity: { duration: 0.1 }
      }
    }
  },
  item: {
    hover: { y: -2 },
    tap: { y: 0 },
    transition: { duration: 0.2 }
  },
  underline: {
    initial: { 
      scaleX: 0,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    animate: { 
      scaleX: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    hover: {
      scaleX: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  },
  search: {
    initial: { 
      height: 0,
      opacity: 0,
      transformOrigin: 'top'
    },
    animate: { 
      height: 'auto',
      opacity: 1,
      transition: {
        height: { 
          type: "spring",
          stiffness: 500,
          damping: 30
        },
        opacity: { 
          duration: 0.3,
          ease: 'easeOut'
        }
      }
    },
    exit: { 
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.2 },
        opacity: { duration: 0.2 }
      }
    }
  },
  mobileItem: {
    initial: { 
      opacity: 0,
      x: -20
    },
    animate: { 
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    hover: {
      x: 4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  },
  mobileButton: {
    initial: { scale: 0.8 },
    animate: { scale: 1 },
    tap: { scale: 0.95 },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
}

// 樣式系統
const styles = {
  header: {
    base: 'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
    scrolled: 'bg-white shadow-lg',
    default: 'bg-brand-red'
  },
  nav: {
    container: 'container mx-auto px-4',
    wrapper: 'flex items-center justify-between h-16 lg:h-20'
  },
  menu: {
    wrapper: 'hidden lg:flex items-center space-x-10',
    item: {
      base: 'relative py-3 group cursor-pointer select-none',
      active: 'text-brand-red',
      hover: 'hover:text-opacity-90 transition-opacity duration-300'
    }
  },
  text: {
    en: 'block text-[13px] font-bold tracking-[0.2em] transition-colors uppercase',
    zh: 'block text-[11px] transition-all mt-1 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 duration-300',
    colors: {
      light: {
        primary: 'text-white',
        secondary: 'text-white/70'
      },
      dark: {
        primary: 'text-gray-800',
        secondary: 'text-gray-400'
      }
    }
  },
  underline: {
    base: 'absolute -bottom-0.5 left-0 right-0 h-[2px] origin-left transform transition-all duration-300 ease-out',
    light: 'bg-white',
    dark: 'bg-brand-red',
    active: 'opacity-100',
    inactive: 'opacity-0 group-hover:opacity-100'
  },
  dropdown: {
    wrapper: 'absolute top-full left-1/2 -translate-x-1/2 w-60 py-3 mt-1 overflow-hidden rounded-lg shadow-lg',
    light: 'bg-brand-red/95 backdrop-blur-sm',
    dark: 'bg-white/95 backdrop-blur-sm',
    item: {
      base: 'block px-5 py-2.5 transition-all duration-300 relative',
      hover: {
        light: 'hover:bg-white/10',
        dark: 'hover:bg-gray-50'
      }
    }
  },
  button: {
    base: 'text-[13px] font-medium tracking-widest transition-colors uppercase',
    light: 'text-white/90 hover:text-white',
    dark: 'text-gray-600 hover:text-brand-red'
  },
  mobile: {
    menu: {
      wrapper: 'lg:hidden fixed inset-0 top-16 backdrop-blur-sm overflow-hidden',
      light: 'bg-brand-red/95',
      dark: 'bg-white/95',
      container: 'container mx-auto px-4 py-8 h-full overflow-y-auto',
      item: {
        wrapper: 'mb-8 overflow-hidden',
        link: 'block py-2 transition-colors duration-300'
      }
    },
    item: {
      en: 'block text-base font-bold tracking-wider uppercase transition-all duration-300',
      zh: 'block text-sm mt-1 font-normal transition-all duration-300',
      colors: {
        light: {
          primary: 'text-white hover:text-white/90',
          secondary: 'text-white/70 hover:text-white/80'
        },
        dark: {
          primary: 'text-gray-800 hover:text-brand-red',
          secondary: 'text-gray-500 hover:text-gray-700'
        }
      }
    },
    submenu: {
      wrapper: 'pl-4 mt-2 space-y-2 border-l transition-all duration-300',
      light: 'border-white/20',
      dark: 'border-gray-200',
      item: 'block py-2 transition-all duration-300'
    },
    button: {
      wrapper: 'flex items-center justify-around pt-8 mt-8 border-t transition-all duration-300',
      light: 'border-white/20',
      dark: 'border-gray-200'
    }
  },
  search: {
    wrapper: 'overflow-hidden relative',
    panel: 'container mx-auto py-4',
    input: {
      base: 'w-full px-4 py-2 text-lg bg-transparent transition-all duration-300 border-b-2 focus:outline-none',
      light: 'border-white/20 text-white placeholder-white/60 focus:border-white',
      dark: 'border-gray-200 text-gray-800 placeholder-gray-400 focus:border-brand-red'
    }
  }
}

// 選單項目
const menuItems = [
  {
    en: 'HOME',
    zh: '首頁',
    href: '/'
  },
  {
    en: 'SERVICES',
    zh: '服務項目',
    href: '/#services'
  },
  {
    en: 'CASES',
    zh: '成功案例',
    href: '/#case'
  },
  {
    en: 'TEAM',
    zh: '專業團隊',
    href: '/#team'
  },
  {
    en: 'BLOG',
    zh: '部落格',
    href: '/blog',
    submenu: [
      {
        en: 'Brand Strategy',
        zh: '品牌經營',
        href: '/blog/category/branding'
      },
      {
        en: 'Digital Marketing',
        zh: '數位行銷',
        href: '/blog/category/marketing'
      },
      {
        en: 'Clinic Management',
        zh: '診所管理',
        href: '/blog/category/management'
      },
      {
        en: 'Industry Trends',
        zh: '產業趨勢',
        href: '/blog/category/trends'
      }
    ]
  },
  {
    en: 'CONTACT',
    zh: '聯絡我們',
    href: '/#contact'
  }
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [language, setLanguage] = useState<'en' | 'zh'>('zh')
  const pathname = usePathname()

  // 監聽滾動
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 路由變化時關閉選單
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
    setActiveSubmenu(null)
  }, [pathname])

  return (
    <header
      className={cn(
        styles.header.base,
        isScrolled ? styles.header.scrolled : styles.header.default
      )}
    >
      <nav className={styles.nav.container}>
        <div className={styles.nav.wrapper}>
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <Logo 
              variant={isScrolled ? 'black' : 'white'}
              showLoadingState={false}
              className="transition-all duration-500"
            />
          </Link>

          {/* 桌面版選單 */}
          <div className={styles.menu.wrapper}>
            {menuItems.map((item) => (
              <div
                key={item.en}
                className="relative"
                onMouseEnter={() => item.submenu && setActiveSubmenu(item.en)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link href={item.href}>
                  <motion.div
                    className={cn(
                      styles.menu.item.base,
                      styles.menu.item.hover,
                      pathname === item.href && styles.menu.item.active
                    )}
                    whileHover="hover"
                    whileTap="tap"
                    variants={animations.item}
                  >
                    <div className="relative">
                      {/* 英文標題 */}
                      <span
                        className={cn(
                          styles.text.en,
                          isScrolled 
                            ? styles.text.colors.dark.primary 
                            : styles.text.colors.light.primary,
                          pathname === item.href && (
                            isScrolled ? 'text-brand-red' : 'text-white'
                          )
                        )}
                      >
                        {item.en}
                      </span>

                      {/* 底線動畫 */}
                      <motion.span
                        className={cn(
                          styles.underline.base,
                          isScrolled ? styles.underline.dark : styles.underline.light,
                          pathname === item.href ? styles.underline.active : styles.underline.inactive
                        )}
                        variants={animations.underline}
                        initial="initial"
                        animate={pathname === item.href ? "animate" : "initial"}
                        whileHover="hover"
                      />

                      {/* 中文標題 */}
                      <span
                        className={cn(
                          styles.text.zh,
                          isScrolled 
                            ? styles.text.colors.dark.secondary 
                            : styles.text.colors.light.secondary
                        )}
                      >
                        {item.zh}
                      </span>
                    </div>
                  </motion.div>
                </Link>

                {/* 下拉選單 */}
                <AnimatePresence>
                  {item.submenu && activeSubmenu === item.en && (
                    <motion.div
                      variants={animations.dropdown}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className={cn(
                        styles.dropdown.wrapper,
                        isScrolled ? styles.dropdown.dark : styles.dropdown.light
                      )}
                    >
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.en}
                          href={subitem.href}
                          className={cn(
                            styles.dropdown.item.base,
                            isScrolled 
                              ? styles.dropdown.item.hover.dark 
                              : styles.dropdown.item.hover.light
                          )}
                        >
                          <motion.div
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span className={cn(
                              'block text-[12px] font-medium tracking-wider uppercase',
                              isScrolled 
                                ? styles.text.colors.dark.primary 
                                : styles.text.colors.light.primary
                            )}>
                              {subitem.en}
                            </span>
                            <span className={cn(
                              'block text-[11px] mt-0.5 opacity-0 transition-opacity group-hover:opacity-100',
                              isScrolled 
                                ? styles.text.colors.dark.secondary 
                                : styles.text.colors.light.secondary
                            )}>
                              {subitem.zh}
                            </span>
                          </motion.div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* 功能按鈕群組 */}
            <div className="flex items-center space-x-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  styles.button.base,
                  isScrolled ? styles.button.dark : styles.button.light
                )}
              >
                SEARCH
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                className={cn(
                  styles.button.base,
                  isScrolled ? styles.button.dark : styles.button.light
                )}
              >
                {language === 'en' ? '中' : 'EN'}
              </motion.button>
            </div>
          </div>

          {/* 手機版選單按鈕 */}
          <motion.button
            className="lg:hidden relative z-10 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative w-6 h-5">
              <motion.span
                className={cn(
                  'absolute w-full h-0.5 transition-all duration-300 ease-out',
                  isScrolled ? 'bg-gray-800' : 'bg-white'
                )}
                animate={{
                  top: isMobileMenuOpen ? '10px' : '0px',
                  rotate: isMobileMenuOpen ? 45 : 0
                }}
              />
              <motion.span
                className={cn(
                  'absolute w-full h-0.5 top-2 transition-all duration-300 ease-out',
                  isScrolled ? 'bg-gray-800' : 'bg-white'
                )}
                animate={{
                  opacity: isMobileMenuOpen ? 0 : 1
                }}
              />
              <motion.span
                className={cn(
                  'absolute w-full h-0.5 transition-all duration-300 ease-out',
                  isScrolled ? 'bg-gray-800' : 'bg-white'
                )}
                animate={{
                  top: isMobileMenuOpen ? '10px' : '20px',
                  rotate: isMobileMenuOpen ? -45 : 0
                }}
              />
            </div>
          </motion.button>
        </div>

        {/* 搜尋面板 */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              variants={animations.search}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn(
                styles.search.wrapper,
                isScrolled ? 'bg-white' : 'bg-brand-red'
              )}
            >
              <div className={styles.search.panel}>
                <input
                  type="text"
                  placeholder="搜尋..."
                  className={cn(
                    styles.search.input.base,
                    isScrolled 
                      ? styles.search.input.dark
                      : styles.search.input.light
                  )}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 手機版選單 */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={animations.menu}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn(
                styles.mobile.menu.wrapper,
                isScrolled ? styles.mobile.menu.dark : styles.mobile.menu.light
              )}
            >
              <div className={styles.mobile.menu.container}>
                {menuItems.map((item) => (
                  <motion.div
                    key={item.en}
                    variants={animations.mobileItem}
                    className={styles.mobile.menu.item.wrapper}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        styles.mobile.menu.item.link,
                        pathname === item.href && 'text-brand-red'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.div whileHover="hover" variants={animations.mobileItem}>
                        <span className={cn(
                          styles.mobile.item.en,
                          isScrolled 
                            ? styles.mobile.item.colors.dark.primary 
                            : styles.mobile.item.colors.light.primary
                        )}>
                          {item.en}
                        </span>
                        <span className={cn(
                          styles.mobile.item.zh,
                          isScrolled 
                            ? styles.mobile.item.colors.dark.secondary 
                            : styles.mobile.item.colors.light.secondary
                        )}>
                          {item.zh}
                        </span>
                      </motion.div>
                    </Link>

                    {item.submenu && (
                      <div className={cn(
                        styles.mobile.submenu.wrapper,
                        isScrolled 
                          ? styles.mobile.submenu.dark 
                          : styles.mobile.submenu.light
                      )}>
                        {item.submenu.map((subitem) => (
                          <motion.div
                            key={subitem.en}
                            variants={animations.mobileItem}
                          >
                            <Link
                              href={subitem.href}
                              className={styles.mobile.submenu.item}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <motion.div whileHover="hover" variants={animations.mobileItem}>
                                <span className={cn(
                                  'block text-sm font-medium tracking-wider uppercase',
                                  isScrolled 
                                    ? styles.mobile.item.colors.dark.primary 
                                    : styles.mobile.item.colors.light.primary
                                )}>
                                  {subitem.en}
                                </span>
                                <span className={cn(
                                  'block text-xs mt-0.5',
                                  isScrolled 
                                    ? styles.mobile.item.colors.dark.secondary 
                                    : styles.mobile.item.colors.light.secondary
                                )}>
                                  {subitem.zh}
                                </span>
                              </motion.div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* 手機版功能按鈕 */}
                <motion.div 
                  className={cn(
                    styles.mobile.button.wrapper,
                    isScrolled 
                      ? styles.mobile.button.dark 
                      : styles.mobile.button.light
                  )}
                  variants={animations.mobileItem}
                >
                  <motion.button
                    onClick={() => {
                      setLanguage(language === 'en' ? 'zh' : 'en')
                      setIsMobileMenuOpen(false)
                    }}
                    className={cn(
                      'text-sm font-medium tracking-wider uppercase',
                      isScrolled 
                        ? styles.mobile.item.colors.dark.primary 
                        : styles.mobile.item.colors.light.primary
                    )}
                    variants={animations.mobileButton}
                    whileTap="tap"
                  >
                    {language === 'en' ? '切換至中文' : 'Switch to English'}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
} 