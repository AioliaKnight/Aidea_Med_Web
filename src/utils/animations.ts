import type { Transition, Variants } from 'framer-motion'

// 以下是所有動畫變數的宣告，確保所有變數先宣告後使用

// 基本動畫變體定義
const defaultEasing = [0.6, 0.05, 0.01, 0.9]

// CSS 動畫持續時間常數
export const DURATIONS = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  extraSlow: 1.2
}

// CSS 動畫延遲常數
export const DELAYS = {
  none: 0,
  tiny: 0.1,
  small: 0.2, 
  medium: 0.3,
  large: 0.5
}

// Loading 動畫配置常量
export const LOADING_ANIMATION_CONFIG = {
  staggerChildren: 0.1,
  delayChildren: 0.2,
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    extraSlow: 0.8
  },
  ease: {
    default: [0.23, 0.56, 0.32, 0.9], // custom easing
    bounce: "backOut",  // 內建彈跳效果
    gentle: "easeInOut", // 柔和
    springy: [0.34, 1.56, 0.64, 1] // 有彈性的
  }
} as const

// Loading 動畫變體
export const loadingContainerVariants: Variants = {
  initial: { 
    opacity: 0 
  },
  animate: { 
    opacity: 1,
    transition: { 
      duration: LOADING_ANIMATION_CONFIG.duration.normal,
      ease: LOADING_ANIMATION_CONFIG.ease.default,
      when: "beforeChildren"
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: LOADING_ANIMATION_CONFIG.duration.fast,
      ease: LOADING_ANIMATION_CONFIG.ease.default,
      when: "afterChildren" 
    }
  }
}

export const loadingLogoVariants: Variants = {
  initial: { 
    opacity: 0,
    scale: 0.8
  },
  animate: { 
    opacity: 1,
    scale: 1,
    transition: { 
      duration: LOADING_ANIMATION_CONFIG.duration.normal,
      ease: LOADING_ANIMATION_CONFIG.ease.bounce
    }
  }
}

export const loadingRingVariants: Variants = {
  initial: { 
    opacity: 0,
    scale: 0.85
  },
  animate: { 
    opacity: 1,
    scale: 1,
    transition: { 
      duration: LOADING_ANIMATION_CONFIG.duration.normal,
      ease: LOADING_ANIMATION_CONFIG.ease.default
    }
  }
}

export const loadingTextVariants: Variants = {
  initial: { 
    opacity: 0,
    y: 5
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: { 
      duration: LOADING_ANIMATION_CONFIG.duration.normal,
      ease: LOADING_ANIMATION_CONFIG.ease.default
    }
  }
}

// CSS 類動畫對應表
export const CSS_ANIMATIONS = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  expand: 'animate-expand',
  pulse: 'animate-pulse'
}

// CSS 延遲類對應表
export const CSS_DELAYS = {
  100: 'delay-100',
  200: 'delay-200',
  300: 'delay-300',
  400: 'delay-400',
  500: 'delay-500'
}

// 設置CSS動畫樣式的輔助函數
export const getCssAnimation = (
  animation: keyof typeof CSS_ANIMATIONS, 
  delay?: keyof typeof CSS_DELAYS
) => {
  return delay 
    ? `${CSS_ANIMATIONS[animation]} ${CSS_DELAYS[delay]}` 
    : CSS_ANIMATIONS[animation]
}

// 淡入上升動畫
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: defaultEasing
    }
  }
}

// 淡入下降動畫
export const fadeInDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: defaultEasing
    }
  }
}

// 淡入左側動畫
export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: defaultEasing
    }
  }
}

// 淡入右側動畫
export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: defaultEasing
    }
  }
}

// 放大淡入動畫
export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: defaultEasing
    }
  }
}

// 連續動畫（用於列表項目）
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// 子元素動畫
export const childFadeIn: Variants = {
  hidden: { 
    opacity: 0, 
    y: 10 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: defaultEasing
    }
  }
}

// 滑入動畫
export const slideIn: Variants = {
  hidden: { 
    opacity: 0, 
    x: -10 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: defaultEasing
    }
  }
}

