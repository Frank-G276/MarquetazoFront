import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard.jsx'
import { useProducts } from '../context/ProductsContext.jsx'

const normalize = (s) => String(s || '').toLowerCase().trim()

export function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const { products, loading, error, reloadProducts } = useProducts()

  const results = useMemo(() => {
    if (!q.trim()) return []
    const nq = normalize(q)
    return products.filter((p) =>
      normalize(p.name).includes(nq) ||
      normalize(p.category).includes(nq) ||
      normalize(p.subCategory).includes(nq) ||
      normalize(p.description).includes(nq)
    )
  }, [q, products])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="border-b border-line pb-5">
        <p className="text-xs uppercase tracking-widest text-ink/40">Resultados de búsqueda</p>
        <h1 className="mt-1 text-2xl font-bold text-ink">
          {q ? (
            <>
              {loading ? 'Buscando' : results.length}{' '}
              {!loading && (results.length === 1 ? 'resultado' : 'resultados')} para{' '}
              <span className="text-brand">&ldquo;{q}&rdquo;</span>
            </>
          ) : (
            'Escribe algo para buscar'
          )}
        </h1>
      </div>

      {/* Estados */}
      {loading ? (
        <div className="mt-10 text-center text-sm text-ink/50">Cargando productos...</div>
      ) : error ? (
        <div className="mt-10 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          <p>No se pudo cargar el catálogo.</p>
          <button onClick={reloadProducts} className="mt-1 font-semibold underline">Reintentar</button>
        </div>
      ) : !q.trim() ? (
        <div className="mt-16 text-center">
          <p className="text-5xl">🔍</p>
          <p className="mt-4 text-sm text-ink/60">Usa el buscador de arriba para encontrar productos.</p>
          <Link to="/tienda" className="mt-4 inline-block rounded-full bg-brand px-5 py-2 text-sm font-bold text-white no-underline hover:bg-brand-dark">
            Ver todos los productos
          </Link>
        </div>
      ) : results.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-5xl">😕</p>
          <p className="mt-4 text-base font-semibold text-ink">Sin resultados para &ldquo;{q}&rdquo;</p>
          <p className="mt-1 text-sm text-ink/60">Intenta con otro término o explora por categoría.</p>
          <Link to="/tienda" className="mt-6 inline-block rounded-full bg-brand px-5 py-2 text-sm font-bold text-white no-underline hover:bg-brand-dark">
            Ver toda la tienda
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
