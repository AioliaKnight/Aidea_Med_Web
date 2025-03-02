'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { caseStudies, CaseStudy, generateCaseStudyMetadata } from '@/components/pages/CasePage'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import Script from 'next/script'

// 簡化動畫變體
const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}

// 滑入動畫變體
const slideIn = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3 }
}

// 生成解決方案描述的輔助函數
function generateSolutionDescription(index: number, clinicName: string): string {
  const descriptions = [
    `為${clinicName}建立清晰的品牌定位和一致的視覺識別系統，從診所空間設計到線上形象，創造專業且現代化的品牌體驗。`,
    `針對目標客群偏好，優化社群媒體策略，持續創建高品質的衛教內容，增強診所專業形象與患者互動。`,
    `導入數位化管理系統，提升診所運營效率，優化患者就醫體驗，建立長期忠誠度與口碑推薦系統。`
  ]
  
  return descriptions[index % descriptions.length]
}

// 解決方案介面定義
interface Solution {
  title: string;
  description: string;
}

export default function CaseDetail() {
  const params = useParams()
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null)
  const [relatedCases, setRelatedCases] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [structuredData, setStructuredData] = useState<string>('')
  const [solutions, setSolutions] = useState<Solution[]>([])

  useEffect(() => {
    // 根據 ID 查找案例
    const id = params.id
    if (typeof id === 'string') {
      const foundCase = caseStudies.find(c => c.id === id)
      if (foundCase) {
        setCaseStudy(foundCase)
        
        // 處理解決方案
        if (foundCase.solutions) {
          const formattedSolutions = foundCase.solutions.map((solution: any, index) => {
            if (typeof solution === 'object' && solution.title && solution.description) {
              return solution as Solution;
            } else {
              return {
                title: typeof solution === 'string' ? solution : `解決方案 ${index + 1}`,
                description: generateSolutionDescription(index, foundCase.name)
              };
            }
          });
          setSolutions(formattedSolutions);
        }
        
        // 尋找相同類別的其他案例
        const related = caseStudies
          .filter(c => c.id !== id && c.category === foundCase.category)
          .slice(0, 3)
        setRelatedCases(related)
        
        // 使用共用函數設定結構化數據，保持一致性
        const schemaData = generateCaseStudyMetadata(foundCase)
        setStructuredData(JSON.stringify(schemaData))
        
        // 動態設置文檔標題
        document.title = `${foundCase.name} - ${foundCase.category}成功案例 | Aidea:Med 牙醫行銷專家`;
      }
    }
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!caseStudy) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-6 font-gothic">案例不存在</h1>
          <p className="mb-8">抱歉，您尋找的案例不存在或已被移除。</p>
          <Link href="/case">
            <span className="inline-flex items-center bg-primary text-white px-6 py-3">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              返回案例列表
            </span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 結構化數據 */}
      {structuredData && (
        <Script id="case-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      )}
      
      <main className="min-h-screen pt-24 pb-20 bg-white">
        <div className="container mx-auto px-4">
          {/* 返回按鈕 */}
          <motion.div 
            {...slideIn}
            className="mb-12"
          >
            <Link href="/case">
              <span className="inline-flex items-center text-gray-600 hover:text-primary transition-colors group">
                <ArrowLeftIcon className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                返回案例列表
              </span>
            </Link>
          </motion.div>

          {/* 案例標題區域 - 扁平現代設計 */}
          <div className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 標題內容 */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-5 order-2 lg:order-1"
            >
              <div className="inline-block px-4 py-1 border-l-2 border-primary text-gray-700 text-sm font-gothic font-medium mb-4">
                {caseStudy.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-gothic">{caseStudy.name}</h1>
              <p className="text-xl text-gray-600">
                {caseStudy.description}
              </p>
            </motion.div>

            {/* 視覺區域 - 扁平設計視覺 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 order-1 lg:order-2"
            >
              <div 
                className="relative overflow-hidden aspect-video"
                style={{ background: 'rgba(255, 0, 0, 0.9)' }} // 使用網站紅色
              >
                {/* 扁平幾何設計元素 */}
                <div className="absolute inset-0">
                  <div className="absolute top-[10%] right-[5%] w-24 h-24 opacity-20 bg-white"></div>
                  <div className="absolute bottom-[15%] left-[10%] w-40 h-10 opacity-10 bg-black"></div>
                  <div className="absolute top-[40%] right-[30%] w-16 h-16 opacity-15 bg-white"></div>
                </div>
                
                {/* 主要視覺內容 */}
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center z-10">
                    <div className="text-7xl font-bold mb-2 font-gothic">{caseStudy.metrics[0].value}</div>
                    <div className="text-xl font-medium">{caseStudy.metrics[0].label}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 指標區塊 - 現代平面化設計 */}
          <motion.section 
            {...fadeIn}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-10 font-gothic text-center">實際成效指標</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {caseStudy.metrics.map((metric, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white p-8 shadow-sm border border-gray-100"
                >
                  <div className="text-5xl font-bold mb-2 text-primary font-gothic">{metric.value}</div>
                  <div className="text-xl text-gray-700">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* 解決方案 - 扁平現代設計 */}
          <motion.section 
            {...fadeIn}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-10 font-gothic text-center">我們的解決方案</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {solutions.map((solution, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                >
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-none bg-primary text-white flex items-center justify-center text-xl font-bold mr-4">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold">{solution.title}</h3>
                  </div>
                  <p className="text-gray-600 ml-14">{solution.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* 客戶評價 - 扁平現代設計 */}
          <motion.section 
            {...fadeIn}
            className="mb-20 bg-gray-50 p-10"
          >
            <h2 className="text-3xl font-bold mb-10 font-gothic text-center">客戶評價</h2>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="text-6xl text-primary opacity-20 absolute -top-6 left-0">&ldquo;</div>
                <p className="text-xl text-gray-700 mb-6 relative z-10 pl-8">
                  透過 Aidea:Med 牙醫行銷專家的專業服務，我們診所的網路曝光度大幅提升，預約率增加了 {caseStudy.metrics[0].value}。他們的團隊非常專業且積極回應我們的需求，提供客製化的行銷策略，讓我們的數位轉型更加順利。
                </p>
                <div className="text-6xl text-primary opacity-20 absolute bottom-0 right-0">&rdquo;</div>
                <div className="text-right">
                  <div className="font-bold">{caseStudy.name} 負責人</div>
                  <div className="text-gray-500 text-sm">{caseStudy.category}</div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 號召行動區塊 - 扁平現代設計 */}
          <motion.section 
            {...fadeIn}
            className="mb-20 bg-black text-white p-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-4 font-gothic">想為您的診所打造專屬數位行銷策略？</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              立即與我們聯繫，獲取專業諮詢與量身定制的行銷方案，讓您的診所在數位時代脫穎而出。
            </p>
            <Link href="/contact">
              <span className="inline-block bg-primary text-white px-8 py-4 text-lg font-medium">
                立即諮詢
              </span>
            </Link>
          </motion.section>

          {/* 相關案例推薦 */}
          {relatedCases.length > 0 && (
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <h2 className="text-3xl font-bold mb-10 font-gothic">相關案例推薦</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedCases.map((relatedCase, index) => (
                  <motion.div 
                    key={relatedCase.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border border-gray-100 hover:shadow-md transition-shadow duration-200"
                  >
                    <Link href={`/case/${relatedCase.id}`}>
                      <div className="aspect-video bg-gray-100 relative overflow-hidden">
                        <div 
                          className="absolute inset-0" 
                          style={{ 
                            background: relatedCase.color || 'rgba(255, 0, 0, 0.9)', 
                            opacity: 0.9 
                          }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-4xl font-bold font-gothic">{relatedCase.metrics[0].value}</div>
                            <div className="text-sm">{relatedCase.metrics[0].label}</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-sm text-gray-500 mb-2">{relatedCase.category}</div>
                        <h3 className="text-xl font-bold mb-3 font-gothic">{relatedCase.name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{relatedCase.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>
    </>
  )
} 