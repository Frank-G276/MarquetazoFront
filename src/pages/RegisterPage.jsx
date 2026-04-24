import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    city: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        address: form.address || undefined,
        city: form.city || undefined,
        phone: form.phone || undefined,
      })
      navigate('/')
    } catch (err) {
      setError(err.message || 'No se pudo registrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] bg-surface py-12">
      <div className="mx-auto max-w-lg rounded-3xl border border-line bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold">Crear cuenta</h1>
        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
          <input required minLength={2} placeholder="Nombre" value={form.firstName} onChange={set('firstName')} className="rounded-xl border border-line px-3 py-2.5 text-sm" />
          <input required minLength={2} placeholder="Apellido" value={form.lastName} onChange={set('lastName')} className="rounded-xl border border-line px-3 py-2.5 text-sm" />
          <input required type="email" placeholder="Correo" value={form.email} onChange={set('email')} className="sm:col-span-2 rounded-xl border border-line px-3 py-2.5 text-sm" />
          <input required type="password" minLength={6} placeholder="Contraseña" value={form.password} onChange={set('password')} className="sm:col-span-2 rounded-xl border border-line px-3 py-2.5 text-sm" />
          <input placeholder="Dirección" value={form.address} onChange={set('address')} className="sm:col-span-2 rounded-xl border border-line px-3 py-2.5 text-sm" />
          <input placeholder="Ciudad" value={form.city} onChange={set('city')} className="rounded-xl border border-line px-3 py-2.5 text-sm" />
          <input placeholder="Teléfono" value={form.phone} onChange={set('phone')} className="rounded-xl border border-line px-3 py-2.5 text-sm" />
          {error ? <p className="sm:col-span-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
          <button disabled={loading} className="sm:col-span-2 rounded-full bg-accent py-3 text-sm font-bold text-white hover:bg-orange-600">
            {loading ? 'Creando...' : 'Registrarme'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-ink/70">
          ¿Ya tienes cuenta? <Link to="/login" className="font-semibold no-underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
