import { useAuth } from '../context/AuthContext.jsx'

export function ProfilePage() {
  const { user, refreshProfile } = useAuth()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Mi perfil</h1>
      <p className="mt-2 text-sm text-ink/70">Datos obtenidos desde <code>GET /api/profile</code>.</p>

      <div className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink/50">Nombre</dt>
            <dd className="mt-1 text-sm font-medium">{user?.firstName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink/50">Apellido</dt>
            <dd className="mt-1 text-sm font-medium">{user?.lastName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink/50">Correo</dt>
            <dd className="mt-1 text-sm font-medium">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink/50">Rol</dt>
            <dd className="mt-1 text-sm font-medium">{user?.role}</dd>
          </div>
        </dl>
        <button type="button" onClick={refreshProfile} className="mt-6 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          Actualizar perfil
        </button>
      </div>
    </div>
  )
}
