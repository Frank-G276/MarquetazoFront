import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { finalUnitPrice, formatCLP } from '../utils/money.js'
import { getProductPrimaryImage } from '../utils/productImage.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export function ProductCard({ product, viewMode = 'grid' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { addItem } = useCart()

  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const image = getProductPrimaryImage(product)
  const finalPrice = finalUnitPrice(product)
  const discount = Number(product.discountPercent || 0)
  const isOutOfStock = product.stock !== undefined && Number(product.stock) <= 0

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      navigate('/login', { state: { from: location.pathname + location.search } })
      return
    }

    setAdding(true)
    try {
      await addItem(product._id, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (err) {
      alert(err.message || 'No se pudo agregar al carrito')
    } finally {
      setAdding(false)
    }
  }

  if (viewMode === 'list') {
    return (
      <article className="group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-355 hover:shadow-md">
        {/* Left Side: Image */}
        <Link to={`/producto/${product._id}`} className="block w-full sm:w-52 shrink-0 aspect-[4/3] sm:aspect-square overflow-hidden bg-white no-underline relative">
          {image ? (
            <img src={image} alt="" className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl font-bold text-brand/35 bg-slate-50">
              {product.name?.[0] || '?'}
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-3 left-3 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              -{discount}%
            </span>
          )}
        </Link>
        
        {/* Right Side: Info */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-ink/40">{product.category}</p>
              <Link to={`/producto/${product._id}`} className="mt-1 block text-lg font-bold text-ink no-underline hover:text-brand transition-colors">
                {product.name}
              </Link>
              {product.subCategory && (
                <span className="inline-block mt-1.5 text-xs rounded bg-slate-100 px-2 py-0.5 text-ink/60 font-medium">
                  {product.subCategory}
                </span>
              )}
            </div>
          </div>
          
          {product.description && (
            <p className="mt-3 text-sm text-ink/70 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
          
          <div className="mt-6 sm:mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-ink">{formatCLP(finalPrice)}</span>
              {discount > 0 && (
                <span className="text-sm text-ink/40 line-through">{formatCLP(product.price)}</span>
              )}
              {product.stock !== undefined && (
                <span className={`ml-3 text-xs font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                to={`/producto/${product._id}`}
                className="rounded-xl border border-line px-4 py-2.5 text-xs font-bold text-ink/75 hover:bg-slate-50 transition-colors no-underline text-center flex-1 sm:flex-none"
              >
                Ver Detalle
              </Link>
              <button
                onClick={handleAddToCart}
                disabled={adding || isOutOfStock}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all flex-1 sm:flex-none ${
                  added 
                    ? 'bg-emerald-500 hover:bg-emerald-600' 
                    : 'bg-brand hover:bg-brand-dark hover:scale-[1.02] active:scale-98 shadow-md shadow-brand/10'
                } disabled:opacity-50`}
              >
                {adding ? (
                  <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                ) : added ? (
                  <>✓ Agregado</>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Agregar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative">
      {discount > 0 && (
        <span className="absolute top-3 left-3 z-10 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white shadow-sm">
          -{discount}%
        </span>
      )}
      
      <Link to={`/producto/${product._id}`} className="block aspect-[4/3] overflow-hidden bg-white no-underline relative">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl font-bold text-brand/35 bg-slate-50">
            {product.name?.[0] || '?'}
          </div>
        )}
      </Link>
      
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[10px] uppercase font-semibold tracking-wider text-ink/40">{product.category}</p>
        <Link to={`/producto/${product._id}`} className="mt-1 line-clamp-2 text-base font-bold text-ink no-underline hover:text-brand transition-colors flex-1 min-h-[3rem]">
          {product.name}
        </Link>
        
        {product.subCategory && (
          <div className="mt-1">
            <span className="inline-block text-[10px] rounded bg-slate-100 px-2 py-0.5 text-ink/60 font-medium">
              {product.subCategory}
            </span>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {discount > 0 && (
              <span className="text-xs text-ink/40 line-through">{formatCLP(product.price)}</span>
            )}
            <span className="text-lg font-extrabold text-ink">{formatCLP(finalPrice)}</span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={adding || isOutOfStock}
            className={`flex h-10 items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-bold text-white transition-all ${
              added 
                ? 'bg-emerald-500 hover:bg-emerald-600' 
                : 'bg-brand hover:bg-brand-dark hover:scale-[1.02] active:scale-98 shadow-sm shadow-brand/10'
            } disabled:opacity-50`}
          >
            {adding ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : added ? (
              <>✓</>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0" />
                </svg>
                <span>Añadir</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
