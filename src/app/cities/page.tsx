'use client';

import Header from '@/components/ui/Header'
import { useState, useEffect } from 'react'
import { Building2, Hourglass } from 'lucide-react';

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
      <div className={`min-w-96 max-w-7xl ${isMobile ? 'flex-col' : 'flex'} items-center`}>
        <div className={`${isMobile ? 'w-full text-center border-b border-[var(--puborder)] pb-8 pt-8' : 'w-full'} px-4`}>
          <div className={`text-3xl font-semibold text-[var(--accent)] pb-2 flex items-center ${isMobile ? 'justify-center' : 'flex'}`}>
            <Building2 size={30} color="var(--accent)" className="mr-2" /> Current Cities
          </div>
          <ul className="space-y-1">
            <li>New York, NY</li>
          </ul>
          <div className={`text-xl font-semibold text-gray-500 pb-2 pt-8 flex items-center ${isMobile ? 'justify-center' : 'flex'}`}>
            <Hourglass size={20} color="gray" className="mr-2" /> Coming Soon
          </div>
          <ul className="space-y-1 text-gray-500">
            <li>San Diego, CA</li>
            <li>Washington, DC</li>
            <li>Austin, TX</li>
          </ul>
        </div>
      </div>
      <div className={`max-w-7xl flex-col items-center mt-24`}>
        <div className="text-xl font-semibold text-[var(--accent)] pb-2 flex items-center px-4">
          Request a new city
        </div>
        <div className="overflow-hidden mb-8">
          <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc8iC8a_TQFPnfANyjDeEd5exR2jx4dEfYIa7IsC_ldgJZgKg/viewform?embedded=true&usp=pp_url&entry.12345678" 
            height="600" 
            className="scroll-m-24 overflow-hidden -mt-64 -mb-[124px] w-96"
            // frameborder="0" 
            // marginheight="0" 
            // marginwidth="0"
            style={{ overflow: 'hidden' }}
            >
          </iframe>
        </div>
      </div>
    </main>
    </>
  )
}