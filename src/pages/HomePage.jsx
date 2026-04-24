import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext.jsx'
import { ProductCard } from '../components/ProductCard.jsx'

export function HomePage() {
  const { loading, error, categories, products } = useProducts()
  const featured = products.slice(0, 8)

  return (
    <div>
      <section className="relative overflow-hidden bg-brand text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/80">Organic & fresh</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
            Supermercado digital hecho para Marquetazo
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/90">
            Nuevo front en React + Tailwind, integrado a tu API propia para productos, carrito, órdenes y administración.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/tienda" className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white no-underline hover:bg-orange-600 hover:text-white">
              Ver tienda
            </Link>
            <Link to="/registro" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white no-underline hover:bg-white/10 hover:text-white">
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold">Categorías</h2>
        {loading ? (
          <p className="mt-4 text-sm text-ink/60">Cargando...</p>
        ) : error ? (
          <p className="mt-4 text-sm text-red-700">No se pudo cargar el catálogo.</p>
        ) : (
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link key={c} to={`/tienda?cat=${encodeURIComponent(c)}`} className="rounded-full border border-line bg-white px-4 py-2 text-sm capitalize no-underline hover:border-brand hover:text-brand">
                {c}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-line bg-surface py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-2xl font-bold">Destacados</h2>
            <Link to="/tienda" className="text-sm font-semibold no-underline">Ver todo →</Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
            {!loading && featured.length === 0 ? <p className="col-span-full text-sm text-ink/60">Sin productos en base de datos.</p> : null}
          </div>
        </div>
      </section>
    </div>
  )
}
