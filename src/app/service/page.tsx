import { serviceMetadata } from '../metadata'
import ServicePage from '@/components/pages/ServicePage'

export const metadata = serviceMetadata

export default function Page() {
  return (
    <>
      <ServicePage />
    </>
  )
} 