import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard.jsx'
import { useProducts } from '../context/ProductsContext.jsx'

const CATEGORY_STYLES = {
  Lacteos: { icon: '🥛', bg: 'from-blue-50 to-indigo-50 border-blue-100 text-blue-700', hover: 'hover:border-blue-300 hover:shadow-blue-50' },
  Frutas: { icon: '🍎', bg: 'from-rose-50 to-orange-50 border-rose-100 text-rose-700', hover: 'hover:border-rose-300 hover:shadow-rose-50' },
  Verduras: { icon: '🥦', bg: 'from-green-50 to-emerald-50 border-green-100 text-green-700', hover: 'hover:border-green-300 hover:shadow-green-50' },
  Carnes: { icon: '🥩', bg: 'from-red-50 to-rose-100 border-red-100 text-red-700', hover: 'hover:border-red-300 hover:shadow-red-50' },
  Bebidas: { icon: '🧃', bg: 'from-cyan-50 to-sky-50 border-cyan-100 text-cyan-700', hover: 'hover:border-cyan-300 hover:shadow-cyan-50' },
  Abarrotes: { icon: '🛒', bg: 'from-amber-50 to-yellow-50 border-amber-100 text-amber-700', hover: 'hover:border-amber-300 hover:shadow-amber-50' },
  Panaderia: { icon: '🍞', bg: 'from-orange-50 to-amber-50 border-orange-100 text-orange-700', hover: 'hover:border-orange-300 hover:shadow-orange-50' },
  Limpieza: { icon: '🧹', bg: 'from-purple-50 to-fuchsia-50 border-purple-100 text-purple-700', hover: 'hover:border-purple-300 hover:shadow-purple-50' },
  Transporte: { icon: '🚗', bg: 'from-slate-50 to-zinc-50 border-slate-100 text-slate-700', hover: 'hover:border-slate-300 hover:shadow-slate-50' },
}

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    title: 'Frescura Garantizada',
    desc: 'Frutas y verduras seleccionadas de forma diaria para ti.',
  },
  {
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    title: 'Despacho en tu Campus',
    desc: 'Recibes tus compras en tu facultad o punto de encuentro favorito.',
  },
  {
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=800&q=80',
    title: 'Ahorro Estudiantil',
    desc: 'Abarrotes, lácteos y más a precios amigables con tu bolsillo.',
  }
]

