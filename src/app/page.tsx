'use client';

import Link from 'next/link'
import Header from '@/components/ui/Header'
import { useState, useEffect } from 'react'
import { TextSearch, PillBottle, Users } from 'lucide-react';

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
    <main className="p-4 flex flex-col justify-center items-center mt-16">
      <div className={`max-w-7xl ${isMobile ? 'flex-col' : 'flex'} items-center`}>
        <div className={`${isMobile ? 'w-full text-center border-b border-[var(--puborder)] pb-8 pt-8' : 'w-1/2'} px-4`}>
          <div className="text-5xl px-4">
            Helping you navigate medication shortages
          </div>
          <div className="text-sm px-4 mt-8">
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
      <div className="text-3xl px-4 text-center mt-48 mb-8">
        How it works
      </div>
      <div className={`max-w-7xl ${isMobile ? 'flex-col' : 'flex'} items-start`}>
        <div className={`${isMobile ? 'w-full border-b border-[var(--puborder)] pb-8 pt-8' : 'w-1/2'} flex flex-col items-center text-center px-4`}>
          <TextSearch size={32} color="var(--accent)" className="mb-2" />
          <span className="text-lg text-center mb-2 text-[var(--accent)]">Faster Searching</span>
          <span className="text-sm text-center">InStockMed shows you where your medication was filled recently, saving you search time</span>
        </div>
        <div className={`${isMobile ? 'w-full border-b border-[var(--puborder)] pb-8 pt-8' : 'w-1/2'} flex flex-col items-center text-center px-4`}>
          <PillBottle size={32} color="green" className="mb-2" />
          <span className="text-lg text-center mb-2 text-green-600">Fill The Prescription</span>
          <span className="text-sm text-center">Confirm the stock with the pharmacy, and fill your prescription</span>
        </div>
        <div className={`${isMobile ? 'w-full border-b border-[var(--puborder)] pb-8 pt-8' : 'w-1/2'} flex flex-col items-center text-center px-4`}>
          <Users size={32} color="var(--accent)" className="mb-2" />
          <span className="text-lg text-center mb-2 text-[var(--accent)]">Crowd Sourced Info</span>
          <span className="text-sm text-center">After your prescription is filled, enter the details on InStockMed to help others</span>
        </div>
      </div>
    </main>
    </>
  )
}