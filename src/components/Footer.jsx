import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <section>
          <p className="text-lg font-bold text-brand">Marquetazo</p>
          <p className="mt-2 text-sm text-ink/80">
            Supermercado universitario: precios justos, despacho flexible y experiencia web moderna.
          </p>
        </section>
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink/60">Sitio</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/tienda" className="no-underline">Catálogo</Link></li>
            <li><Link to="/nosotros" className="no-underline">Nosotros</Link></li>
            <li><Link to="/contacto" className="no-underline">Contacto</Link></li>
          </ul>
        </section>
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink/60">Legal</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/envios" className="no-underline">Política de envíos</Link></li>
            <li><Link to="/privacidad" className="no-underline">Privacidad</Link></li>
          </ul>
        </section>
      </div>
      <div className="border-t border-line bg-surface py-4 text-center text-xs text-ink/60">
        © {new Date().getFullYear()} Marquetazo · Proyecto universitario
      </div>
    </footer>
  )
}
