import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] bg-surface py-12">
      <div className="mx-auto max-w-md rounded-3xl border border-line bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold">Ingresar</h1>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input type="email" required placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-line px-3 py-2.5 text-sm" />
          <input type="password" required placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-line px-3 py-2.5 text-sm" />
          {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
          <button disabled={loading} className="w-full rounded-full bg-brand py-3 text-sm font-bold text-white hover:bg-brand-dark">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-ink/70">
          ¿No tienes cuenta? <Link to="/registro" className="font-semibold no-underline">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
