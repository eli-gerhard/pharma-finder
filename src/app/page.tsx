'use client';

import Link from 'next/link'
import Header from '@/components/ui/Header'

export default function Home() {
  return (
    <>
    <Header />
    <main className="p-4 flex flex-col items-center justify-center mt-16"> {/* Changed to main with padding */}
      <div className="flex gap-4">
        <Link 
          href="/entry" 
          className="px-4 py-2 text-center bg-[var(--popup)] border border-[var(--puborder)] rounded-lg hover:bg-[var(--hover)]"
        >
          Enter Medication Pickup
        </Link>
        <Link 
          href="/search" 
          className="px-4 py-2 text-center bg-[var(--popup)] border border-[var(--puborder)] rounded-lg hover:bg-[var(--hover)]"
        >
          Find Nearby Medication
        </Link>
      </div>
    </main>
    </>
  )
}