// 向上滑動動畫
export const slideUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: defaultEasing
    }
  }
}

// 標籤懸停動畫
export const tagHover: Variants = {
  initial: { 
    scale: 1,
    borderWidth: '1px'
  },
  hover: { 
    scale: 1.05, 
    borderWidth: '2px',
    transition: { 
      duration: 0.2,
      ease: defaultEasing
    }
  }
}

// 底線展開動畫
export const underlineExpand: Variants = {
  initial: { width: '60px' },
  hover: { 
    width: '100px',
    transition: { 
      duration: 0.3,
      ease: defaultEasing 
    }
  }
}

// 文字陰影效果
export const TEXT_SHADOWS = {
  light: 'text-shadow-light',
  medium: 'text-shadow-medium',
  strong: 'text-shadow-strong'
}

// 頁面轉場動畫
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8 
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: LOADING_ANIMATION_CONFIG.duration.normal,
      ease: LOADING_ANIMATION_CONFIG.ease.default,
      staggerChildren: LOADING_ANIMATION_CONFIG.staggerChildren,
      delayChildren: LOADING_ANIMATION_CONFIG.delayChildren
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: LOADING_ANIMATION_CONFIG.duration.fast,
      ease: LOADING_ANIMATION_CONFIG.ease.default
    }
  }
}

// 滾動觸發動畫
export const scrollAnimation = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: defaultEasing }
}

// 根據陣列項目順序生成依序出現動畫
export const createStaggeredEntrance = (
  items: any[], 
  baseDelay: number = 0.3, 
  increment: number = 0.1
) => {
  return items.map((_, index) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { 
      delay: baseDelay + (index * increment),
      duration: 0.5
    }
  }))
}

// 動畫輔助工具：根據條件自動添加動畫類
export const getAnimationClasses = (options: {
  type?: keyof typeof CSS_ANIMATIONS,
  delay?: keyof typeof CSS_DELAYS,
  textShadow?: keyof typeof TEXT_SHADOWS,
  additionalClasses?: string
}) => {
  const { type, delay, textShadow, additionalClasses = '' } = options
  const classes = []
  
  if (type) {
    classes.push(CSS_ANIMATIONS[type])
  }
  
  if (delay) {
    classes.push(CSS_DELAYS[delay])
  }
  
  if (textShadow) {
    classes.push(TEXT_SHADOWS[textShadow])
  }
  
  if (additionalClasses) {
    classes.push(additionalClasses)
  }
  
  return classes.join(' ')
}

// 添加按鈕動畫效果
export const buttonAnimations = {
  // 基本按鈕懸停效果
  basic: {
    initial: { scale: 1 },
    hover: { 
      scale: 1.03,
      transition: { duration: 0.2, ease: defaultEasing }
    },
    tap: { 
      scale: 0.97,
      transition: { duration: 0.1, ease: defaultEasing }
    }
  },
  
  // 扁平按鈕懸停效果 - 無縮放但有邊框變化
  flat: {
    initial: { 
      borderWidth: '1px',
      y: 0
    },
    hover: { 
      y: -2,
      boxShadow: '0 2px 0 rgba(0,0,0,0.1)',
      transition: { duration: 0.2, ease: defaultEasing }
    },
    tap: { 
      y: 0,
      boxShadow: '0 0px 0 rgba(0,0,0,0.1)',
      transition: { duration: 0.1, ease: defaultEasing }
    }
  },
  
  // 邊框閃爍效果
  pulse: {
    initial: { 
      borderColor: 'rgba(255,255,255,0.8)'
    },
    animate: {
      borderColor: ['rgba(255,255,255,0.8)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.8)'],
      transition: { 
        duration: 1.5, 
        repeat: Infinity,
        ease: defaultEasing 
      }
    }
  },
  
  // 箭頭動畫效果
  arrow: {
    initial: { x: 0 },
    hover: { 
      x: 5,
      transition: { 
        duration: 0.3, 
        ease: defaultEasing,
        repeat: Infinity,
        repeatType: 'reverse'
      }
    }
  }
};

// 標題動畫變體
export const headingVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: LOADING_ANIMATION_CONFIG.duration.normal,
      ease: LOADING_ANIMATION_CONFIG.ease.default
    }
  }
}

