'use client'

import { SoundManager } from '@/components/SoundManager'
import { CasinoBottomNav } from '@/components/CasinoNav'

export default function CasinoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SoundManager>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        {children}
        <CasinoBottomNav />
      </div>
    </SoundManager>
  )
}
