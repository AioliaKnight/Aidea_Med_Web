import { serviceMetadata } from '../metadata'
import ServicePage from '@/components/pages/ServicePage'
import { brandingWebsiteSchema, medicalServicesFaq } from '../metadata'

export const metadata = serviceMetadata

export default function Page() {
  return (
    <>
      <ServicePage />
      
      {/* 服務頁面的結構化數據 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandingWebsiteSchema) }}
      />
      
      {/* 服務頁面的FAQ結構化數據 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalServicesFaq) }}
      />
    </>
  )
} 