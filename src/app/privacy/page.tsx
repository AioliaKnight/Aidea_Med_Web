import { privacyMetadata, privacyBreadcrumbSchema } from '../metadata'
import PrivacyPage from '@/components/pages/PrivacyPage'
import Script from 'next/script'

export const metadata = privacyMetadata

export default function Page() {
  return (
    <>
      <Script
        id="privacy-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(privacyBreadcrumbSchema)
        }}
      />
      <PrivacyPage />
    </>
  )
} 