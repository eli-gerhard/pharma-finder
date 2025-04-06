// components/ui/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Send } from 'lucide-react';
import { useState, useEffect } from 'react'

export default function Footer() {
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
    <footer className="bg-[var(--popup)] border-t border-[var(--puborder)] pt-4 pb-2">
      <div className="max-w-6xl mx-auto px-4">
        <div className={`${isMobile ? 'flex-col' : 'flex'}`}>
          <div className={`${isMobile ? 'flex w-full pb-2' : 'flex w-1/2'}`}>
            <div className="w-1/2">
                <h3 className="font-medium mb-2">Navigation</h3>
                <ul className="space-y-1">
                <li><Link href="/" className="text-sm hover:text-[var(--accent)]">Home</Link></li>
                <li><Link href="/search" className="text-sm hover:text-[var(--accent)]">Search</Link></li>
                <li><Link href="/entry" className="text-sm hover:text-[var(--accent)]">Entry</Link></li>
                </ul>
            </div>
            <div className="w-1/2">
                <h3 className="font-medium mb-2">About</h3>
                <ul className="space-y-1">
                <li><Link href="/cities" className="text-sm hover:text-[var(--accent)]">Cities</Link></li>
                <li><Link href="/contact" className="text-sm hover:text-[var(--accent)]">Contact</Link></li>
                <li><Link href="/privacy" className="text-sm hover:text-[var(--accent)]">Privacy Policy</Link></li>
                {/* <li><Link href="/terms" className="text-sm hover:text-[var(--accent)]">Terms of Use</Link></li> */}
                </ul>
            </div>
          </div>
          <div className={`${isMobile ? 'w-full pt-2 mt-2 border-t border-[var(--puborder)]' : 'w-1/2'}`}>
            <h3 className="font-medium mb-2">Stay Updated</h3>
            <p className="text-sm mb-2">Get notified about updates to our product and included cities.</p>
            <div className="flex mt-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-2 border border-[var(--puborder)] rounded-l-lg text-sm text-gray-800 focus:outline-none"
              />
              <button className="bg-[var(--accent)] text-white px-3 py-2 rounded-r-lg">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className={`mt-4 pt-2 border-t border-[var(--puborder)] flex ${isMobile ? 'flex-col gap-2 mb-2' : 'flex'} md:flex-row justify-between items-center`}>
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo-icon.png" alt="InStockMed Logo" width={40} height={40} />
              <span className="text-[var(--accent)] font-semibold">InStockMed</span>
            </Link>
            {/* <p className="mt-2 text-sm">Finding your medication.</p> */}
          </div>
          <div className="text-sm items-right">© {new Date().getFullYear()} InStockMed. All rights reserved.</div>
          {/* <div className="flex space-x-4"> */}
            {/* Social media icons would go here */}
          {/* </div> */}
        </div>
      </div>
    </footer>
  );
}