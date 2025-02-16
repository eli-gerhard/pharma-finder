'use client';

import Link from 'next/link'
import Header from '@/components/ui/Header'
import { useState, useEffect } from 'react'

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 650)
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
    <Header />
    <main className="p-4 flex justify-center mt-16">
      <div className={`max-w-7xl ${isMobile ? 'flex-col' : 'flex'} items-center`}>
        <div className={`${isMobile ? 'w-full text-center' : 'w-1/2'} px-4`}>
          <div className="text-5xl px-4">
            Helping you navigate medication shortages
          </div>
          <div className="text-sm px-4 mt-4">
            Crowdsourcing which pharmacies have your medication in stock
          </div>
        </div>

        <div className={`${isMobile ? 'w-full mt-8' : 'w-1/2'} flex flex-col items-center justify-center gap-2`}>
          <div className="text-sm text-center">
            Support others looking for their medication
          </div>
          <Link 
            href="/entry" 
            className="px-4 py-2 mt-0 w-56 text-center bg-[var(--popup)] border border-[var(--puborder)] rounded-lg hover:bg-[var(--hover)]"
          >
            Enter Medication Pickup
          </Link>
          <div className="text-sm mt-6 text-center">
            Having trouble finding your medication?
          </div>
          <Link 
            href="/search" 
            className="px-4 py-2 w-56 text-center bg-[var(--popup)] border border-[var(--puborder)] rounded-lg hover:bg-[var(--hover)]"
          >
            Find Nearby Medication
          </Link>
        </div>
      </div>
    </main>
    </>
  )
}