import { Variants } from 'framer-motion'

// 基本動畫變體定義
const defaultEasing = [0.6, 0.05, 0.01, 0.9]

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
  }
} as const; 