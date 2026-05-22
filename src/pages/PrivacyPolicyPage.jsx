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

export function PrivacyPolicyPage() {
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-surface">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-20 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-8"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className={`mx-auto max-w-4xl px-6 text-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 ring-1 ring-white/20">
            🔒 Privacidad
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Política de privacidad</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/80">
            En Marquetazo protegemos tus datos con responsabilidad. A continuación explicamos qué recopilamos, por qué y cómo puedes ejercer tus derechos.
          </p>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-3">

          {/* Main */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-line bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-extrabold text-ink">Resumen rápido</h2>
              <p className="mt-2 text-sm text-ink/60">Utilizamos tus datos para procesar pedidos, entregar productos, ofrecer soporte y mejorar la experiencia. No vendemos tu información a terceros.</p>

              <h3 className="mt-6 text-lg font-bold text-ink">Qué recopilamos</h3>
              <ul className="mt-2 list-inside list-disc text-sm text-ink/60 space-y-1">
                <li>Datos de contacto: nombre, correo y teléfono.</li>
                <li>Direcciones de despacho y facturación.</li>
                <li>Información de pago (procesada por proveedores externos cuando aplica).</li>
                <li>Datos de uso: historial de pedidos y navegación para mejorar servicio.</li>
              </ul>

              <h3 className="mt-6 text-lg font-bold text-ink">Cómo usamos tus datos</h3>
              <p className="mt-2 text-sm text-ink/60">Los datos se usan para confirmar y despachar pedidos, gestionar cuentas, detectar fraudes y enviar comunicaciones relacionadas con el servicio. Solo conservamos lo necesario por el tiempo legal requerido.</p>

              <h3 className="mt-6 text-lg font-bold text-ink">Cookies y sesión</h3>
              <p className="mt-2 text-sm text-ink/60">Usamos cookies para mantener tu sesión (cookie httpOnly) y para mejorar la experiencia. Puedes revisar o borrar cookies desde tu navegador; algunas funciones podrían dejar de estar disponibles.</p>

              <h3 className="mt-6 text-lg font-bold text-ink">Seguridad</h3>
              <p className="mt-2 text-sm text-ink/60">Implementamos medidas técnicas y organizativas razonables para proteger tus datos. Sin embargo, ningún sistema es 100% infalible; ante dudas, contáctanos.</p>

              <h3 className="mt-6 text-lg font-bold text-ink">Tus derechos</h3>
              <p className="mt-2 text-sm text-ink/60">Tienes derecho a acceder, rectificar, solicitar supresión u oposición al tratamiento de tus datos. Para ejercerlos escribe a privacidad@marquetazo.cl con tu identificación y solicitud.</p>

            </div>

            {/* FAQ */}
            <div className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h3 className="text-lg font-extrabold text-ink">Preguntas frecuentes</h3>
              <div className="mt-4">
                <FaqItem question="¿Quién tiene acceso a mis datos?" answer="Acceso limitado al equipo operativo y a proveedores necesarios para despachos y pagos. Todos los accesos están sujetos a controles internos." />
                <FaqItem question="¿Puedo solicitar que borren mi cuenta?" answer="Sí. Envía un correo a privacidad@marquetazo.cl indicando tu cuenta y lo gestionaremos según la normativa aplicable." />
                <FaqItem question="¿Usan mis datos para publicidad?" answer="Podemos usar información agregada para mejorar servicios, pero no vendemos datos personales a anunciantes externos." />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-ink">Contacto de privacidad</p>
                <p className="mt-2 text-sm text-ink/60">privacidad@marquetazo.cl</p>
              </div>

              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-ink">Duración de conservación</p>
                <p className="mt-1 text-sm text-ink/60">Conservamos datos activos mientras tu cuenta exista y según exigencias legales.</p>
              </div>

              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-ink">Enlaces útiles</p>
                <a href="/privacy.pdf" className="mt-2 block text-sm text-accent hover:underline">Descargar política completa (PDF)</a>
              </div>
            </div>
          </aside>

        </div>
      </section>

    </div>
  )
}
