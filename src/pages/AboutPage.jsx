import { useEffect, useRef, useState } from 'react'

/* ── Animación de entrada con IntersectionObserver ── */
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

/* ── Contador animado ── */
function Counter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  const { ref, visible } = useReveal()
  useEffect(() => {
    if (!visible) return
    let start = 0
    const step = Math.ceil(target / 60)
    const id = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(id) }
      else setCount(start)
    }, 16)
    return () => clearInterval(id)
  }, [visible, target])
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString('es-CL')}{suffix}
    </span>
  )
}

/* ── Tarjeta de valor ── */
function ValueCard({ icon, title, description, delay = 0 }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`group relative flex flex-col gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm
        transition-all duration-700 hover:-translate-y-1 hover:shadow-lg hover:border-brand/30
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-2xl
        group-hover:bg-brand group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink/60">{description}</p>
      </div>
    </div>
  )
}

/* ── Paso de línea de tiempo ── */
function TimelineStep({ year, title, description, isLast = false }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className={`flex gap-6 transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white ring-4 ring-brand/20">
          {year.toString().slice(2)}
        </div>
        {!isLast && <div className="mt-2 w-0.5 flex-1 bg-gradient-to-b from-brand/40 to-transparent" />}
      </div>
      <div className={`pb-8 ${isLast ? '' : ''}`}>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">{year}</p>
        <h4 className="mt-0.5 text-base font-bold text-ink">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-ink/60">{description}</p>
      </div>
    </div>
  )
}

