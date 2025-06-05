'use client'

import React, { useState, useCallback, useMemo, memo } from 'react'
import { motion } from 'framer-motion'

// FAQ項目接口
export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

// FAQ區塊屬性
export interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  showCategoryFilter?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  backgroundColor?: 'white' | 'gray' | 'primary';
  className?: string;
}

/**
 * 通用 FAQ 組件
 * 可重用於任何頁面，支援分類過濾和自定義樣式
 */
export const FAQSection = memo<FAQSectionProps>(function FAQSection({
  title = "常見問題",
  subtitle = "我們整理了常見問題，協助您更了解我們的服務",
  faqs,
  showCategoryFilter = true,
  maxWidth = 'lg',
  backgroundColor = 'gray',
  className = ''
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // 定義FAQ分類
  const categories = useMemo(() => {
    if (!showCategoryFilter) return [];
    const categorySet = new Set(
      faqs
        .map(faq => faq.category)
        .filter((category): category is string => Boolean(category))
    );
    return ['全部問題', ...Array.from(categorySet)];
  }, [faqs, showCategoryFilter]);
  
  const [activeCategory, setActiveCategory] = useState('全部問題');
  
  // 過濾FAQ
  const filteredFaqs = useMemo(() => {
    if (!showCategoryFilter || activeCategory === '全部問題') {
      return faqs;
    }
    return faqs.filter(faq => faq.category && faq.category === activeCategory);
  }, [faqs, activeCategory, showCategoryFilter]);
  
  // 切換FAQ開關狀態
  const toggleFaq = useCallback((id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  }, [openFaq]);

  // 處理分類切換
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    setOpenFaq(null);
  }, []);
  
  // 格式化FAQ答案，處理換行
  const formatAnswer = useCallback((answer: string) => {
    // 根據雙換行符分割段落
    const paragraphs = answer.split('\n\n');
    
    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, idx) => {
          // 如果段落包含列表項目（以"- "開頭的行）
          if (paragraph.includes('\n- ')) {
            const [listTitle, ...listItems] = paragraph.split('\n- ');
            return (
              <div key={idx} className="space-y-2">
                <p className="font-medium text-gray-800">{listTitle}</p>
                <ul className="list-disc list-outside ml-5 space-y-1.5">
                  {listItems.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-gray-600 text-sm sm:text-base leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
            );
          }
          // 一般段落
          return <p key={idx} className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">{paragraph}</p>;
        })}
      </div>
    );
  }, []);

  // 獲取背景樣式
  const getBackgroundStyle = () => {
    switch (backgroundColor) {
      case 'white':
        return 'bg-white';
      case 'primary':
        return 'bg-primary text-white';
      case 'gray':
      default:
        return 'bg-gray-50';
    }
  };

  // 獲取最大寬度樣式
  const getMaxWidthStyle = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-2xl';
      case 'md': return 'max-w-4xl';
      case 'lg': return 'max-w-6xl';
      case 'xl': return 'max-w-7xl';
      case '2xl': return 'max-w-screen-2xl';
      case 'full': return 'max-w-full';
      default: return 'max-w-6xl';
    }
  };

  // 獲取文字顏色
  const getTextColor = () => {
    return backgroundColor === 'primary' ? 'text-white' : 'text-gray-900';
  };
  
  return (
    <section className={`py-16 md:py-24 px-4 ${getBackgroundStyle()} ${className}`}>
      <div className={`container-custom ${getMaxWidthStyle()} mx-auto`}>
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold ${getTextColor()} mb-4`}>
            {title}
          </h2>
          <p className={`text-xl ${backgroundColor === 'primary' ? 'text-white/90' : 'text-gray-600'} max-w-3xl mx-auto`}>
            {subtitle}
          </p>
        </div>
        
        {/* 類別選擇器 */}
        {showCategoryFilter && categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-md'
                    : backgroundColor === 'primary' 
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
        
        {/* FAQ列表 */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredFaqs.map((faq, index) => (
            <div 
              key={index}
              className={`${
                backgroundColor === 'primary' 
                  ? 'bg-white/10 backdrop-blur-sm' 
                  : 'bg-white'
              } rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className={`w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  backgroundColor === 'primary' ? 'focus:bg-white/5' : 'focus:bg-gray-50'
                }`}
              >
                <h3 className={`font-semibold text-base sm:text-lg pr-8 ${
                  backgroundColor === 'primary' ? 'text-white' : 'text-gray-900'
                }`}>
                  {faq.question}
                </h3>
                <div className={`transform transition-transform duration-300 ${
                  openFaq === index ? 'rotate-180' : ''
                }`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${backgroundColor === 'primary' ? 'text-white' : 'text-primary'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              
              {/* 答案區塊 */}
              {openFaq === index && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`px-6 pb-6 pt-2 ${
                    backgroundColor === 'primary' 
                      ? 'border-t border-white/20' 
                      : 'border-t border-gray-100'
                  }`}
                >
                  <div className={backgroundColor === 'primary' ? 'text-white/90' : ''}>
                    {formatAnswer(faq.answer)}
                  </div>
                  <div className={`mt-4 pt-3 ${
                    backgroundColor === 'primary' 
                      ? 'border-t border-white/20 text-white/70' 
                      : 'border-t border-gray-100 text-gray-500'
                  } text-sm`}>
                    <p>還有其他問題？
                      <a 
                        href="/contact" 
                        className={`${
                          backgroundColor === 'primary' 
                            ? 'text-white hover:underline' 
                            : 'text-primary hover:underline'
                        } ml-1`}
                      >
                        聯絡我們
                      </a>
                      獲取專業建議
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}); 