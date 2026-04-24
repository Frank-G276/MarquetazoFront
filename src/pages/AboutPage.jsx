export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">Nosotros</h1>
      <div className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-6 text-sm leading-relaxed text-ink/80">
        <p>
          Marquetazo nace como proyecto universitario y evolucionó de un front conectado a una API genérica a una plataforma propia full-stack.
        </p>
        <p>
          Este rediseño usa React + Tailwind y consume tu backend real para autenticación, catálogo, carrito, pedidos y administración.
        </p>
      </div>
    </div>
  )
}