/* ── Miembro del equipo ── */
function TeamMember({ emoji, name, role, description }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={`group flex flex-col items-center gap-3 rounded-2xl border border-line bg-white p-6 text-center
        shadow-sm transition-all duration-700 hover:-translate-y-1 hover:shadow-lg hover:border-brand/30
        ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand/10 to-accent/10
        text-4xl ring-4 ring-brand/10 group-hover:ring-brand/30 transition-all duration-300">
        {emoji}
      </div>
      <div>
        <p className="font-bold text-ink">{name}</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">{role}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">{description}</p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════ PÁGINA PRINCIPAL ══════════════════════════════════ */
export function AboutPage() {
  const heroRef = useRef(null)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-surface">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-24 text-white">
        {/* Patrón decorativo */}
        <div className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Blobs */}
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

        <div
          ref={heroRef}
          className={`mx-auto max-w-5xl px-6 transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 ring-1 ring-white/20">
                🛒 Nuestra historia
              </span>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Somos <span className="text-accent">Marquetazo</span>
              </h1>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/80">
                Nacimos de un proyecto universitario con una misión clara: llevar el supermercado del futuro a cada hogar. Precios justos, tecnología moderna y un servicio que realmente importa.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#valores" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white no-underline hover:bg-orange-600 transition-colors duration-200">
                  Nuestros valores ↓
                </a>
                <a href="#equipo" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white no-underline hover:bg-white/20 ring-1 ring-white/20 transition-colors duration-200">
                  Conoce al equipo
                </a>
              </div>
            </div>
            {/* Imagen hero */}
            <div className={`relative w-full max-w-sm shrink-0 transition-all duration-1000 delay-300 ${heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20">
                <img src="/hero-banner.png" alt="Frutas y verduras frescas de Marquetazo" className="h-64 w-full object-cover" />
              </div>
              {/* Badge flotante */}
              <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-xl">
                <span className="text-2xl">🌱</span>
                <div>
                  <p className="text-xs font-bold text-ink">100% Fresco</p>
                  <p className="text-xs text-ink/50">Garantizado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-b border-line bg-white py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 sm:grid-cols-4">
          {[
            { value: 1200, suffix: '+', label: 'Productos disponibles', icon: '📦' },
            { value: 98, suffix: '%', label: 'Satisfacción del cliente', icon: '⭐' },
            { value: 5000, suffix: '+', label: 'Pedidos entregados', icon: '🚚' },
            { value: 24, suffix: 'h', label: 'Despacho express', icon: '⚡' },
          ].map(({ value, suffix, label, icon }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl">{icon}</span>
              <p className="text-3xl font-extrabold text-brand">
                <Counter target={value} suffix={suffix} />
              </p>
              <p className="text-xs text-ink/60">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HISTORIA / TIMELINE ── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand">Nuestra trayectoria</span>
          <h2 className="mt-2 text-3xl font-extrabold text-ink">Cómo llegamos hasta aquí</h2>
        </div>
        <div className="mx-auto max-w-2xl">
          <TimelineStep
            year={2023}
            title="El inicio universitario"
            description="Marquetazo nació como proyecto académico con una API genérica y una interfaz básica. La semilla de una gran idea estaba plantada."
          />
          <TimelineStep
            year={2024}
            title="Plataforma propia"
            description="Desarrollamos nuestro propio backend full-stack con autenticación, catálogo dinámico, carrito y sistema de pedidos. La visión se hizo realidad."
          />
          <TimelineStep
            year={2025}
            title="Rediseño completo"
            description="React + Tailwind modernizaron la experiencia. Incorporamos búsqueda en tiempo real, panel de administración y gestión de inventario avanzada."
          />
          <TimelineStep
            year={2026}
            title="Escalando juntos"
            description="Hoy somos una plataforma robusta, lista para crecer. Seguimos iterando con tecnología y escuchando a cada cliente."
            isLast
          />
        </div>
      </section>

      {/* ── VALORES ── */}
      <section id="valores" className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Lo que nos mueve</span>
            <h2 className="mt-2 text-3xl font-extrabold text-ink">Nuestros valores</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
              Cada decisión que tomamos está guiada por principios que nos hacen únicos en el mercado.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ValueCard icon="🥦" title="Frescura garantizada" delay={0}
              description="Seleccionamos cada producto con los más altos estándares de calidad. Fresco desde el origen hasta tu mesa." />
            <ValueCard icon="💰" title="Precios justos" delay={100}
              description="Creemos que comer bien no debería ser un lujo. Negociamos directamente con proveedores para ofrecerte el mejor precio." />
            <ValueCard icon="🚀" title="Tecnología moderna" delay={200}
              description="Una plataforma digital ágil, rápida y segura. Tu experiencia de compra siempre a un clic de distancia." />
            <ValueCard icon="♻️" title="Compromiso sustentable" delay={300}
              description="Trabajamos con proveedores locales, reducimos el desperdicio alimentario y promovemos embalajes eco-amigables." />
            <ValueCard icon="🤝" title="Comunidad primero" delay={400}
              description="Apoyamos a productores locales y construimos relaciones de largo plazo. Juntos somos más fuertes." />
            <ValueCard icon="🔒" title="Seguridad y confianza" delay={500}
              description="Tus datos y pagos están protegidos con los más altos estándares de seguridad. Compra con total tranquilidad." />
          </div>
        </div>
      </section>

      {/* ── EQUIPO ── */}
      <section id="equipo" className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Las personas detrás</span>
            <h2 className="mt-2 text-3xl font-extrabold text-ink">Nuestro equipo</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
              Un grupo apasionado de desarrolladores y emprendedores que creen en el poder de la tecnología para mejorar la vida cotidiana.
            </p>
          </div>
          <div className="mb-10 overflow-hidden rounded-3xl shadow-xl">
            <img src="/team.png" alt="Equipo de Marquetazo" className="h-72 w-full object-cover" />
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <TeamMember emoji="👨‍💻" name="Equipo Dev" role="Desarrollo Full-Stack"
              description="Arquitectura React + Spring Boot con estándares de industria, CI/CD y buenas prácticas." />
            <TeamMember emoji="🎨" name="Equipo UX" role="Diseño & Experiencia"
              description="Interfaces modernas que combinan usabilidad con estética. El detalle lo hace todo." />
            <TeamMember emoji="📊" name="Equipo Ops" role="Operaciones & Logística"
              description="Garantizamos que cada pedido llegue en tiempo y forma. La excelencia operacional es nuestra firma." />
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 py-20 text-center">

        {/* Blobs decorativos */}
        <div className="pointer-events-none absolute top-0 left-0 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

        {/* Patrón suave */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(251,146,60,0.12) 1px, transparent 1px), radial-gradient(circle at 80% 80%, rgba(245,158,11,0.12) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative mx-auto max-w-2xl px-6">

          {/* Icono */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-4xl shadow-lg shadow-orange-200">
            🛒
          </div>

          {/* Título */}
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            ¿Listo para comenzar?
          </h2>

          {/* Descripción */}
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink/60">
            Descubre miles de productos frescos con entrega rápida y precios que realmente te van a sorprender.
          </p>

          {/* Botones */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <a
              href="/tienda"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-sm font-bold text-white no-underline shadow-lg shadow-orange-300/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Ir a la tienda →
            </a>

            <a
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-8 py-3.5 text-sm font-semibold text-ink no-underline shadow-sm transition-all duration-300 hover:bg-slate-50 hover:shadow-md"
            >
              Contáctanos
            </a>

          </div>
        </div>
      </section>

    </div>
  )
}
