import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { getProductPrimaryImage } from '../utils/productImage.js'

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors ${
    isActive ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white'
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

  // Sincroniza el input con el param ?q= de la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setQuery(params.get('q') || '')
  }, [location.pathname, location.search])

  const initials = useMemo(() => {
    if (!user) return ''
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
  }, [user])

  // Sugerencias en tiempo real
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
    <header className="sticky top-0 z-40 border-b border-black/10 bg-brand shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-white no-underline hover:text-white" onClick={closeMenus}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 font-bold ring-1 ring-white/30">M</span>
          <span className="hidden text-sm font-semibold sm:block">Marquetazo</span>
        </Link>

        {/* Buscador desktop */}
        <form className="relative hidden max-w-md flex-1 md:block" onSubmit={onSearch}>
          <div className="flex items-center overflow-hidden rounded-full border border-white/30 bg-white focus-within:ring-2 focus-within:ring-brand/40">
            <input
              ref={inputRef}
              name="q"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Buscar productos..."
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent py-2 pl-4 text-sm text-ink outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={clearQuery}
                className="px-2 text-ink/30 hover:text-ink/70 transition-colors"
              >
                ✕
              </button>
            ) : null}
            <button
              type="submit"
              className="shrink-0 rounded-full bg-brand-dark m-1 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand transition-colors"
            >
              Buscar
            </button>
          </div>

          {/* Dropdown de sugerencias */}
          {showSuggestions && suggestions.length > 0 ? (
            <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-line bg-white shadow-xl">
              {suggestions.map((p) => {
                const img = getProductPrimaryImage(p)
                return (
                  <button
                    key={p._id}
                    type="button"
                    onMouseDown={() => goToProduct(p._id)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-white p-0.5">
                      {img
                        ? <img src={img} alt="" className="h-full w-full object-contain" />
                        : <span className="text-base font-bold text-brand/30">{p.name[0]}</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                      <p className="text-xs text-ink/50 capitalize">{p.category}</p>
                    </div>
                  </button>
                )
              })}
              <button
                type="submit"
                className="flex w-full items-center justify-center border-t border-line px-4 py-2.5 text-sm font-semibold text-brand hover:bg-surface"
              >
                Ver todos los resultados para &ldquo;{query}&rdquo; →
              </button>
            </div>
          ) : null}
        </form>

        {/* Categorías desktop */}
        <div className="relative hidden lg:block">
          <button
            type="button"
            className="rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
            onClick={() => setCatOpen((v) => !v)}
          >
            Categorías
          </button>
          {catOpen ? (
            <div className="absolute left-0 top-12 z-50 max-h-80 w-64 overflow-auto rounded-xl border border-line bg-white py-2 shadow-xl">
              <Link to="/tienda" onClick={closeMenus} className="block px-4 py-2 text-sm no-underline hover:bg-surface">Ver todo</Link>
              <div className="my-1 border-t border-line" />
              {categories.map((c) => (
                <Link
                  key={c}
                  to={`/tienda?cat=${encodeURIComponent(c)}`}
                  onClick={closeMenus}
                  className="block px-4 py-2 text-sm capitalize no-underline hover:bg-surface"
                >
                  {c}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {/* Nav links desktop */}
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
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
              <button type="button" className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-white no-underline hover:bg-white/10">Ingresar</Link>
              <Link to="/registro" className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-white no-underline hover:bg-orange-600 hover:text-white">Registro</Link>
            </>
          )}
        </nav>

        {/* Hamburger */}
        <button
          type="button"
          className="ml-auto rounded-lg bg-white/10 p-2 text-white lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          ☰
        </button>
      </div>

      {/* Menú mobile */}
      {mobileOpen ? (
        <div className="border-t border-white/15 bg-brand-dark p-4 lg:hidden">
          <form onSubmit={onSearch}>
            <div className="relative">
              <input
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
                autoComplete="off"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 pr-10 text-sm text-white placeholder:text-white/60 outline-none"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-sm">
                ↵
              </button>
            </div>
            {/* Sugerencias mobile */}
            {suggestions.length > 0 ? (
              <div className="mt-2 overflow-hidden rounded-xl border border-white/20 bg-white/10">
                {suggestions.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => { goToProduct(p._id); closeMenus() }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="ml-auto shrink-0 text-xs text-white/50 capitalize">{p.category}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </form>
          <div className="mt-3 flex flex-col gap-1">
            <NavLink to="/tienda" className={navClass} onClick={closeMenus}>Tienda</NavLink>
            <NavLink to="/nosotros" className={navClass} onClick={closeMenus}>Nosotros</NavLink>
            <NavLink to="/contacto" className={navClass} onClick={closeMenus}>Contacto</NavLink>
            {user ? (
              <>
                <NavLink to="/carrito" className={navClass} onClick={closeMenus}>Carrito</NavLink>
                <NavLink to="/mis-pedidos" className={navClass} onClick={closeMenus}>Pedidos</NavLink>
                <NavLink to="/perfil" className={navClass} onClick={closeMenus}>Perfil</NavLink>
                {isManager && !isAdmin ? <NavLink to="/panel" className={navClass} onClick={closeMenus}>Productos</NavLink> : null}
                {isAdmin ? <NavLink to="/admin" className={navClass} onClick={closeMenus}>Admin</NavLink> : null}
                <button type="button" className="rounded-lg px-3 py-2 text-left text-sm text-white/90 hover:bg-white/10" onClick={() => { logout(); closeMenus() }}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-lg px-3 py-2 text-sm text-white no-underline hover:bg-white/10" onClick={closeMenus}>Ingresar</Link>
                <Link to="/registro" className="rounded-lg px-3 py-2 text-sm text-white no-underline hover:bg-white/10" onClick={closeMenus}>Registro</Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
