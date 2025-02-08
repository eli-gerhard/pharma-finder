import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-[var(--background)] shadow-sm border-b border-[var(--puborder)]">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        {/* Logo and Name */}
        <div className="flex items-center gap-2">
          <div className="rounded">
            <Image 
              src="/logo-icon.png"
              alt="App Logo"
              width={48}
              height={48}
              className="rounded"
            />
          </div>
          <span className="font-semibold text-xl text-[var(--accent)]">InStockMed</span>
        </div>

        {/* Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-[var(--hover)] rounded-lg"
        >
          <Menu size={24} />
        </button>

        {/* Navigation Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 right-4 w-48 bg-[var(--background)] shadow-lg rounded-lg border border-[var(--puborder)] overflow-hidden z-30">
            <nav className="py-0">
              <Link 
                href="/"
                className="block px-4 py-2 rounded-lg hover:bg-[var(--hover)]"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/entry"
                className="block px-4 py-2 rounded-lg hover:bg-[var(--hover)]"
                onClick={() => setIsMenuOpen(false)}
              >
                Entry
              </Link>
              <Link 
                href="/search"
                className="block px-4 py-2 rounded-lg hover:bg-[var(--hover)]"
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}