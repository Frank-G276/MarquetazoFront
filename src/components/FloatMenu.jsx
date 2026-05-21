import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'

export function FloatMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const menuRef = useRef(null)
  const iconRef = useRef(null)
  const location = useLocation()

  // Close when path changes
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // GSAP Animations
  useEffect(() => {
    const menu = menuRef.current
    const icon = iconRef.current

    if (!menu || !icon) return

    if (isOpen) {
      // Open animation
      gsap.killTweensOf([menu, icon])
      
      // Animate dropdown panel
      gsap.fromTo(
        menu,
        { opacity: 0, y: 15, scale: 0.92, display: 'none' },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          display: 'flex',
          duration: 0.3,
          ease: 'back.out(1.5)'
        }
      )
      
      // Rotate icon into a cross or open state
      gsap.to(icon, {
        rotate: 135,
        duration: 0.3,
        ease: 'power2.out'
      })
    } else {
      // Close animation
      gsap.killTweensOf([menu, icon])
      
      gsap.to(menu, {
        opacity: 0,
        y: 15,
        scale: 0.92,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(menu, { display: 'none' })
        }
      })

      gsap.to(icon, {
        rotate: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }, [isOpen])

  const toggleMenu = () => {
    setIsOpen((prev) => !prev)
  }

  // Active class for floating links
  const getLinkClass = (path) => {
    const isActive = location.pathname === path
    return `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all no-underline ${
      isActive
        ? 'bg-brand/10 text-brand border border-brand/20'
        : 'text-slate-350 hover:bg-slate-800/60 hover:text-white border border-transparent'
    }`
  }

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50">
      {/* Dropdown Menu Panel */}
      <div
        ref={menuRef}
        style={{ display: 'none' }}
        className="absolute bottom-16 right-0 w-48 flex-col gap-1 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-md p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] origin-bottom-right"
      >
        <div className="px-3 py-2 border-b border-slate-900">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            ¿Necesitas ayuda?
          </span>
        </div>
        
        <Link to="/nosotros" className={getLinkClass('/nosotros')}>
          <span className="text-base">👥</span>
          <span>Nosotros</span>
        </Link>
        
        <Link to="/contacto" className={getLinkClass('/contacto')}>
          <span className="text-base">✉️</span>
          <span>Contacto</span>
        </Link>
      </div>

      {/* Main Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={toggleMenu}
        aria-label="Menú de ayuda"
        aria-expanded={isOpen}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-none"
      >
        <div ref={iconRef} className="flex items-center justify-center">
          {/* Custom chat bubble / menu SVG icon */}
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </button>
    </div>
  )
}
