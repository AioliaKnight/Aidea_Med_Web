import { serviceMetadata } from '../metadata'
import ServicePage from '@/components/pages/ServicePage'
import { BreadcrumbNav } from '@/components/common'

export const metadata = serviceMetadata

export default function Page() {
  return (
    <>
      <div className="container mx-auto px-4 pt-16">
        <BreadcrumbNav 
          className="mb-3" 
          includeJsonLd={true}
        />
      </div>
      <ServicePage />
    </>
  )
} 