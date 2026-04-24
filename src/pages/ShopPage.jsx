import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard.jsx'
import { useProducts } from '../context/ProductsContext.jsx'

const normalize = (s) => s.trim().toLowerCase()

export function ShopPage() {
  const [params] = useSearchParams()
  const cat = params.get('cat') || ''
  const q = params.get('q') || ''
  const { products, loading, error, categories } = useProducts()

  const filtered = useMemo(() => {
    let list = products
    if (cat) {
      list = list.filter((p) => normalize(String(p.category || '')) === normalize(cat))
    }
    if (q) {
      const nq = normalize(q)
      list = list.filter((p) => normalize(`${p.name} ${p.description || ''} ${p.subCategory || ''}`).includes(nq))
    }
    return list
  }, [products, cat, q])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Tienda</h1>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Filtrar por categoría</p>
          <ul className="mt-3 space-y-1">
            <li>
              <Link to="/tienda" className={`block rounded-lg px-3 py-2 text-sm no-underline ${!cat ? 'bg-brand/10 font-semibold text-brand' : 'hover:bg-surface'}`}>
                Todas
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <Link
                  to={`/tienda?cat=${encodeURIComponent(c)}`}
                  className={`block rounded-lg px-3 py-2 text-sm capitalize no-underline ${
                    normalize(c) === normalize(cat) ? 'bg-brand/10 font-semibold text-brand' : 'hover:bg-surface'
                  }`}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1">
          {loading ? <p className="text-sm text-ink/60">Cargando productos...</p> : null}
          {error ? <p className="text-sm text-red-700">{error.message}</p> : null}
          {!loading && !error ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
              {filtered.length === 0 ? <p className="col-span-full text-sm text-ink/60">No hay resultados para los filtros actuales.</p> : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
