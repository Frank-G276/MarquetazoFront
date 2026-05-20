import { useEffect, useRef, useState } from 'react'

/* ── Animación de entrada con IntersectionObserver ── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ── Tarjeta de información de contacto ── */
function ContactInfoCard({ icon, title, lines, accent = false }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={`group flex flex-col gap-4 rounded-2xl border p-6 transition-all duration-700 hover:-translate-y-1 hover:shadow-lg
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        bg-white
        ${accent
          ? 'border-brand hover:border-brand/50 shadow-sm shadow-brand/20 ring-1 ring-brand/10'
          : 'border-line hover:border-brand/30'
        }`}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-colors duration-300
        ${accent ? 'bg-brand text-white' : 'bg-brand/10 group-hover:bg-brand group-hover:text-white'}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink/50">{title}</h3>
        {lines.map((line, i) => (
          <p key={i} className={`mt-1 font-semibold text-ink ${i === 0 ? 'text-base' : 'text-sm text-ink/60'}`}>
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}

/* ── Campo de formulario animado ── */
function FormField({ label, id, type = 'text', placeholder, required = false, rows }) {
  const [focused, setFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  const Tag = rows ? 'textarea' : 'input'

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`absolute left-4 text-sm font-medium transition-all duration-200
          ${focused || hasValue
            ? '-top-2.5 bg-white px-1 text-xs text-brand'
            : 'top-3.5 text-ink/40'
          }`}
      >
        {label}{required && ' *'}
      </label>
      <Tag
        id={id}
        name={id}
        type={type}
        rows={rows}
        required={required}
        placeholder={focused ? placeholder : ''}
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); setHasValue(e.target.value.length > 0) }}
        onChange={(e) => setHasValue(e.target.value.length > 0)}
        className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-ink outline-none transition-all duration-200
          ${rows ? 'resize-none' : ''}
          ${focused
            ? 'border-brand ring-2 ring-brand/20 shadow-sm'
            : 'border-line hover:border-brand/40'
          }`}
      />
    </div>
  )
}

/* ── FAQ Item ── */
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
        <span className={`shrink-0 text-brand transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 pb-4' : 'max-h-0'}`}>
        <p className="text-sm leading-relaxed text-ink/60">{answer}</p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════ PÁGINA PRINCIPAL ══════════════════════════════════ */
export function ContactPage() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const formRef = useRef(null)
  const mapRef = useReveal(0.1)

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      formRef.current?.reset()
    }, 1800)
  }

  return (
    <div className="min-h-screen bg-surface">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-20 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="pointer-events-none absolute -top-20 right-10 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-0 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />

        <div className={`mx-auto max-w-4xl px-6 text-center transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 ring-1 ring-white/20">
            💬 Estamos aquí para ayudarte
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Contáctanos
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/80">
            ¿Tienes alguna pregunta, sugerencia o necesitas ayuda con tu pedido? Nuestro equipo de soporte está listo para atenderte.
          </p>
          {/* Quick chips */}
          <div className={`mt-8 flex flex-wrap justify-center gap-3 transition-all duration-1000 delay-200 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
            {['📧 Soporte técnico', '🚚 Estado de pedidos', '💡 Sugerencias', '🤝 Alianzas comerciales'].map(chip => (
              <span key={chip} className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/80 ring-1 ring-white/15">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── INFORMACIÓN DE CONTACTO ── */}
      <section className="mx-auto -mt-8 max-w-5xl px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ContactInfoCard icon="📧" title="Correo electrónico"
            lines={['soporte@marquetazo.cl', 'Respuesta en menos de 24h']} accent />
          <ContactInfoCard icon="📞" title="Teléfono"
            lines={['+56 9 1111 2222', 'Lun–Sáb 09:00–20:00']} />
          <ContactInfoCard icon="📍" title="Dirección"
            lines={['Av. Principal 1234', 'Santiago, Chile']} />
          <ContactInfoCard icon="⏰" title="Horario de atención"
            lines={['Lun–Sáb 09:00–20:00', 'Dom 10:00–18:00']} />
        </div>
      </section>

      {/* ── FORMULARIO + FAQ ── */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-5">

          {/* Formulario */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-line bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-extrabold text-ink">Envíanos un mensaje</h2>
              <p className="mt-1 text-sm text-ink/50">Te respondemos en menos de 24 horas hábiles.</p>

              {sent ? (
                <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl bg-brand/5 border border-brand/20 py-12 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-3xl text-white shadow-lg shadow-brand/30">
                    ✓
                  </span>
                  <div>
                    <p className="text-lg font-bold text-ink">¡Mensaje enviado!</p>
                    <p className="mt-1 text-sm text-ink/60">Nos pondremos en contacto contigo pronto.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-2 rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white hover:bg-brand-dark transition-colors duration-200"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField label="Nombre" id="nombre" placeholder="Juan Pérez" required />
                    <FormField label="Correo electrónico" id="email" type="email" placeholder="juan@email.com" required />
                  </div>
                  <FormField label="Asunto" id="asunto" placeholder="¿En qué te podemos ayudar?" required />
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50">
                      Motivo de contacto
                    </label>
                    <select
                      id="motivo"
                      name="motivo"
                      className="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-sm text-ink outline-none transition-all duration-200 hover:border-brand/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="pedido">Consulta sobre mi pedido</option>
                      <option value="producto">Información de productos</option>
                      <option value="devolucion">Devoluciones y garantías</option>
                      <option value="sugerencia">Sugerencia o feedback</option>
                      <option value="alianza">Alianza comercial</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <FormField label="Mensaje" id="mensaje" placeholder="Cuéntanos más detalles..." required rows={5} />
                  <button
                    type="submit"
                    disabled={sending}
                    className="group relative w-full overflow-hidden rounded-xl bg-brand py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-brand-dark disabled:opacity-70 shadow-md shadow-brand/20 hover:shadow-lg hover:shadow-brand/30"
                  >
                    <span className={`inline-flex items-center gap-2 transition-transform duration-200 ${sending ? '-translate-y-10 opacity-0' : 'translate-y-0'}`}>
                      Enviar mensaje →
                    </span>
                    {sending && (
                      <span className="absolute inset-0 flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Enviando...
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <h2 className="text-xl font-extrabold text-ink">Preguntas frecuentes</h2>
              <p className="mt-1 text-sm text-ink/50">Quizás ya tenemos tu respuesta.</p>
              <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-sm">
                <FaqItem
                  question="¿Cuánto tarda el despacho?"
                  answer="El despacho estándar toma entre 24 y 48 horas hábiles. Para comunas seleccionadas ofrecemos despacho express en el mismo día."
                />
                <FaqItem
                  question="¿Puedo cambiar o cancelar mi pedido?"
                  answer="Puedes modificar o cancelar tu pedido hasta 2 horas después de realizarlo, contactando directamente a nuestro soporte."
                />
                <FaqItem
                  question="¿Qué hago si llegó un producto en mal estado?"
                  answer="Escríbenos de inmediato con foto del producto. Gestionamos el reemplazo o reembolso sin costo adicional en menos de 48 horas."
                />
                <FaqItem
                  question="¿Tienen aplicación móvil?"
                  answer="Estamos trabajando en ello. Por ahora, nuestra web está optimizada para móvil y funciona perfectamente desde cualquier navegador."
                />
                <FaqItem
                  question="¿Cómo puedo ser proveedor?"
                  answer="Escríbenos al correo proveedores@marquetazo.cl o usa el formulario seleccionando 'Alianza comercial'. Te contactamos en 3 días hábiles."
                />
              </div>

              {/* Redes sociales */}
              <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-ink">Síguenos en redes</p>
                <div className="mt-3 flex gap-3">
                  {[
                    { icon: '📘', label: 'Facebook', color: 'hover:bg-blue-50 hover:border-blue-200' },
                    { icon: '📸', label: 'Instagram', color: 'hover:bg-pink-50 hover:border-pink-200' },
                    { icon: '🐦', label: 'Twitter', color: 'hover:bg-sky-50 hover:border-sky-200' },
                  ].map(({ icon, label, color }) => (
                    <button
                      key={label}
                      type="button"
                      aria-label={label}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-lg transition-all duration-200 ${color}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAPA / UBICACIÓN ── */}
      <section className="pb-20">
        <div
          ref={mapRef.ref}
          className={`mx-auto max-w-5xl px-6 transition-all duration-700 ${mapRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="overflow-hidden rounded-3xl border border-line shadow-sm">
            {/* Mapa estático visual */}
            <div className="relative h-64 bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
              <div className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }}
              />
              {/* Calles simuladas */}
              <div className="absolute inset-0 flex items-center">
                <div className="h-1 w-full bg-brand/15" />
              </div>
              <div className="absolute inset-0 flex justify-center">
                <div className="h-full w-1 bg-brand/15" />
              </div>
              {/* Pin */}
              <div className="relative flex flex-col items-center gap-2 z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white text-3xl shadow-xl shadow-brand/40 ring-4 ring-white">
                  🛒
                </div>
                <div className="rounded-xl bg-white px-4 py-2 shadow-lg text-center">
                  <p className="text-sm font-bold text-ink">Marquetazo Central</p>
                  <p className="text-xs text-ink/50">Av. Principal 1234, Santiago</p>
                </div>
              </div>
            </div>
            {/* Info debajo */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 border-t border-line">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-xl">📍</div>
                <div>
                  <p className="text-sm font-bold text-ink">Av. Principal 1234, Santiago</p>
                  <p className="text-xs text-ink/50">Metro: Estación Central, línea 1</p>
                </div>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white no-underline hover:bg-brand-dark transition-colors duration-200"
              >
                Ver en Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
