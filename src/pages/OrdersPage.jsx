import { useEffect, useState, useMemo, useRef } from 'react'
import gsap from 'gsap'
import * as ordersApi from '../api/orders.js'
import { formatCLP } from '../utils/money.js'
import { Pagination } from '../components/Pagination.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { getProductPrimaryImage } from '../utils/productImage.js'
import { Link } from 'react-router-dom'

const STATUS_CONFIG = {
  PENDIENTE: {
    bg: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-500',
    dot: 'bg-amber-500',
    label: 'Pendiente'
  },
  DESPACHADO: {
    bg: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400',
    dot: 'bg-blue-500',
    label: 'Despachado'
  },
  ENTREGADO: {
    bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    label: 'Entregado'
  },
  CANCELADO: {
    bg: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400',
    dot: 'bg-rose-500',
    label: 'Cancelado'
  }
}

const SkeletonCard = () => (
  <div className="rounded-2xl border border-line bg-white p-6 shadow-sm animate-pulse space-y-4">
    <div className="flex flex-wrap justify-between items-center gap-2">
      <div className="h-5 w-36 bg-slate-200 rounded" />
      <div className="h-6 w-24 bg-slate-200 rounded-full" />
    </div>
    <div className="h-3 w-28 bg-slate-100 rounded" />
    <div className="space-y-3 border-t border-slate-100 pt-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-200 rounded-lg" />
            <div className="h-4 w-32 bg-slate-200 rounded" />
          </div>
          <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
    <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
      <div className="h-4 w-12 bg-slate-100 rounded" />
      <div className="h-5 w-24 bg-slate-200 rounded" />
    </div>
  </div>
)

