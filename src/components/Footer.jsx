import { useState } from 'react'
import { Link } from 'react-router-dom'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000) // Reset message after 5 seconds
    }
  }

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">

          {/* Brand & Description */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 text-white no-underline">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand font-bold text-white shadow-md shadow-brand/20">M</span>
              <span className="text-xl font-bold tracking-tight">Marquetazo</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Supermercado universitario de precios justos y despacho flexible. Simplificamos tus compras en el campus.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-brand hover:text-white transition-all hover:scale-110"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-brand hover:text-white transition-all hover:scale-110"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-brand hover:text-white transition-all hover:scale-110"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">Explorar</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/tienda" className="text-slate-400 hover:text-white no-underline transition-colors flex items-center gap-1.5 group">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700 group-hover:bg-brand transition-colors" />
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-slate-400 hover:text-white no-underline transition-colors flex items-center gap-1.5 group">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700 group-hover:bg-brand transition-colors" />
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-slate-400 hover:text-white no-underline transition-colors flex items-center gap-1.5 group">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700 group-hover:bg-brand transition-colors" />
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Help */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">Soporte</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/envios" className="text-slate-400 hover:text-white no-underline transition-colors flex items-center gap-1.5 group">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700 group-hover:bg-brand transition-colors" />
                  Política de envíos
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="text-slate-400 hover:text-white no-underline transition-colors flex items-center gap-1.5 group">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700 group-hover:bg-brand transition-colors" />
                  Privacidad
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed flex items-center gap-1.5 group">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                  Preguntas Frecuentes (FAQ)
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">Boletín del Campus</h3>
            <p className="mt-4 text-xs text-slate-400 leading-relaxed">
              Recibe las mejores ofertas y promociones semanales directamente en tu correo electrónico.
            </p>

            {subscribed ? (
              <div className="mt-4 rounded-xl bg-brand/10 border border-brand/20 p-3 text-xs text-brand animate-fade-in font-medium">
                🎉 ¡Te has suscrito exitosamente! Próximamente recibirás nuestras ofertas.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-4 flex flex-col gap-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu correo institucional..."
                    className="w-full rounded-xl border border-slate-850 bg-slate-950 px-3.5 py-2.5 pr-10 text-xs text-white placeholder-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-slate-800 px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-brand hover:shadow-md hover:shadow-brand/25 transition-all"
                  >
                    OK
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Marquetazo · Proyecto Universitario de Supermercado.</p>
          <p className="flex items-center gap-1">
            Hecho con <span className="text-rose-500">❤️</span> para la comunidad estudiantil.
          </p>
        </div>
      </div>
    </footer>
  )
}