export function HomePage() {
  const { loading, error, categories, products, reloadProducts } = useProducts()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSlide, setActiveSlide] = useState(0)
  const navigate = useNavigate()

  const byCategory = useMemo(() => {
    return categories.map((cat) => ({
      name: cat,
      icon: CATEGORY_STYLES[cat]?.icon || '📦',
      items: products.filter((p) => p.category === cat).slice(0, 4),
    })).filter((c) => c.items.length > 0)
  }, [categories, products])

  const discountedProducts = useMemo(() => {
    return products.filter((p) => Number(p.discountPercent || 0) > 0).slice(0, 4)
  }, [products])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const q = searchQuery.trim()
    navigate(q ? `/buscar?q=${encodeURIComponent(q)}` : '/tienda')
  }

  // Auto-play interval for the image slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-16 lg:py-24 border-b border-slate-900">
        {/* Animated decorative elements */}
        <div className="absolute -left-36 top-1/4 h-96 w-96 rounded-full bg-brand/10 blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -right-36 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl pointer-events-none animate-float" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="mx-auto max-w-6xl px-4 relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Left Column: Text & Search */}
            <div className="lg:col-span-7 animate-fade-in-up">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent mb-6">
                ✨ El supermercado oficial de tu campus
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Tu despensa universitaria <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-orange-400 to-yellow-300">
                  fresca, rápida y barata
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed">
                Encuentra frutas de temporada, lácteos, carnes, bebidas y mucho más.
                Diseñado por y para estudiantes, con entregas flexibles en tu facultad o departamento.
              </p>

              {/* Interactive Search Bar */}
              <form onSubmit={handleSearchSubmit} className="mt-8 max-w-lg">
                <div className="relative flex items-center rounded-2xl border border-white/15 bg-white/5 p-1.5 backdrop-blur-md focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/20 transition-all">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="¿Qué te gustaría comprar hoy? Ej. Plátanos, Bebidas..."
                    className="w-full bg-transparent py-2 pl-4 pr-12 text-sm text-white placeholder-slate-400 outline-none border-none focus:ring-0 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white shadow-lg shadow-accent/25 hover:bg-orange-600 transition-all hover:scale-105 active:scale-95"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span>Búsquedas populares:</span>
                <Link to="/tienda?cat=Frutas" className="rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 px-2.5 py-1 text-slate-300 no-underline transition-all">🍎 Frutas</Link>
                <Link to="/tienda?cat=Lacteos" className="rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 px-2.5 py-1 text-slate-300 no-underline transition-all">🥛 Lácteos</Link>
                <Link to="/tienda?cat=Bebidas" className="rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 px-2.5 py-1 text-slate-300 no-underline transition-all">🧃 Bebidas</Link>
              </div>
            </div>

            {/* Right Column: Custom Graphics/Slideshow */}
            <div className="lg:col-span-5 w-full">
              <div className="relative h-64 sm:h-80 md:h-[360px] lg:h-[400px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-slate-950">
                {HERO_SLIDES.map((slide, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-full object-cover transition-transform duration-[5000ms] ease-linear scale-100"
                      style={{ transform: idx === activeSlide ? 'scale(1.08)' : 'scale(1)' }}
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                    
                    {/* Captions */}
                    <div className="absolute bottom-6 left-6 right-6 text-left">
                      <span className="inline-block rounded-full bg-accent/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        Destacado
                      </span>
                      <h3 className="mt-2 text-xl font-bold text-white tracking-tight">{slide.title}</h3>
                      <p className="mt-1 text-xs text-slate-300 leading-relaxed">{slide.desc}</p>
                    </div>
                  </div>
                ))}
                
                {/* Manual slide indicators */}
                <div className="absolute bottom-4 right-4 flex gap-1.5 z-20">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`Ir al slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === activeSlide ? 'w-6 bg-accent' : 'w-2 bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Floating Value Cards */}
      <section className="relative z-20 -mt-10 mx-auto max-w-6xl px-4 animate-fade-in-up">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-4 rounded-2xl border border-line bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Despacho Flexible</h3>
              <p className="mt-1 text-xs text-ink/75 leading-relaxed">Coordinamos la entrega directamente en tu facultad, departamento o área de estudio.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-line bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Calidad Seleccionada</h3>
              <p className="mt-1 text-xs text-ink/75 leading-relaxed">Frutas de temporada, lácteos y abarrotes cuidadosamente revisados antes de despachar.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-line bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">Ahorro Estudiantil</h3>
              <p className="mt-1 text-xs text-ink/75 leading-relaxed">Precios competitivos y ofertas semanales especiales para cuidar el presupuesto de los alumnos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">Nuestras Secciones</p>
          <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">Explora por Categoría</h2>
          <p className="mt-3 text-sm text-ink/70">Todo lo necesario para tu día a día en un solo lugar.</p>
        </div>

        {loading ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            <p className="text-sm text-ink/60 font-medium">Cargando catálogo...</p>
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl bg-red-50 p-6 text-center border border-red-100 max-w-md mx-auto">
            <p className="text-sm font-medium text-red-800">No se pudo cargar el catálogo de categorías.</p>
            <button onClick={reloadProducts} className="mt-3 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark transition-colors">
              Reintentar
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((c) => {
              const style = CATEGORY_STYLES[c] || { icon: '📦', bg: 'from-gray-50 to-slate-50 border-gray-100 text-gray-700', hover: 'hover:border-gray-300 hover:shadow-gray-50' }
              return (
                <Link
                  key={c}
                  to={`/tienda?cat=${encodeURIComponent(c)}`}
                  className={`group flex flex-col items-center justify-center rounded-2xl border bg-gradient-to-br ${style.bg} p-6 text-center no-underline shadow-sm transition-all duration-300 hover:-translate-y-1.5 ${style.hover} hover:shadow-md`}
                >
                  <span className="text-4xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">{style.icon}</span>
                  <span className="mt-4 text-sm font-bold text-ink capitalize transition-colors">{c}</span>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Offers Section */}
      {!loading && !error && discountedProducts.length > 0 ? (
        <section className="relative overflow-hidden bg-brand/5 border-y border-brand/10 py-16">
          <div className="absolute top-1/2 left-0 h-48 w-48 rounded-full bg-accent/5 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-brand/5 blur-2xl pointer-events-none" />

          <div className="mx-auto max-w-6xl px-4 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent animate-pulse-slow">
                  🔥 Ahorro Activo
                </span>
                <h2 className="mt-3 text-3xl font-extrabold text-ink tracking-tight">Ofertas Relámpago</h2>
                <p className="mt-2 text-sm text-ink/75">Precios especiales para que tu presupuesto rinda más esta semana.</p>
              </div>
              <Link
                to="/tienda"
                className="rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white no-underline shadow-md shadow-brand/20 hover:bg-brand-dark transition-all hover:scale-105 active:scale-95"
              >
                Ver todo el catálogo
              </Link>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {discountedProducts.map((p) => (
                <div key={p._id} className="relative group transition-all duration-300 hover:scale-[1.02] h-full">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent/20 to-brand/20 opacity-0 group-hover:opacity-100 blur transition duration-500 pointer-events-none" />
                  <div className="relative h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-line">
                    <ProductCard product={p} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Grid Products per Category */}
      {!loading && !error && byCategory.map((cat, idx) => (
        <section
          key={cat.name}
          className={`py-16 ${idx % 2 === 0 ? 'bg-surface' : 'bg-white'}`}
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h2 className="flex items-center gap-3 text-2xl font-extrabold text-ink">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-xl shadow-inner">{cat.icon}</span>
                <span>{cat.name}</span>
              </h2>
              <Link
                to={`/tienda?cat=${encodeURIComponent(cat.name)}`}
                className="group text-sm font-bold text-brand no-underline hover:text-brand-dark flex items-center gap-1"
              >
                <span>Ver todo</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {cat.items.map((p) => (
                <div key={p._id} className="transition-all duration-300 hover:-translate-y-1">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Why Choose Us */}
      <section className="mx-auto max-w-6xl px-4 py-20 border-t border-line">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">Pensado para Estudiantes</p>
          <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">La Experiencia Marquetazo</h2>
          <p className="mt-3 text-sm text-ink/70">Simplificamos las compras para que te enfoques en lo que realmente importa.</p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm hover:shadow-md transition-all hover:scale-105 duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-bold text-ink">Compra Rápida</h3>
            <p className="mt-2 text-xs text-ink/75 leading-relaxed">Selecciona tus productos en segundos y paga de forma simple y protegida.</p>
          </div>

          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm hover:shadow-md transition-all hover:scale-105 duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-bold text-ink">Puntos de Entrega</h3>
            <p className="mt-2 text-xs text-ink/75 leading-relaxed">Retira en puntos estratégicos de tu facultad o recíbelo directamente en tu puerta.</p>
          </div>

          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm hover:shadow-md transition-all hover:scale-105 duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-bold text-ink">Precios Justos</h3>
            <p className="mt-2 text-xs text-ink/75 leading-relaxed">Convenios con proveedores para entregarte ofertas que cuidan tu presupuesto.</p>
          </div>

          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm hover:shadow-md transition-all hover:scale-105 duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-bold text-ink">Soporte Directo</h3>
            <p className="mt-2 text-xs text-ink/75 leading-relaxed">Atención personalizada y ágil en caso de cualquier cambio con tu pedido.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface border-t border-line py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-accent">Testimonios</p>
            <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">Voces del Campus</h2>
            <p className="mt-3 text-sm text-ink/70">Descubre las opiniones de la comunidad estudiantil que ya confía en nosotros.</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div>
                <div className="flex text-amber-400 gap-0.5">★★★★★</div>
                <p className="mt-4 text-sm text-ink/80 italic leading-relaxed">
                  &ldquo;Marquetazo me ha salvado en periodos de certámenes. Coordino el despacho en el pasto de mi facultad y me entregan todo fresco y listo.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white font-bold text-sm">SV</div>
                <div>
                  <h4 className="text-sm font-bold text-ink">Sofía Valenzuela</h4>
                  <p className="text-xs text-ink/65 font-medium">Ingeniería Civil</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div>
                <div className="flex text-amber-400 gap-0.5">★★★★★</div>
                <p className="mt-4 text-sm text-ink/80 italic leading-relaxed">
                  &ldquo;Los precios son de verdad más bajos que en los supermercados de la zona. Se nota que entienden las necesidades y bolsillos estudiantiles.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white font-bold text-sm">MP</div>
                <div>
                  <h4 className="text-sm font-bold text-ink">Matías Pérez</h4>
                  <p className="text-xs text-ink/65 font-medium">Medicina</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div>
                <div className="flex text-amber-400 gap-0.5">★★★★★</div>
                <p className="mt-4 text-sm text-ink/80 italic leading-relaxed">
                  &ldquo;Organizar las compras para el departamento con mis compañeros ahora es súper simple. Ahorramos en despacho y el catálogo tiene de todo.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-650 text-white font-bold text-sm">CR</div>
                <div>
                  <h4 className="text-sm font-bold text-ink">Camila Rojas</h4>
                  <p className="text-xs text-ink/65 font-medium">Derecho</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* No products empty state */}
      {!loading && !error && byCategory.length === 0 ? (
        <div className="py-20 text-center border-t border-line">
          <p className="text-base text-ink/60">No se encontraron productos disponibles en el catálogo en este momento.</p>
          <Link to="/panel" className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white no-underline hover:bg-brand-dark transition-all">
            <span>Agregar productos</span>
            <span>→</span>
          </Link>
        </div>
      ) : null}
    </div>
  )
}
