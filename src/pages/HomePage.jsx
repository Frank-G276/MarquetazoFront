import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard.jsx'
import { useProducts } from '../context/ProductsContext.jsx'

const CATEGORY_ICONS = {
  Lacteos: '🥛',
  Frutas: '🍎',
  Verduras: '🥦',
  Carnes: '🥩',
  Bebidas: '🧃',
  Abarrotes: '🛒',
  Panaderia: '🍞',
  Limpieza: '🧹',
  Transporte: '🚗',
}

export function HomePage() {
  const { loading, error, categories, products, reloadProducts } = useProducts()

  const byCategory = useMemo(() => {
    return categories.map((cat) => ({
      name: cat,
      icon: CATEGORY_ICONS[cat] || '📦',
      items: products.filter((p) => p.category === cat).slice(0, 4),
    })).filter((c) => c.items.length > 0)
  }, [categories, products])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/80">Bienvenido a</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
            Marquetazo
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/90">
            Encuentra todo lo que necesitas: frutas, lácteos, carnes, bebidas y mucho más.
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

      {/* Categorías en pills */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-xl font-bold text-ink">Explorar por categoría</h2>
        {loading ? (
          <p className="mt-4 text-sm text-ink/60">Cargando...</p>
        ) : error ? (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <p>No se pudo cargar el catálogo.</p>
            <button onClick={reloadProducts} className="mt-1 font-semibold underline">Reintentar</button>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c}
                to={`/tienda?cat=${encodeURIComponent(c)}`}
                className="flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm capitalize no-underline transition hover:border-brand hover:text-brand"
              >
                <span>{CATEGORY_ICONS[c] || '📦'}</span>
                {c}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Sección por categoría */}
      {!loading && !error && byCategory.map((cat, idx) => (
        <section
          key={cat.name}
          className={`py-10 ${idx % 2 === 0 ? 'bg-surface' : 'bg-white'}`}
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
                <span>{cat.icon}</span>
                {cat.name}
              </h2>
              <Link
                to={`/tienda?cat=${encodeURIComponent(cat.name)}`}
                className="text-sm font-semibold text-brand no-underline hover:underline"
              >
                Ver todo →
              </Link>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {cat.items.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {!loading && !error && byCategory.length === 0 ? (
        <div className="py-16 text-center text-sm text-ink/60">
          Sin productos en base de datos.{' '}
          <Link to="/panel" className="font-semibold text-brand no-underline">Agregar productos →</Link>
        </div>
      ) : null}
    </div>
  )
}
