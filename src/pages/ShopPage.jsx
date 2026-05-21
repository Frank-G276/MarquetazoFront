import { useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { formatCLP } from '../utils/money.js'

const CATEGORY_STYLES = {
  Lacteos: { icon: '🥛', label: 'Lácteos' },
  Frutas: { icon: '🍎', label: 'Frutas' },
  Verduras: { icon: '🥦', label: 'Verduras' },
  Carnes: { icon: '🥩', label: 'Carnes' },
  Bebidas: { icon: '🧃', label: 'Bebidas' },
  Abarrotes: { icon: '🛒', label: 'Abarrotes' },
  Panaderia: { icon: '🍞', label: 'Panadería' },
  Limpieza: { icon: '🧹', label: 'Limpieza' },
  Transporte: { icon: '🚗', label: 'Transporte' },
}

const normalize = (s) => String(s || '').trim().toLowerCase()

const SkeletonCard = ({ viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-line bg-white p-0 animate-pulse">
        <div className="w-full sm:w-52 shrink-0 aspect-[4/3] sm:aspect-square bg-slate-200" />
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="h-3 w-16 bg-slate-200 rounded" />
            <div className="h-5 w-2/3 bg-slate-200 rounded mt-2" />
            <div className="h-3.5 w-1/4 bg-slate-100 rounded mt-1.5" />
            <div className="h-3 w-5/6 bg-slate-200 rounded mt-3" />
            <div className="h-3 w-2/3 bg-slate-200 rounded mt-1.5" />
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="h-6 w-24 bg-slate-200 rounded" />
            <div className="flex gap-2">
              <div className="h-9 w-20 bg-slate-200 rounded-xl" />
              <div className="h-9 w-28 bg-slate-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white p-0 animate-pulse h-full">
      <div className="aspect-[4/3] bg-slate-200 w-full" />
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="h-3 w-12 bg-slate-200 rounded" />
          <div className="h-5 w-5/6 bg-slate-200 rounded mt-2" />
          <div className="h-3.5 w-1/3 bg-slate-100 rounded mt-1.5" />
        </div>
        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="h-6 w-20 bg-slate-200 rounded" />
          <div className="h-9 w-20 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function ShopPage() {
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') || ''
  const q = params.get('q') || ''
  
  const { products, loading, error, categories, reloadProducts } = useProducts()
  
  const [searchQuery, setSearchQuery] = useState(q)
  const [viewMode, setViewMode] = useState('grid')
  const [onlyOffers, setOnlyOffers] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')
  const [maxPriceFilter, setMaxPriceFilter] = useState(Infinity)

  useEffect(() => {
    setSearchQuery(q)
  }, [q])

  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 10000
    return Math.max(...products.map(p => p.price || 0))
  }, [products])

  const categoryCounts = useMemo(() => {
    const counts = {}
    products.forEach((p) => {
      const catName = p.category || ''
      if (catName) {
        counts[catName] = (counts[catName] || 0) + 1
      }
    })
    return counts
  }, [products])

  const handleSearchSubmit = (e) => {
    e?.preventDefault()
    const newParams = new URLSearchParams(params)
    if (searchQuery.trim()) {
      newParams.set('q', searchQuery.trim())
    } else {
      newParams.delete('q')
    }
    setParams(newParams)
  }

  const filtered = useMemo(() => {
    let list = products
    
    if (cat) {
      list = list.filter((p) => normalize(p.category) === normalize(cat))
    }
    
    if (q) {
      const nq = normalize(q)
      list = list.filter((p) =>
        normalize(`${p.name} ${p.description || ''} ${p.subCategory || ''}`).includes(nq)
      )
    }
    
    if (onlyOffers) {
      list = list.filter((p) => Number(p.discountPercent || 0) > 0)
    }
    
    if (maxPriceFilter && maxPriceFilter !== Infinity) {
      list = list.filter((p) => {
        const discount = Number(p.discountPercent || 0)
        const finalPrice = p.price * (1 - (discount / 100))
        return finalPrice <= maxPriceFilter
      })
    }
    
    const sorted = [...list]
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => {
        const discountA = Number(a.discountPercent || 0)
        const discountB = Number(b.discountPercent || 0)
        const pA = a.price * (1 - (discountA / 100))
        const pB = b.price * (1 - (discountB / 100))
        return pA - pB
      })
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => {
        const discountA = Number(a.discountPercent || 0)
        const discountB = Number(b.discountPercent || 0)
        const pA = a.price * (1 - (discountA / 100))
        const pB = b.price * (1 - (discountB / 100))
        return pB - pA
      })
    } else if (sortBy === 'discount-desc') {
      sorted.sort((a, b) => Number(b.discountPercent || 0) - Number(a.discountPercent || 0))
    } else if (sortBy === 'name-asc') {
      sorted.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'es'))
    }
    
    return sorted
  }, [products, cat, q, onlyOffers, maxPriceFilter, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setOnlyOffers(false)
    setMaxPriceFilter(Infinity)
    setSortBy('relevance')
    setParams({})
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 animate-fade-in">
      
      {/* Banner Superior Dinámico */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl mb-8 p-6 md:p-10 border border-slate-900 shadow-xl">
        <div className="absolute -left-20 -top-20 h-52 w-52 rounded-full bg-brand/10 blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -right-20 -bottom-20 h-52 w-52 rounded-full bg-accent/10 blur-3xl pointer-events-none animate-float" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent mb-4">
            {cat ? `📂 Categoría: ${cat}` : '🛒 Tienda Virtual'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {cat ? (
              <>
                Productos en <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-orange-400 to-yellow-300 capitalize">{cat}</span>
              </>
            ) : q ? (
              <>
                Resultados para <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-orange-400 to-yellow-300">&ldquo;{q}&rdquo;</span>
              </>
            ) : (
              'Explora todo nuestro catálogo'
            )}
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 max-w-xl">
            {cat ? `Descubre la mejor selección de ${cat.toLowerCase()} con precios e-commerce estudiantiles.` : 'Encuentra frutas de temporada, lácteos, abarrotes y más con despacho directo en tu campus.'}
          </p>

          <form onSubmit={handleSearchSubmit} className="mt-6 max-w-lg">
            <div className="relative flex items-center rounded-2xl border border-white/15 bg-white/5 p-1.5 backdrop-blur-md focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/10 transition-all">
              <span className="pl-3 text-slate-400">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en la tienda... ej: Plátano, Leche"
                className="w-full bg-transparent py-1.5 pl-2.5 pr-10 text-sm text-white placeholder-slate-400 outline-none border-none focus:ring-0 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    const newParams = new URLSearchParams(params)
                    newParams.delete('q')
                    setParams(newParams)
                  }}
                  className="absolute right-20 text-slate-400 hover:text-white px-2 py-1 text-xs"
                >
                  ✕
                </button>
              )}
              <button
                type="submit"
                className="rounded-xl bg-accent px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-orange-650 transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        
        {/* Barra Lateral de Filtros (Sidebar) */}
        <aside className="lg:w-64 lg:shrink-0 flex flex-col gap-6">
          
          <div className="bg-white rounded-2xl border border-line p-5 shadow-sm space-y-6">
            
            {/* Categorías */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40">Categorías</span>
              <ul className="mt-3 space-y-1">
                <li>
                  <Link
                    to="/tienda"
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-all no-underline ${
                      !cat
                        ? 'bg-brand/10 text-brand'
                        : 'text-ink/75 hover:bg-slate-50 hover:text-ink'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>📦</span>
                      <span>Todas</span>
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-ink/60 font-medium border border-slate-200">
                      {products.length}
                    </span>
                  </Link>
                </li>
                {categories.map((c) => {
                  const style = CATEGORY_STYLES[c] || { icon: '📦', label: c }
                  const count = categoryCounts[c] || 0
                  const isActive = normalize(c) === normalize(cat)
                  
                  return (
                    <li key={c}>
                      <Link
                        to={`/tienda?cat=${encodeURIComponent(c)}`}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-all no-underline ${
                          isActive
                            ? 'bg-brand/10 text-brand'
                            : 'text-ink/75 hover:bg-slate-50 hover:text-ink'
                        }`}
                      >
                        <span className="flex items-center gap-2 capitalize">
                          <span>{style.icon}</span>
                          <span>{c}</span>
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-ink/60 font-medium border border-slate-200">
                          {count}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Filtros Especiales: Solo Ofertas */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40">Filtros Especiales</span>
              <div className="mt-3">
                <label className="relative flex items-center justify-between cursor-pointer rounded-xl border border-line bg-surface p-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🔥</span>
                    <span className="text-xs font-bold text-ink">Solo Ofertas</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={onlyOffers}
                    onChange={(e) => setOnlyOffers(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-350 text-brand focus:ring-brand accent-brand cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Filtro de Rango de Precio Máximo */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40">Rango de precio máximo</span>
              <div className="mt-3 space-y-3">
                {products.length > 0 && (
                  <div>
                    <input
                      type="range"
                      min="0"
                      max={maxProductPrice}
                      step="100"
                      value={maxPriceFilter === Infinity ? maxProductPrice : maxPriceFilter}
                      onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand"
                    />
                    <div className="flex justify-between items-center mt-1.5 text-xs font-semibold text-ink/60">
                      <span>$0</span>
                      <span className="text-brand font-bold bg-brand/5 px-2 py-0.5 rounded border border-brand/10">
                        Hasta {formatCLP(maxPriceFilter === Infinity ? maxProductPrice : maxPriceFilter)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {[1500, 3000, 5000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setMaxPriceFilter(val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                        maxPriceFilter === val
                          ? 'bg-brand border-brand text-white shadow-sm'
                          : 'bg-surface border-line text-ink/75 hover:bg-slate-50'
                      }`}
                    >
                      &lt; {formatCLP(val)}
                    </button>
                  ))}
                  <button
                    onClick={() => setMaxPriceFilter(Infinity)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                      maxPriceFilter === Infinity
                        ? 'bg-brand border-brand text-white shadow-sm'
                        : 'bg-surface border-line text-ink/75 hover:bg-slate-50'
                    }`}
                  >
                    Todos
                  </button>
                </div>
              </div>
            </div>

          </div>
        </aside>

        {/* Sección de Productos */}
        <div className="flex-1">
          
          {/* Faja de Ordenación e Información */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white border border-line rounded-2xl p-4 shadow-sm">
            <div className="text-sm font-medium text-ink/70">
              {loading ? (
                <span>Buscando productos...</span>
              ) : (
                <span>
                  Mostrando <strong className="text-ink">{filtered.length}</strong> {filtered.length === 1 ? 'producto' : 'productos'}
                  {(cat || q || onlyOffers || maxPriceFilter !== Infinity) && ' con filtros aplicados'}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end">
              <div className="flex items-center gap-2">
                <label htmlFor="sortBy" className="text-xs font-semibold uppercase text-ink/40 tracking-wider">Ordenar por</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink outline-none cursor-pointer focus:border-brand"
                >
                  <option value="relevance">Relevancia</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="discount-desc">Mayor Descuento</option>
                  <option value="name-asc">Nombre (A-Z)</option>
                </select>
              </div>
              
              <div className="flex items-center border border-line rounded-xl bg-surface p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label="Vista cuadrícula"
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-brand shadow-sm font-semibold' : 'text-ink/40 hover:text-ink'}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  aria-label="Vista lista"
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-brand shadow-sm font-semibold' : 'text-ink/40 hover:text-ink'}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Estado de Error */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
              <p className="text-sm text-red-700 font-semibold">{error.message || 'No se pudieron cargar los productos de la tienda.'}</p>
              <button onClick={reloadProducts} className="mt-3 rounded-xl bg-red-650 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-all">
                Intentar de nuevo
              </button>
            </div>
          )}

          {/* Catálogo de Productos */}
          {!error && (
            <>
              {loading ? (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} viewMode={viewMode} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-white border border-line rounded-3xl p-8 shadow-sm">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4 text-3xl">
                    🔍
                  </div>
                  <h3 className="text-base font-bold text-ink">No encontramos productos</h3>
                  <p className="mt-2 text-xs text-ink/65 max-w-xs mx-auto">
                    No hay ningún producto disponible que coincida con los filtros y la búsqueda actual.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-6 rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-dark transition-all"
                  >
                    Limpiar todos los filtros
                  </button>
                </div>
              ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {filtered.map((p) => (
                    <ProductCard key={p._id} product={p} viewMode={viewMode} />
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}
