import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { getProductPrimaryImage } from '../utils/productImage.js'

const CATEGORY_STYLES = {
  Lacteos: { icon: '🥛' },
  Frutas: { icon: '🍎' },
  Verduras: { icon: '🥦' },
  Carnes: { icon: '🥩' },
  Bebidas: { icon: '🧃' },
  Abarrotes: { icon: '🛒' },
  Panaderia: { icon: '🍞' },
  Limpieza: { icon: '🧹' },
  Transporte: { icon: '🚗' },
}

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium no-underline transition-all duration-250 ${isActive
    ? 'bg-brand/10 text-blue-400 border border-brand/20 font-semibold'
    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
  }`

const normalize = (s) => s.toLowerCase().trim()

export function Navbar() {
  const { user, isAdmin, isManager, logout } = useAuth()
  const { itemCount } = useCart()
  const { categories, products } = useProducts()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const inputRef = useRef(null)
  const catRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setQuery(params.get('q') || '')
  }, [location.pathname, location.search])

  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setCatOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initials = useMemo(() => {
    if (!user) return ''
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
  }, [user])

  const suggestions = useMemo(() => {
    const q = normalize(query)
    if (q.length < 2) return []
    return products
      .filter((p) =>
        normalize(p.name).includes(q) ||
        normalize(p.category || '').includes(q) ||
        normalize(p.subCategory || '').includes(q)
      )
      .slice(0, 6)
  }, [query, products])

  const onSearch = (e) => {
    e?.preventDefault()
    const q = query.trim()
    navigate(q ? `/buscar?q=${encodeURIComponent(q)}` : '/tienda')
    setShowSuggestions(false)
    setMobileOpen(false)
  }

  const goToProduct = (id) => {
    navigate(`/producto/${id}`)
    setShowSuggestions(false)
  }

  const clearQuery = () => {
    setQuery('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const closeMenus = () => {
    setMobileOpen(false)
    setCatOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white no-underline hover:text-white" onClick={closeMenus}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand font-bold text-white shadow-md shadow-brand/20">M</span>
          <span className="hidden text-sm font-bold tracking-tight sm:block">Marquetazo</span>
        </Link>

        {/* Buscador desktop */}
        <form className="relative hidden max-w-md flex-1 md:block" onSubmit={onSearch}>
          <div className="flex items-center overflow-hidden rounded-full border border-slate-800 bg-slate-900 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand transition-all">
            <input
              ref={inputRef}
              name="q"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Buscar productos..."
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent py-2 pl-4 text-sm text-white placeholder-slate-500 outline-none"
            />
            {query ? (
              <button type="button" onClick={clearQuery} className="px-2 text-slate-500 hover:text-slate-300 transition-colors">
                ✕
              </button>
            ) : null}
            <button
              type="submit"
              className="shrink-0 rounded-full bg-brand m-1 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark transition-colors"
            >
              Buscar
            </button>
          </div>

          {showSuggestions && suggestions.length > 0 ? (
            <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl text-slate-300">
              {suggestions.map((p) => {
                const img = getProductPrimaryImage(p)
                return (
                  <button
                    key={p._id}
                    type="button"
                    onMouseDown={() => goToProduct(p._id)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-850 bg-white p-0.5">
                      {img
                        ? <img src={img} alt="" className="h-full w-full object-contain" />
                        : <span className="text-base font-bold text-brand">{p.name[0]}</span>
                      }
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-200">{p.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{p.category}</p>
                    </div>
                  </button>
                )
              })}
              <button
                type="submit"
                className="flex w-full items-center justify-center border-t border-slate-800 px-4 py-2.5 text-sm font-semibold text-brand hover:bg-slate-800 hover:text-brand-dark"
              >
                Ver todos los resultados para &ldquo;{query}&rdquo; →
              </button>
            </div>
          ) : null}
        </form>

        {/* Categorías desktop */}
        <div className="relative hidden lg:block" ref={catRef}>
          <button
            type="button"
            onClick={() => setCatOpen((v) => !v)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${catOpen
              ? 'border-brand bg-slate-800 text-white'
              : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <svg className="h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Categorías
            <svg
              className={`h-3.5 w-3.5 transition-transform duration-200 ${catOpen ? 'rotate-180 text-brand' : 'text-slate-500'}`}
              fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {catOpen && (
            <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-64 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150">
              <div className="border-b border-slate-800 px-3.5 py-2.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Explora por categoría
                </span>
              </div>

              <Link
                to="/tienda"
                onClick={closeMenus}
                className="flex items-center justify-between border-b border-slate-800 px-3.5 py-2.5 text-sm font-semibold text-brand no-underline hover:bg-brand/10 transition-colors"
              >
                <span>Ver todo el catálogo</span>
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <div className="max-h-72 overflow-y-auto py-1.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800">
                {categories.map((c) => {
                  const style = CATEGORY_STYLES[c] || { icon: '📦' }
                  return (
                    <Link
                      key={c}
                      to={`/tienda?cat=${encodeURIComponent(c)}`}
                      onClick={closeMenus}
                      className="group flex items-center gap-2.5 px-3.5 py-2 no-underline transition-colors hover:bg-slate-800"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm transition-colors group-hover:bg-brand/20">
                        {style.icon}
                      </span>
                      <span className="flex-1 text-sm capitalize text-slate-400 group-hover:text-slate-100 transition-colors">
                        {c}
                      </span>
                      <svg
                        className="h-3.5 w-3.5 text-slate-700 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                        fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Nav links desktop */}
        <nav className="ml-auto hidden items-center gap-1.5 lg:flex">
          <NavLink to="/tienda" className={navClass}>Tienda</NavLink>
          <NavLink to="/nosotros" className={navClass}>Nosotros</NavLink>
          <NavLink to="/contacto" className={navClass}>Contacto</NavLink>
          {user ? (
            <>
              <NavLink to="/carrito" className={navClass}>
                Carrito{itemCount > 0 ? ` (${itemCount})` : ''}
              </NavLink>
              <NavLink to="/mis-pedidos" className={navClass}>Pedidos</NavLink>
              {isManager && !isAdmin ? <NavLink to="/panel" className={navClass}>Productos</NavLink> : null}
              {isAdmin ? <NavLink to="/admin" className={navClass}>Admin</NavLink> : null}
              <NavLink to="/perfil" className={navClass}>{initials || 'Perfil'}</NavLink>
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all"
                onClick={logout}
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 no-underline hover:bg-slate-850 hover:text-white">Ingresar</Link>
              <Link to="/registro" className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-white no-underline hover:bg-orange-600 hover:text-white shadow-lg shadow-accent/20">Registro</Link>
            </>
          )}
        </nav>

        {/* Hamburger */}
        <button
          type="button"
          className="ml-auto rounded-lg bg-slate-900 border border-slate-800 p-2 text-slate-300 hover:text-white lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          ☰
        </button>
      </div>

      {/* Menú mobile */}
      {mobileOpen ? (
        <div className="border-t border-slate-800 bg-slate-950 p-4 lg:hidden">
          <form onSubmit={onSearch}>
            <div className="relative">
              <input
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
                autoComplete="off"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 pr-10 text-sm text-white placeholder:text-slate-500 outline-none"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm">
                ↵
              </button>
            </div>
            {suggestions.length > 0 ? (
              <div className="mt-2 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                {suggestions.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => { goToProduct(p._id); closeMenus() }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="ml-auto shrink-0 text-xs text-slate-500 capitalize">{p.category}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </form>

          <div className="mt-3 flex flex-col gap-1">
            <NavLink to="/tienda" className={navClass} onClick={closeMenus}>Tienda</NavLink>
            <NavLink to="/nosotros" className={navClass} onClick={closeMenus}>Nosotros</NavLink>
            <NavLink to="/contacto" className={navClass} onClick={closeMenus}>Contacto</NavLink>

            {/* Categorías mobile */}
            <div className="mt-1 border-t border-slate-800 pt-2">
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Categorías</p>
              {categories.map((c) => {
                const style = CATEGORY_STYLES[c] || { icon: '📦' }
                return (
                  <Link
                    key={c}
                    to={`/tienda?cat=${encodeURIComponent(c)}`}
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 no-underline hover:bg-slate-800 hover:text-white"
                  >
                    <span>{style.icon}</span>
                    <span className="capitalize">{c}</span>
                  </Link>
                )
              })}
            </div>

            {user ? (
              <>
                <div className="mt-1 border-t border-slate-800 pt-2">
                  <NavLink to="/carrito" className={navClass} onClick={closeMenus}>Carrito</NavLink>
                  <NavLink to="/mis-pedidos" className={navClass} onClick={closeMenus}>Pedidos</NavLink>
                  <NavLink to="/perfil" className={navClass} onClick={closeMenus}>Perfil</NavLink>
                  {isManager && !isAdmin ? <NavLink to="/panel" className={navClass} onClick={closeMenus}>Productos</NavLink> : null}
                  {isAdmin ? <NavLink to="/admin" className={navClass} onClick={closeMenus}>Admin</NavLink> : null}
                  <button
                    type="button"
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800/50"
                    onClick={() => { logout(); closeMenus() }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-1 border-t border-slate-800 pt-2 flex flex-col gap-1">
                <Link to="/login" className="rounded-lg px-3 py-2 text-sm text-slate-300 no-underline hover:bg-slate-850" onClick={closeMenus}>Ingresar</Link>
                <Link to="/registro" className="rounded-lg px-3 py-2 text-sm text-slate-300 no-underline hover:bg-slate-850" onClick={closeMenus}>Registro</Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}

