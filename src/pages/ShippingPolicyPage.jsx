import { useEffect, useState } from 'react'

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-line last:border-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-ink hover:text-brand transition-colors duration-200"
      >
        {question}
        <span className={`shrink-0 text-brand transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 pb-4' : 'max-h-0'}`}>
        <p className="text-sm leading-relaxed text-ink/60">{answer}</p>
      </div>
    </div>
  )
}

function MethodCard({ icon, title, description, badge }) {
  return (
    <div className="group rounded-2xl border border-line bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-2xl">{icon}</div>
          <div>
            <h4 className="text-base font-bold text-ink">{title}</h4>
            <p className="mt-1 text-sm text-ink/60">{description}</p>
          </div>
        </div>
        {badge && <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">{badge}</div>}
      </div>
    </div>
  )
}

export function ShippingPolicyPage() {
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-surface">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-20 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className={`mx-auto max-w-4xl px-6 text-center transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 ring-1 ring-white/20">
            🚚 Envíos
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Política de envíos</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/80">
            Entregas rápidas y seguras. Aquí resumimos tiempos, costos y opciones de despacho para que elijas lo que más te convenga.
          </p>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-5">

          {/* Main */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-line bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-extrabold text-ink">Resumen rápido</h2>
              <p className="mt-2 text-sm text-ink/60">Ofrecemos despacho estándar, despacho express en zonas seleccionadas y retiro en punto. Los tiempos y costos dependen del tipo de producto y la comuna de entrega.</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <MethodCard icon="🚚" title="Despacho estándar" description="Entrega en 24–72 horas hábiles según comuna." badge="Desde $2.990" />
                <MethodCard icon="⚡" title="Despacho express" description="Entrega el mismo día o en 24 horas en zonas seleccionadas." badge="Envío rápido" />
                <MethodCard icon="🏬" title="Retiro en punto" description="Retira tu pedido en el punto seleccionado con validación al momento del retiro." />
                <MethodCard icon="📦" title="Pedidos voluminosos" description="Coordinamos entregas para pedidos grandes con logística especial." />
              </div>

              <h3 className="mt-8 text-lg font-bold text-ink">Costos y promociones</h3>
              <p className="mt-2 text-sm text-ink/60">Ofrecemos envío gratuito en compras sobre cierto monto y promociones puntuales. El monto mínimo y condiciones pueden variar por campaña.</p>

              <h3 className="mt-6 text-lg font-bold text-ink">Política de devoluciones en transporte</h3>
              <p className="mt-2 text-sm text-ink/60">Si un producto llega en mal estado, contacta soporte con foto dentro de las 24 horas para gestionar reemplazo o reembolso.</p>
            </div>

            <div className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h3 className="text-lg font-extrabold text-ink">Preguntas frecuentes</h3>
              <div className="mt-4">
                <FaqItem question="¿Envían a todo el país?" answer="Actualmente enviamos a la mayoría de comunas urbanas. Algunas zonas remotas tienen restricciones o costos adicionales." />
                <FaqItem question="¿Cómo rastreo mi pedido?" answer="Recibirás un correo con el estado y un enlace de seguimiento cuando el pedido salga de nuestro centro de distribución." />
                <FaqItem question="¿Puedo cambiar la dirección luego de comprar?" answer="Puedes solicitar el cambio dentro de la ventana disponible; contacta soporte lo antes posible para verificar factibilidad." />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-ink">¿Necesitas ayuda con un envío?</p>
                <p className="mt-2 text-sm text-ink/60">Contacta a nuestro equipo de envíos y logística para consultas o coordinación especial.</p>
                <a href="/contacto" className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-brand-dark transition-colors duration-200">Contactar soporte</a>
              </div>

              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-ink">Horas de despacho</p>
                <p className="mt-1 text-sm text-ink/60">Lun–Sáb: 09:00–20:00</p>
                <p className="mt-2 text-sm text-ink/60">Pedidos realizados en la mañana pueden salir el mismo día según disponibilidad.</p>
              </div>

              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-ink">Consejos</p>
                <ul className="mt-2 list-inside list-disc text-sm text-ink/60 space-y-1">
                  <li>Revisa que la dirección y teléfono estén correctos.</li>
                  <li>Selecciona horario de entrega si está disponible.</li>
                  <li>Indica referencias para facilitar la entrega si tu comuna lo requiere.</li>
                </ul>
              </div>
            </div>
          </aside>

        </div>
      </section>

    </div>
  )
}
