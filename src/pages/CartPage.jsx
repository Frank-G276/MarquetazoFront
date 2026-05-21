import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as ordersApi from '../api/orders.js'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { finalUnitPrice, formatCLP } from '../utils/money.js'
import { getProductPrimaryImage } from '../utils/productImage.js'
import { Pagination } from '../components/Pagination.jsx'

export function CartPage() {
  const { cart, loading, removeItem, refreshCart } = useCart()
  const { products: allProducts } = useProducts()
  const navigate = useNavigate()
  
  const [checkoutError, setCheckoutError] = useState('')
  const [removeError, setRemoveError] = useState('')
  const [checkingOut, setCheckingOut] = useState(false)

  const ITEMS_PER_PAGE = 5
  const [currentPage, setCurrentPage] = useState(1)

  const items = cart?.items || []
  
  // Calculate cart total
  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      // Find matching catalog product to compute price correctly
      const catalogProduct = allProducts.find((p) => p._id === item.product?._id)
      const p = catalogProduct || item.product
      return acc + finalUnitPrice(p) * item.quantity
    }, 0)
  }, [items, allProducts])

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)

  // Adjust current page if items are removed and page becomes empty
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [items.length, totalPages, currentPage])

  // Paginated items
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return items.slice(start, start + ITEMS_PER_PAGE)
  }, [items, currentPage])

  const checkout = async () => {
    setCheckoutError('')
    setCheckingOut(true)
    try {
      await ordersApi.createOrder()
      await refreshCart()
      navigate('/mis-pedidos')
    } catch (err) {
      setCheckoutError(err.message || 'No se pudo generar la orden')
    } finally {
      setCheckingOut(false)
    }
  }

  const handleRemove = async (productId) => {
    setRemoveError('')
    try {
      await removeItem(productId)
    } catch (err) {
      setRemoveError(err.message || 'No se pudo quitar el producto')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 animate-fade-in">
      {/* Header Estilizado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 border border-brand/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand mb-3">
            🛒 Tu Compra
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
            Carrito de Compras
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-ink/60">
            {items.length === 0 
              ? 'No tienes productos seleccionados todavía.' 
              : `Tienes ${items.length} ${items.length === 1 ? 'producto' : 'productos'} listos para comprar.`}
          </p>
        </div>
        {items.length > 0 && (
          <Link
            to="/tienda"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink/75 hover:bg-slate-50 transition-all no-underline shadow-sm w-fit active:scale-95"
          >
            ← Continuar comprando
          </Link>
        )}
      </div>

      {/* Cargando carrito */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-line rounded-3xl p-8 shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent mb-4" />
          <p className="text-sm font-semibold text-ink/70">Cargando tu carrito...</p>
        </div>
      ) : null}

      {/* Carrito Vacío */}
      {!loading && items.length === 0 ? (
        <div className="text-center py-16 bg-white border border-line rounded-3xl p-8 shadow-sm max-w-xl mx-auto animate-fade-in">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-6 text-4xl shadow-inner">
            🛍️
          </div>
          <h3 className="text-lg font-bold text-ink">Tu carrito está vacío</h3>
          <p className="mt-2 text-xs sm:text-sm text-ink/65 max-w-sm mx-auto leading-relaxed">
            Parece que aún no has agregado productos a tu carrito. ¡Explora nuestro catálogo y encuentra los mejores precios estudiantiles!
          </p>
          <Link
            to="/tienda"
            className="mt-8 inline-block rounded-xl bg-brand px-6 py-3 text-xs sm:text-sm font-bold text-white no-underline hover:bg-brand-dark hover:text-white shadow-md shadow-brand/10 active:scale-95 transition-all"
          >
            Explorar catálogo de la tienda
          </Link>
        </div>
      ) : null}

      {/* Listado de items y resumen */}
      {!loading && items.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Listado de Productos */}
          <div className="space-y-4">
            {paginatedItems.map((item) => {
              // Cruce de datos con la lista global para corregir el bug de imágenes y detalles completos
              const catalogProduct = allProducts.find((p) => p._id === item.product?._id)
              const p = catalogProduct || item.product
              const image = getProductPrimaryImage(p)

              return (
                <article
                  key={item._id || p?._id}
                  className="group flex flex-col sm:flex-row items-center gap-5 rounded-2xl border border-line bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                >
                  {/* Imagen del Producto */}
                  <div className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-white border border-slate-100 flex items-center justify-center p-2 shadow-inner relative">
                    {image ? (
                      <img src={image} alt="" className="h-full w-full object-contain transition duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl font-extrabold text-brand/35 bg-gradient-to-br from-brand/5 to-brand/15 uppercase rounded-lg">
                        {p?.name?.[0] || '?'}
                      </div>
                    )}
                  </div>

                  {/* Detalles del Producto */}
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand/80 bg-brand/5 px-2 py-0.5 rounded-md border border-brand/5">
                      {p?.category || 'Producto'}
                    </span>
                    <p className="mt-2 text-base font-extrabold text-ink leading-snug">
                      {p?.name || 'Producto sin nombre'}
                    </p>
                    
                    {p?.subCategory && (
                      <span className="inline-block mt-1 text-[10px] font-medium bg-slate-100 text-ink/65 px-2 py-0.5 rounded border border-slate-200">
                        {p.subCategory}
                      </span>
                    )}

                    <div className="mt-3 flex flex-wrap justify-center sm:justify-start items-center gap-3 text-xs">
                      <span className="font-semibold text-slate-500">
                        {formatCLP(finalUnitPrice(p))} c/u
                      </span>
                      {Number(p?.discountPercent || 0) > 0 && (
                        <span className="bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded border border-red-100 text-[10px]">
                          -{p.discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Acciones y Subtotal */}
                  <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center gap-4 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0 sm:pl-4 sm:border-l sm:text-right min-w-[120px]">
                    <div className="text-left sm:text-right">
                      <span className="block text-[10px] font-bold text-ink/40 uppercase tracking-wider">Subtotal</span>
                      <p className="text-base font-extrabold text-brand mt-0.5">
                        {formatCLP(finalUnitPrice(p) * item.quantity)}
                      </p>
                      <span className="text-[11px] font-medium text-ink/60 block mt-0.5">
                        Cantidad: <strong className="text-ink">{item.quantity}</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(p?._id)}
                      className="inline-flex items-center gap-1 rounded-xl bg-red-50 hover:bg-red-100 px-3.5 py-2 text-xs font-bold text-red-600 transition-colors cursor-pointer active:scale-95 shadow-sm"
                      aria-label="Quitar producto"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Quitar</span>
                    </button>
                  </div>
                </article>
              )
            })}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>

          {/* Resumen lateral Oscuro Premium */}
          <aside className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl h-fit">
            {/* Elementos de gradiente flotantes de fondo */}
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
            <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent mb-4">
                📋 Resumen de Pedido
              </span>

              <div className="space-y-4 border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Productos en carrito</span>
                  <span className="font-semibold text-white">{items.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Cantidad total</span>
                  <span className="font-semibold text-white">
                    {items.reduce((acc, item) => acc + item.quantity, 0)} uds
                  </span>
                </div>
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm font-semibold text-slate-300">Total a pagar</span>
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent via-orange-400 to-yellow-300">
                  {formatCLP(total)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                El backend validará stock y recalculará descuentos finales al procesar el pedido.
              </p>

              {removeError && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 flex items-start gap-2 animate-pulse">
                  <span>⚠️</span>
                  <span>{removeError}</span>
                </div>
              )}

              {checkoutError && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 flex items-start gap-2 animate-pulse">
                  <span>⚠️</span>
                  <span>{checkoutError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={checkout}
                disabled={checkingOut}
                className="mt-6 w-full rounded-2xl bg-accent hover:bg-orange-600 py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98] shadow-md shadow-accent/25 hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
              >
                {checkingOut ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <span>Finalizar Compra</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  )
}
