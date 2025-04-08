import { caseStudies } from '@/data/cases'
import { generateCaseMetadata } from '@/components/pages/CasePage'

// 使用統一的 metadata 生成函數
export default function generateMetadata({ params }) {
  const id = params.id
  const caseStudy = caseStudies.find(c => c.id === id) || {
    id: 'default',
    name: '案例分享',
    category: '數位行銷',
    description: '牙醫診所數位行銷成功案例',
    metrics: [{ value: '0%', label: '成效' }]
  }

  // 使用集中式 metadata 生成函數 - 使用 generateCaseMetadata 而不是 generateCaseStudyMetadata
  return generateCaseMetadata(caseStudy);
} 