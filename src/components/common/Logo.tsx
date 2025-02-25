'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type LogoVariant = 'white' | 'black' | 'primary' | 'gradient'
type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'responsive'

interface LogoProps {
  /**
   * Logo color variant
   * @default 'black'
   */
  variant?: LogoVariant
  /**
   * Logo size preset
   * @default 'md'
   */
  size?: LogoSize
  /**
   * Link destination. If not provided, logo will be rendered without link
   */
  href?: string
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Whether to prioritize loading
   * @default false
   */
  priority?: boolean
  /**
   * Custom width (overrides size preset)
   */
  width?: number
  /**
   * Custom height (overrides size preset)
   */
  height?: number
  /**
   * Whether to show loading animation
   * @default true
   */
  showAnimation?: boolean
}

// Size presets with perfect aspect ratio
const logoSizes = {
  xs: { width: 80, height: 27 },
  sm: { width: 120, height: 40 },
  md: { width: 160, height: 53 },
  lg: { width: 200, height: 67 },
  xl: { width: 240, height: 80 },
  responsive: { width: 160, height: 53 } // Base size for responsive
}

// Logo variants with different color schemes
const logoVariants: Record<LogoVariant, string> = {
  white: '/logo-w.png',
  black: '/logo-b.png',
  primary: '/logo-r.png',
  gradient: '/logo-g.png'
}

// Animation variants
const logoAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } }
}

export default function Logo({ 
  variant = 'black',
  size = 'md',
  href,
  className,
  priority = false,
  width,
  height,
  showAnimation = true
}: LogoProps) {
  // Get dimensions from preset or custom values
  const dimensions = width && height 
    ? { width, height }
    : size === 'responsive'
    ? logoSizes.responsive
    : logoSizes[size]

  // Get logo source based on variant
  const logoSrc = logoVariants[variant]

  // Base image component with motion
  const logoImage = (
    <motion.div
      initial={showAnimation ? logoAnimation.initial : false}
      animate={showAnimation ? logoAnimation.animate : false}
      whileHover={logoAnimation.hover}
      className={cn(
        'relative transition-opacity duration-200',
        'hover:opacity-90',
        className
      )}
    >
      <Image
        src={logoSrc}
        alt="Aidea:Med Logo"
        width={dimensions.width}
        height={dimensions.height}
        className="object-contain"
        priority={priority}
        quality={90}
        aria-label="Aidea:Med - 醫療行銷顧問公司"
      />
    </motion.div>
  )

  // Responsive styles for different screen sizes
  const responsiveStyles = size === 'responsive' 
    ? 'w-[120px] sm:w-[160px] lg:w-[200px] h-auto' 
    : ''

  // Return with or without link wrapper
  if (href) {
    return (
      <Link 
        href={href} 
        className={cn("inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm", responsiveStyles)}
        aria-label="回到首頁"
      >
        {logoImage}
      </Link>
    )
  }

  return (
    <div className={responsiveStyles}>
      {logoImage}
    </div>
  )
} 