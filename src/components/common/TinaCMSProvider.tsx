'use client'

import { TinaEditProvider } from 'tinacms/dist/edit-state'

interface TinaCMSProviderProps {
  children: React.ReactNode
}

export function TinaCMSProvider({ children }: TinaCMSProviderProps) {
  return (
    <TinaEditProvider
      editMode={
        <div className="relative">
          {children}
        </div>
      }
    >
      <div className="relative">
        {children}
      </div>
    </TinaEditProvider>
  )
} 