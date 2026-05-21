import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import * as ordersApi from '../api/orders.js'
import { useCategories } from '../context/CategoriesContext.jsx'

const STATUSES = ['PENDIENTE', 'DESPACHADO', 'ENTREGADO', 'CANCELADO']

const statusConfig = {
  PENDIENTE: {
    bg: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100',
    active: 'bg-yellow-500 text-white border-yellow-500 shadow-md shadow-yellow-500/20 ring-yellow-500/30',
    icon: '⏳'
  },
  DESPACHADO: {
    bg: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
    active: 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20 ring-blue-600/30',
    icon: '🚚'
  },
  ENTREGADO: {
    bg: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
    active: 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 ring-emerald-600/30',
    icon: '✓'
  },
  CANCELADO: {
    bg: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100',
    active: 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20 ring-rose-600/30',
    icon: '✕'
  },
}

export function AdminPage() {
  const { categories, create: createCategory, remove: removeCategory } = useCategories()
  const [newCat, setNewCat] = useState('')
  const [catMsg, setCatMsg] = useState(null)
  const [catLoading, setCatLoading] = useState(false)

  const [orderId, setOrderId] = useState('')
  const [orderStatus, setOrderStatus] = useState('PENDIENTE')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      gsap.killTweensOf('.admin-animate')
      gsap.fromTo(
        '.admin-animate',
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
  }, [])

  const notify = (type, text) => {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 4000)
  }

  const notifyCat = (type, text) => {
    setCatMsg({ type, text })
    setTimeout(() => setCatMsg(null), 4000)
  }

  const handleCreateCat = async (e) => {
    e.preventDefault()
    if (!newCat.trim()) return
    setCatLoading(true)
    try {
      await createCategory(newCat.trim())
      setNewCat('')
      notifyCat('ok', 'Categoría creada correctamente')
    } catch (err) {
      notifyCat('err', err.message || 'Error al crear la categoría')
    } finally {
      setCatLoading(false)
    }
  }

  const handleDeleteCat = async (cat) => {
    if (!window.confirm(`¿Eliminar la categoría "${cat.name}"?`)) return
    try {
      await removeCategory(cat._id)
      notifyCat('ok', `Categoría "${cat.name}" eliminada`)
    } catch (err) {
      notifyCat('err', err.message || 'Error al eliminar')
    }
  }

  const patchOrderStatus = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await ordersApi.updateOrderStatus(orderId, orderStatus)
      notify('ok', `Orden actualizada a "${orderStatus}" correctamente`)
      setOrderId('')
    } catch (err) {
      notify('err', err.message || 'Error actualizando la orden')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={containerRef} className="mx-auto max-w-4xl px-4 py-8 md:py-12 animate-fade-in">
      {/* Banner Principal */}
      <div className="admin-animate relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl mb-8 p-6 md:p-10 border border-slate-900 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute -left-20 -top-20 h-52 w-52 rounded-full bg-brand/10 blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -right-20 -bottom-20 h-52 w-52 rounded-full bg-accent/10 blur-3xl pointer-events-none animate-float" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <div className="relative z-10 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent mb-2">
            ⚙️ Panel de Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
            Panel de Administración
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium">
            Acceso exclusivo para administrar el catálogo y los pedidos del sistema
          </p>
        </div>
        <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-3xl shadow-xl select-none">
          🛠️
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="admin-animate grid gap-4 sm:grid-cols-2">
        <Link
          to="/panel"
          className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm no-underline transition-all duration-300 hover:shadow-md hover:border-brand/40 group hover:-translate-y-0.5 active:translate-y-0"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors duration-350 text-2xl shadow-inner">
            🛒
          </div>
          <div>
            <div className="font-extrabold text-sm text-ink group-hover:text-brand transition-colors">Gestión de Productos</div>
            <div className="text-xs text-ink/60 mt-0.5 leading-snug">Crear, editar y eliminar productos en el catálogo</div>
          </div>
        </Link>

        <a
          href="#update-orders"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('update-orders')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm no-underline transition-all duration-300 hover:shadow-md hover:border-accent/40 group hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-350 text-2xl shadow-inner">
            📦
          </div>
          <div>
            <div className="font-extrabold text-sm text-ink group-hover:text-accent transition-colors">Gestión de Órdenes</div>
            <div className="text-xs text-ink/60 mt-0.5 leading-snug">Actualizar estados de pedidos y despachos</div>
          </div>
        </a>
      </div>

      {/* Gestión de categorías */}
      <section className="admin-animate mt-8 rounded-3xl border border-line bg-white p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <span className="text-lg">🏷️</span>
          <h2 className="text-lg font-black text-ink">Categorías de productos</h2>
        </div>
        <p className="text-xs sm:text-sm text-ink/60 leading-relaxed mb-4">
          Administra las categorías disponibles en el formulario de creación de productos.
        </p>

        {catMsg ? (
          <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 animate-fade-in ${
            catMsg.type === 'ok' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {catMsg.type === 'ok' ? '✓ ' : '✗ '}
            {catMsg.text}
          </div>
        ) : null}

        <form onSubmit={handleCreateCat} className="flex gap-2">
          <input
            required
            placeholder="Ej: Abarrotes, Lácteos, Limpieza..."
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
          />
          <button
            type="submit"
            disabled={catLoading}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark transition-all duration-200 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-1 shadow-md shadow-brand/10 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            {catLoading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creando...</span>
              </>
            ) : (
              <span>+ Agregar</span>
            )}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.length === 0 ? (
            <div className="w-full text-center py-6 text-sm text-ink/40 border border-dashed border-line rounded-2xl">
              Sin categorías aún. Crea una arriba.
            </div>
          ) : (
            categories.map((cat) => (
              <span
                key={cat._id}
                className="flex items-center gap-2 rounded-xl border border-line bg-surface pl-3.5 pr-2 py-1.5 text-xs font-bold text-ink shadow-sm transition-all hover:border-slate-350 hover:shadow"
              >
                <span className="capitalize">{cat.name}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteCat(cat)}
                  className="rounded-lg h-5 w-5 flex items-center justify-center text-ink/30 hover:bg-red-50 hover:text-red-600 transition-all font-bold cursor-pointer"
                  title="Eliminar"
                >
                  ✕
                </button>
              </span>
            ))
          )}
        </div>
      </section>

      {/* Gestión de estados de órdenes */}
      <section id="update-orders" className="admin-animate mt-8 rounded-3xl border border-line bg-white p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <span className="text-lg">📦</span>
          <h2 className="text-lg font-black text-ink">Actualizar Estado de Orden</h2>
        </div>
        <p className="text-xs sm:text-sm text-ink/60 leading-relaxed mb-5">
          Ingresa el identificador único de la orden (ID) y selecciona su nuevo estado en el sistema.
        </p>

        {msg ? (
          <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 animate-fade-in ${
            msg.type === 'ok' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {msg.type === 'ok' ? '✓ ' : '✗ '}
            {msg.text}
          </div>
        ) : null}

        <form className="grid gap-5" onSubmit={patchOrderStatus}>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/50">ID de la orden *</label>
            <input
              required
              placeholder="Ej: 6650abc123def456789"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/50">Nuevo estado *</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STATUSES.map((s) => {
                const conf = statusConfig[s]
                const isActive = orderStatus === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setOrderStatus(s)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
                      isActive
                        ? `${conf.active} ring-2 ring-offset-2`
                        : `${conf.bg} border-slate-200`
                    }`}
                  >
                    <span>{conf.icon}</span>
                    <span>{s}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand hover:bg-brand-dark py-3 text-sm font-bold text-white transition-all duration-200 active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-brand/10 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Actualizando estado...</span>
              </>
            ) : (
              <span>Actualizar estado de orden</span>
            )}
          </button>
        </form>
      </section>
    </div>
  )
}
