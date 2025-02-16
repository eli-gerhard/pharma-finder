import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  const NavLinks = ({ className = "", onClick = () => {} }) => (
    <>
      <Link 
        href="/"
        className={`px-4 py-2 rounded-lg text-center hover:bg-[var(--hover)] ${className}`}
        onClick={onClick}
      >
        Home
      </Link>
      <Link 
        href="/entry"
        className={`px-4 py-2 rounded-lg text-center hover:bg-[var(--hover)] ${className}`}
        onClick={onClick}
      >
        Entry
      </Link>
      <Link 
        href="/search"
        className={`px-4 py-2 rounded-lg text-center hover:bg-[var(--hover)] ${className}`}
        onClick={onClick}
      >
        Search
      </Link>
    </>
  )

  return (
    <header className="bg-[var(--background)]/80 backdrop-blur-sm shadow-sm border-b border-[var(--popup)]">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        {/* Logo and Name */}
        <Link href="/" className="flex items-center gap-2">
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
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex gap-8 mr-12">
            <NavLinks />
          </nav>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-[var(--hover)] rounded-lg"
          >
            <Menu size={24} />
          </button>
        )}

        {/* Mobile Navigation Menu */}
        {isMobile && isMenuOpen && (
          <div className="absolute top-16 right-4 w-32 bg-[var(--background)] shadow-lg rounded-lg border border-[var(--puborder)] overflow-hidden z-30">
            <nav className="py-0">
              <NavLinks 
                className="block" 
                onClick={() => setIsMenuOpen(false)}
              />
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}