// 子元素動畫變體
export const childVariants: Variants = {
  initial: {
    opacity: 0,
    y: 15
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: LOADING_ANIMATION_CONFIG.duration.normal,
      ease: LOADING_ANIMATION_CONFIG.ease.default
    }
  }
}

// 標準動畫轉換配置
export const defaultTransition: Transition = {
  type: 'tween',
  ease: LOADING_ANIMATION_CONFIG.ease.default,
  duration: LOADING_ANIMATION_CONFIG.duration.normal
}

// 高效能滾動動畫配置
export const scrollAnimationConfig = {
  transformTemplate: (transformProps: string) => `translateY(${transformProps})`,
  style: { willChange: 'transform, opacity' }
}

// 彈跳動畫變體
export const bounceVariants: Variants = {
  initial: { 
    opacity: 0,
    scale: 0.9,
    y: 10
  },
  animate: {
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  },
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.97
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: LOADING_ANIMATION_CONFIG.duration.fast
    }
  }
}

// 從下方滑入動畫變體
export const slideUpVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: LOADING_ANIMATION_CONFIG.duration.normal,
      ease: LOADING_ANIMATION_CONFIG.ease.default
    }
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: LOADING_ANIMATION_CONFIG.duration.fast,
      ease: LOADING_ANIMATION_CONFIG.ease.default
    }
  }
}

// 高效能滑入動畫
export const optimizedSlideUpVariants: Variants = {
  ...slideUpVariants,
  ...scrollAnimationConfig
}

// 高性能彈跳動畫
export const optimizedBounceVariants: Variants = {
  ...bounceVariants,
  ...scrollAnimationConfig
}

// HeroSection 標題輪換動畫
export const heroTitleVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut",
    }
  },
  exit: { 
    opacity: 0, 
    y: -15,
    transition: { duration: 0.3 }
  }
};

// 英文標語切換動畫
export const heroSubtitleVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 15 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: 0.1,
      duration: 0.4,
      ease: "easeOut",
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.3 }
  }
};

// 數字統計動畫配置
export const statsNumberVariants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { 
    type: "spring", 
    stiffness: 260, 
    damping: 20
  }
}

// CountUp 組件配置
export const countUpConfig = {
  // 客戶滿意度
  satisfaction: {
    start: 0,
    end: 98,
    duration: 2.5,
    delay: 1.2,
    suffix: "%",
    decimals: 0,
    useEasing: true
  },
  // 成功案例
  cases: {
    start: 0,
    end: 50,
    duration: 2.5,
    delay: 1.3,
    suffix: "+",
    decimals: 0,
    useEasing: true
  },
  // 專業響應
  response: {
    start: 0,
    end: 24,
    duration: 2.5,
    delay: 1.4,
    suffix: "hr",
    decimals: 0,
    useEasing: true
  }
}

// MarketingStatement 階梯式文案動畫
export const marketingStatementVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5, 
      ease: "easeOut"
    }
  }
};

// 分隔線展開動畫
export const dividerExpandVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { 
    scaleX: 1, 
    opacity: 0.3,
    transition: { 
      duration: 0.8
    }
  }
}

// 分隔線光效動畫
export const dividerGlowVariants: Variants = {
  hidden: { x: "-100%" },
  visible: { 
    x: "400%",
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatDelay: 4
    }
  }
}

// Feature 卡片懸停效果
export const featureCardVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4
    }
  },
  hover: { 
    y: -3,
    boxShadow: "0 8px 20px -8px rgba(0, 0, 0, 0.1)",
    borderColor: "rgba(var(--color-primary-rgb), 1)",
    transition: { 
      duration: 0.2
    }
  }
};

// Feature 圖標動畫
export const featureIconVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 200,
      damping: 10
    }
  },
  hover: {
    rotate: [0, 5, -5, 0],
    scale: 1.1,
    transition: {
      duration: 0.5
    }
  }
}

