import { Variants } from 'framer-motion'

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
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: defaultEasing }
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
  }
}; 