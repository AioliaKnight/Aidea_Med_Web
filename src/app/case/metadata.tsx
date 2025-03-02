import { Metadata } from 'next'
import { generateCasePageMetadata } from '@/components/pages/CasePage'

// 使用集中式的 metadata 生成函數，保持一致性
const metadata: Metadata = generateCasePageMetadata();

export default metadata 