// 底部指示箭頭動畫
export const scrollIndicatorVariants = {
  animate: { 
    y: [0, 6, 0],
    transition: { 
      duration: 1.2, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  }
};

// 卡片懸停效果
export const cardHoverVariants: Variants = {
  initial: { 
    scale: 1 
  },
  hover: { 
    scale: 1.02,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    transition: { 
      duration: 0.2 
    } 
  },
  tap: { 
    scale: 0.98 
  }
}

// 案例研究卡片動畫
export const caseCardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  hover: {
    y: -10,
    boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)",
    transition: { 
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

// 案例詳情頁面切換動畫
export const caseDetailVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      delay: 0.1,
      duration: 0.5 
    }
  }
}

// FAQ 區塊動畫
export const faqContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

// FAQ 項目動畫
export const faqItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3
    }
  }
}

// FAQ 展開/收合動畫
export const faqContentVariants: Variants = {
  collapsed: { 
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: "easeInOut"
    }
  },
  expanded: { 
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: "easeInOut"
    }
  }
}

// 聯絡表單動畫
export const contactFormVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

// 表單輸入欄位動畫
export const formInputVariants: Variants = {
  initial: { borderColor: "transparent" },
  focus: { 
    borderColor: "rgba(var(--color-primary-rgb), 1)",
    backgroundColor: "rgba(var(--color-primary-rgb), 0.05)",
    transition: { duration: 0.2 }
  },
  success: {
    borderColor: "rgba(34, 197, 94, 1)",
    transition: { duration: 0.2 }
  },
  error: {
    borderColor: "rgba(239, 68, 68, 1)",
    x: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.4 }
  }
}

// 按鈕動畫效果
export const buttonVariants: Variants = {
  initial: {
    scale: 1
  },
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.2,
      ease: LOADING_ANIMATION_CONFIG.ease.default
    }
  },
  tap: {
    scale: 0.97
  }
}

// 標籤動畫效果 (從 HomePage 整合)
export const tagAnimationVariants: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: (index: number = 0) => ({ 
    opacity: 1, 
    x: 0,
    transition: { 
      delay: 0.3 + Math.min(index, 2) * 0.08, // 限制最多延遲時間，提高移動端效能
      duration: 0.3 
    }
  }),
  hover: {
    backgroundColor: "rgba(255,255,255,0.15)",
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

// 更新標籤動畫配置 (適用於不同顏色的標籤)
export const createTagAnimations = (isLight: boolean = true) => {
  const hoverBgColor = isLight 
    ? "rgba(255,255,255,0.15)" 
    : "rgba(var(--color-primary-rgb), 0.05)";
    
  return {
    initial: { opacity: 0, x: -10 },
    animate: (index: number = 0) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: 0.2 + index * 0.1, 
        duration: 0.4 
      }
    }),
    hover: {
      backgroundColor: hoverBgColor,
      y: -2,
      transition: { duration: 0.2 }
    }
  };
};

// 按鈕懸停動畫 (從 HomePage 整合)
export const buttonHoverVariants: Variants = {
  initial: { y: 0 },
  hover: { 
    y: -3,
    boxShadow: '0 3px 0 rgba(255,255,255,0.3)',
    transition: { duration: 0.2 }
  },
  tap: { 
    y: 0,
    boxShadow: '0 0px 0 rgba(255,255,255,0)',
    transition: { duration: 0.1 }
  }
}

// 箭頭圖標動畫 (從 HomePage 整合)
export const arrowIconVariants: Variants = {
  initial: { x: 0 },
  animate: { 
    x: [0, 5, 0],
    transition: { 
      duration: 2, 
      repeat: Infinity 
    }
  }
}

// AnimatedSection 動畫區塊配置
export const animatedSectionVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 30 
  },
  animate: (delay: number = 0) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      delay: delay * 0.2,
      ease: defaultEasing
    }
  })
}

/**
 * 創建統一的 AnimatedSection 配置
 * 用於替換各頁面中重複的 AnimatedSection 組件邏輯
 */
export const createAnimatedSection = () => {
  return {
    initial: { opacity: 0, y: 30 },
    animate: (controls: any, inView: boolean, delay: number = 0) => {
      if (inView) {
        controls.start({ 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, delay: delay * 0.2 }
        });
      }
    }
  };
}

