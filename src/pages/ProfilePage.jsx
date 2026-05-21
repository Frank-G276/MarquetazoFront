import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useAuth } from '../context/AuthContext.jsx'

const ROLE_BADGES = {
  ADMIN: {
    bg: 'bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400',
    label: 'Administrador'
  },
  EMPLEADO: {
    bg: 'bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-450',
    label: 'Colaborador'
  },
  CLIENTE: {
    bg: 'bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400',
    label: 'Cliente'
  }
}

export function ProfilePage() {
  const { user, refreshProfile, logout } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  // Generate user initials
  const initials = useMemo(() => {
    if (!user) return ''
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
  }, [user])

  // GSAP animations for profile elements
  useEffect(() => {
    if (user && containerRef.current) {
      gsap.killTweensOf('.profile-animate')
      gsap.fromTo(
        '.profile-animate',
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'transform,opacity'
        }
      )
    }
  }, [user])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshProfile()
    } catch (err) {
      console.error(err)
    } finally {
      // 700ms delay to make the update feel organic and let the spinner be seen
      setTimeout(() => setRefreshing(false), 700)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const roleConfig = ROLE_BADGES[String(user?.role).toUpperCase()] || {
    bg: 'bg-slate-50 border border-slate-200 text-slate-700',
    label: user?.role
  }

  return (
    <div ref={containerRef} className="mx-auto max-w-5xl px-4 py-8 md:py-12 animate-fade-in">
      {/* Banner Principal con Avatar */}
      <div className="profile-animate relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl mb-8 p-6 md:p-10 border border-slate-900 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="absolute -left-20 -top-20 h-52 w-52 rounded-full bg-brand/10 blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -right-20 -bottom-20 h-52 w-52 rounded-full bg-accent/10 blur-3xl pointer-events-none animate-float" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Avatar gigante */}
        <div className="relative z-10 flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 via-orange-600 to-brand font-extrabold text-white text-3xl sm:text-4xl shadow-xl ring-4 ring-slate-900 border border-white/20 select-none">
          {initials || '?'}
        </div>

        {/* Textos del banner */}
        <div className="relative z-10 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent mb-2">
            👤 Cuenta Oficial
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-350 font-medium">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Grid de contenido */}
      <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
        
        {/* Columna Izquierda: Información Detallada */}
        <div className="profile-animate bg-white border border-line rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black text-ink flex items-center gap-2 border-b border-slate-100 pb-3 mb-6">
              <span>📋</span> Datos de la Cuenta
            </h2>

            <dl className="grid gap-6 sm:grid-cols-2">
              <div className="border-b border-slate-50 pb-2 sm:border-b-0 sm:pb-0">
                <dt className="text-[10px] uppercase font-bold tracking-wider text-ink/40">Nombre</dt>
                <dd className="mt-1 text-sm font-extrabold text-ink">{user?.firstName || '-'}</dd>
              </div>

              <div className="border-b border-slate-50 pb-2 sm:border-b-0 sm:pb-0">
                <dt className="text-[10px] uppercase font-bold tracking-wider text-ink/40">Apellido</dt>
                <dd className="mt-1 text-sm font-extrabold text-ink">{user?.lastName || '-'}</dd>
              </div>

              <div className="border-b border-slate-50 pb-2 sm:border-b-0 sm:pb-0 col-span-1 sm:col-span-2">
                <dt className="text-[10px] uppercase font-bold tracking-wider text-ink/40">Correo Electrónico</dt>
                <dd className="mt-1 text-sm font-extrabold text-ink">{user?.email || '-'}</dd>
              </div>

              <div>
                <dt className="text-[10px] uppercase font-bold tracking-wider text-ink/40 mb-1.5">Rol de Cuenta</dt>
                <dd>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${roleConfig.bg}`}>
                    {roleConfig.label}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Botones de acción */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-xl bg-brand hover:bg-brand-dark px-5 py-2.5 text-xs font-bold text-white transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md shadow-brand/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-98"
            >
              {refreshing ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Actualizando...</span>
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <span>Actualizar datos</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Columna Derecha: Accesos Rápidos y Acciones Secundarias */}
        <div className="flex flex-col gap-4">
          {/* Tarjeta de enlaces */}
          <div className="profile-animate bg-white border border-line rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider text-ink/40 mb-2">
              ⚡ Accesos Rápidos
            </h3>

            {/* Carrito */}
            <Link
              to="/carrito"
              className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 hover:bg-slate-50 hover:border-orange-500/30 transition-all group no-underline text-ink shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-350 text-xl shadow-inner">
                🛒
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-ink group-hover:text-orange-500 transition-colors">
                  Mi Carrito
                </h4>
                <p className="text-[10px] sm:text-xs text-ink/50 mt-0.5 leading-snug">
                  Revisa y procesa tus productos seleccionados.
                </p>
              </div>
            </Link>

            {/* Pedidos */}
            <Link
              to="/mis-pedidos"
              className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 hover:bg-slate-50 hover:border-brand/30 transition-all group no-underline text-ink shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors duration-350 text-xl shadow-inner">
                📦
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-ink group-hover:text-brand transition-colors">
                  Mis Pedidos
                </h4>
                <p className="text-[10px] sm:text-xs text-ink/50 mt-0.5 leading-snug">
                  Revisa tu historial de compras y estados de despacho.
                </p>
              </div>
            </Link>
          </div>

          {/* Botón de cerrar sesión */}
          <div className="profile-animate">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 p-4 shadow-sm transition-all duration-200 cursor-pointer text-rose-600 text-sm font-bold active:scale-98"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <span>Cerrar sesión en este dispositivo</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
