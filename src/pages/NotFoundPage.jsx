import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-5xl font-bold text-brand">404</h1>
      <p className="mt-3 text-ink/70">Página no encontrada.</p>
      <Link to="/" className="mt-6 inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white no-underline hover:bg-brand-dark hover:text-white">
        Volver al inicio
      </Link>
    </div>
  )
}