// 整合兼容性配置（與現有代碼兼容）
export const animations = {
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: defaultEasing
      }
    },
    // 兼容舊格式
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: defaultEasing }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: defaultEasing
      }
    },
    // 兼容舊格式
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: defaultEasing }
  },
  slideIn: {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: defaultEasing
      }
    },
    // 兼容舊格式
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, ease: defaultEasing }
  },
  slideUp,
  staggerContainer,
  stagger: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    },
    // 兼容舊格式
    initial: {},
    animate: { transition: { staggerChildren: 0.1 } }
  },
  // 新增標籤動畫
  tagHover,
  underlineExpand,
  // 添加 CSS 動畫辭典
  css: CSS_ANIMATIONS,
  delays: CSS_DELAYS,
  textShadows: TEXT_SHADOWS,
  getClasses: getAnimationClasses,
  getCssAnimation,
  // 新增按鈕動畫
  button: buttonAnimations,
  // 文字漸顯動畫 - 逐字母/逐詞顯示效果
  textReveal: {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: defaultEasing
      }
    })
  },
  // 邊框展開動畫
  borderExpand: {
    hidden: { 
      width: '0%',
      opacity: 0 
    },
    visible: { 
      width: '100%',
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: defaultEasing
      }
    }
  },
  // 交互反饋動畫
  feedback: {
    success: { 
      scale: [1, 1.1, 1],
      backgroundColor: ['transparent', 'rgba(34, 197, 94, 0.2)', 'transparent'],
      transition: { duration: 0.6 }
    },
    error: { 
      x: [0, -10, 10, -10, 10, 0],
      backgroundColor: ['transparent', 'rgba(239, 68, 68, 0.2)', 'transparent'],
      transition: { duration: 0.6 }
    }
  },
  // 通用動畫
  common: {
    button: buttonAnimations,
    card: cardHoverVariants,
    createTagAnimations: createTagAnimations,
    bounce: bounceVariants,
    slideUp: slideUpVariants,
    optimizedSlideUp: optimizedSlideUpVariants
  }
};

// 整合首頁所有動畫，用於統一管理和調用
export const homePageAnimations = {
  // HeroSection 動畫
  hero: {
    title: heroTitleVariants,
    subtitle: heroSubtitleVariants,
    stats: statsNumberVariants,
    countUp: countUpConfig,
    scrollIndicator: scrollIndicatorVariants,
    tag: tagAnimationVariants,
    button: buttonHoverVariants,
    arrow: arrowIconVariants
  },
  
  // MarketingStatement 動畫
  marketing: {
    statement: marketingStatementVariants,
    divider: {
      expand: dividerExpandVariants,
      glow: dividerGlowVariants
    }
  },
  
  // Feature Section 動畫
  feature: {
    card: featureCardVariants,
    icon: featureIconVariants,
  },
  
  // Case Studies 動畫
  case: {
    card: caseCardVariants,
    detail: caseDetailVariants
  },
  
  // FAQ 動畫
  faq: {
    container: faqContainerVariants,
    item: faqItemVariants,
    content: faqContentVariants
  },
  
  // 聯絡表單動畫
  contact: {
    form: contactFormVariants,
    input: formInputVariants
  },
  
  // 通用動畫
  common: {
    button: buttonVariants,
    card: cardHoverVariants,
    createTagAnimations: createTagAnimations,
    bounce: bounceVariants,
    slideUp: slideUpVariants,
    optimizedSlideUp: optimizedSlideUpVariants
  }
}

// 案例相關動畫配置
export const caseAnimations = {
  // 案例卡片動畫
  card: {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  },

  // 案例詳情動畫
  detail: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  },

  // 案例圖片動畫
  image: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3
      }
    }
  },

  // 案例時間軸動畫
  timeline: {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  },

  // 案例見證動畫
  testimonial: {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  },

  // 案例相關動畫
  related: {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  },

  // 案例畫廊動畫
  gallery: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  },

  // 案例畫廊圖片動畫
  galleryImage: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  },

  // 案例畫廊模態框動畫
  galleryModal: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  }
} as const 