export function OrdersPage() {
  const { products: allProducts } = useProducts()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Pagination & Filtering state
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('TODOS')
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedId, setCopiedId] = useState('')

  const ITEMS_PER_PAGE = 3
  const ordersContainerRef = useRef(null)

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await ordersApi.getOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'No se pudo cargar las órdenes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Filter orders based on status & search term
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === 'TODOS' ||
        String(order.status).toUpperCase() === statusFilter.toUpperCase()

      const matchesSearch =
        !searchTerm.trim() ||
        String(order._id).toLowerCase().includes(searchTerm.trim().toLowerCase())

      return matchesStatus && matchesSearch
    })
  }, [orders, statusFilter, searchTerm])

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)

  // Paginated orders
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredOrders, currentPage])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, searchTerm])

  // GSAP animation for order cards entrance & page changes
  useEffect(() => {
    if (!loading && paginatedOrders.length > 0 && ordersContainerRef.current) {
      gsap.killTweensOf('.order-card')
      gsap.fromTo(
        '.order-card',
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
  }, [loading, currentPage, statusFilter, searchTerm, paginatedOrders.length])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(''), 2000)
  }

  // Find product thumbnail or return initials avatar
  const renderProductThumbnail = (itemName) => {
    const catalogProduct = allProducts.find(
      (p) => String(p.name).toLowerCase() === String(itemName).toLowerCase()
    )
    const image = catalogProduct ? getProductPrimaryImage(catalogProduct) : ''

    if (image) {
      return (
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white border border-slate-100 flex items-center justify-center p-1 shadow-sm">
          <img src={image} alt={itemName} className="h-full w-full object-contain" />
        </div>
      )
    }

    const initials = itemName
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase()

    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand/5 to-brand/15 text-xs font-extrabold text-brand border border-brand/10 shadow-inner">
        {initials || '?'}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12 animate-fade-in">
      {/* Banner Superior Estilo Premium */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl mb-8 p-6 md:p-10 border border-slate-900 shadow-xl">
        <div className="absolute -left-20 -top-20 h-52 w-52 rounded-full bg-brand/10 blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -right-20 -bottom-20 h-52 w-52 rounded-full bg-accent/10 blur-3xl pointer-events-none animate-float" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent mb-4">
            📦 Historial
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Mis Pedidos
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-lg">
            Revisa el estado de tus compras, detalles de envío, montos totales y descarga el historial de tus transacciones.
          </p>
        </div>
      </div>

      {/* Controles: Filtros y Búsqueda */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-line rounded-2xl p-4 shadow-sm">
        {/* Filtros de Estado */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {['TODOS', 'PENDIENTE', 'DESPACHADO', 'ENTREGADO', 'CANCELADO'].map((filter) => {
            const isActive = statusFilter === filter
            return (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${isActive
                    ? 'bg-brand border-brand text-white shadow-sm scale-102'
                    : 'bg-surface border-line text-ink/75 hover:bg-slate-50'
                  } cursor-pointer`}
              >
                {filter === 'TODOS' ? 'Todos' : filter.charAt(0) + filter.slice(1).toLowerCase()}
              </button>
            )
          })}
        </div>

        {/* Buscador por ID */}
        <div className="relative flex items-center rounded-xl border border-line bg-surface p-1 w-full md:w-80 focus-within:border-brand transition-colors">
          <span className="pl-3 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Buscar por ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent py-1 pl-2 pr-8 text-xs text-ink placeholder-slate-400 outline-none border-none focus:ring-0"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 text-slate-400 hover:text-ink text-[10px]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Estado de Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <p className="text-sm text-red-700 font-semibold">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-3 rounded-xl bg-red-650 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-all cursor-pointer"
          >
            Intentar de nuevo
          </button>
        </div>
      )}

      {/* Listado de Pedidos */}
      {!error && (
        <>
          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : paginatedOrders.length === 0 ? (
            /* Estado Vacío / Sin Resultados */
            <div className="text-center py-16 bg-white border border-line rounded-3xl p-8 shadow-sm max-w-md mx-auto animate-fade-in">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4 text-3xl shadow-inner">
                📦
              </div>
              <h3 className="text-base font-bold text-ink">No se encontraron pedidos</h3>
              <p className="mt-2 text-xs text-ink/65 max-w-xs mx-auto leading-relaxed">
                {searchTerm || statusFilter !== 'TODOS'
                  ? 'No hay ningún pedido que coincida con la búsqueda o filtro seleccionado.'
                  : 'Parece que aún no has realizado ninguna compra en Marquetazo.'}
              </p>
              {!searchTerm && statusFilter === 'TODOS' ? (
                <Link
                  to="/tienda"
                  className="mt-6 inline-block rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-dark transition-all no-underline"
                >
                  Explorar la tienda
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('TODOS')
                  }}
                  className="mt-6 inline-block rounded-xl bg-slate-100 border border-line px-5 py-2.5 text-xs font-bold text-ink hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            /* Tarjetas de Pedidos */
            <div ref={ordersContainerRef} className="space-y-6">
              {paginatedOrders.map((order) => {
                const status = String(order.status).toUpperCase()
                const config = STATUS_CONFIG[status] || {
                  bg: 'bg-slate-50 text-slate-700 border border-slate-200',
                  dot: 'bg-slate-400',
                  label: order.status
                }

                return (
                  <article
                    key={order._id}
                    className="order-card rounded-2xl border border-line bg-white p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Cabecera del pedido */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-extrabold text-ink">
                            Orden #{order._id.slice(-6).toUpperCase()}
                          </p>
                          <button
                            onClick={() => handleCopyId(order._id)}
                            className="text-[10px] text-slate-400 hover:text-brand px-1.5 py-0.5 rounded bg-slate-50 hover:bg-brand/5 border border-slate-200 transition-all cursor-pointer active:scale-95 flex items-center gap-1 font-semibold"
                            title="Copiar ID completo"
                          >
                            <span>{copiedId === order._id ? '¡Copiado!' : 'Copiar ID'}</span>
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-ink/50 font-medium">
                          {new Date(order.createdAt).toLocaleDateString('es-CL', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      {/* Badge de Estado */}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide ${config.bg}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${config.dot} animate-pulse-slow`} />
                        {config.label}
                      </span>
                    </div>

                    {/* Lista de productos */}
                    <ul className="space-y-4 mb-5">
                      {order.items.map((item, idx) => (
                        <li
                          key={`${order._id}-${idx}`}
                          className="flex items-center justify-between gap-4 text-sm"
                        >
                          <div className="flex items-center gap-3">
                            {renderProductThumbnail(item.productName)}
                            <div>
                              <p className="font-extrabold text-ink leading-snug">
                                {item.productName}
                              </p>
                              <p className="text-xs text-ink/50 mt-0.5">
                                Cantidad: <strong className="text-ink">{item.quantity}</strong>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <strong className="text-sm text-ink block">
                              {formatCLP(item.subTotal)}
                            </strong>
                            {item.quantity > 1 && (
                              <span className="text-[10px] text-ink/40 font-semibold block">
                                {formatCLP(item.subTotal / item.quantity)} c/u
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Resumen / Total */}
                    <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-2 mt-4 text-sm">
                      <span className="text-xs font-semibold text-ink/50">
                        {order.items.reduce((acc, i) => acc + i.quantity, 0)}{' '}
                        {order.items.reduce((acc, i) => acc + i.quantity, 0) === 1
                          ? 'artículo'
                          : 'artículos'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink/65 uppercase tracking-wide">
                          Total Pagado:
                        </span>
                        <strong className="text-lg font-black text-brand">
                          {formatCLP(order.totalPrice)}
                        </strong>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {/* Paginación */}
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}
