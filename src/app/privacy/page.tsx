import { privacyMetadata, privacyBreadcrumbSchema } from '../metadata'
import PrivacyPage from '@/components/pages/PrivacyPage'
import Script from 'next/script'

export const metadata = privacyMetadata

// 擴展隱私權政策頁面結構化資料
const enhancedStructuredData = {
  ...privacyBreadcrumbSchema,
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': '牙醫診所行銷顧問的隱私權政策',
  'description': '了解Aidea:Med醫療行銷顧問如何在提供牙醫診所行銷服務時保護您的診所資料安全',
  'specialty': [
    '牙醫診所行銷',
    '醫療行銷隱私保護',
    '診所數位行銷',
    '醫師個人品牌',
    '植牙診所行銷',
    '診所SEO優化',
    '矯正牙科行銷'
  ],
  'mainContentOfPage': {
    '@type': 'WebPageElement',
    'about': {
      '@type': 'Thing',
      'name': '醫療行銷資料保護政策'
    }
  },
  'relatedLink': [
    'https://www.aideamed.com/service',
    'https://www.aideamed.com/contact',
    'https://www.aideamed.com/team'
  ]
}

export default function Page() {
  return (
    <>
      <Script
        id="privacy-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(enhancedStructuredData)
        }}
      />
      <PrivacyPage />
    </>
  )
} 