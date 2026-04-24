import { useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors ${
    isActive ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white'
  }`

export function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const { itemCount } = useCart()
  const { categories } = useProducts()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const navigate = useNavigate()

  const initials = useMemo(() => {
    if (!user) return ''
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
  }, [user])

  const onSearch = (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const q = String(fd.get('q') || '').trim()
    navigate(q ? `/tienda?q=${encodeURIComponent(q)}` : '/tienda')
    setMobileOpen(false)
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

        <form className="hidden max-w-md flex-1 md:block" onSubmit={onSearch}>
          <div className="relative">
            <input
              name="q"
              placeholder="Buscar productos..."
              className="w-full rounded-full border border-white/30 bg-white py-2 pl-4 pr-10 text-sm text-ink outline-none ring-brand/40 focus:ring-2"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-brand-dark px-3 py-1.5 text-xs font-semibold text-white">
              Buscar
            </button>
          </div>
        </form>

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

        <button
          type="button"
          className="ml-auto rounded-lg bg-white/10 p-2 text-white lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          ☰
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/15 bg-brand-dark p-4 lg:hidden">
          <form onSubmit={onSearch}>
            <input name="q" placeholder="Buscar..." className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60" />
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
