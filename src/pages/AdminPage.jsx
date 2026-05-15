import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as ordersApi from '../api/orders.js'
import { useCategories } from '../context/CategoriesContext.jsx'

const STATUSES = ['PENDIENTE', 'DESPACHADO', 'ENTREGADO', 'CANCELADO']

const statusColor = {
  PENDIENTE: 'bg-yellow-100 text-yellow-700',
  DESPACHADO: 'bg-blue-100 text-blue-700',
  ENTREGADO: 'bg-green-100 text-green-700',
  CANCELADO: 'bg-red-100 text-red-700',
}

export function AdminPage() {
  const { categories, create: createCategory, remove: removeCategory } = useCategories()
  const [newCat, setNewCat] = useState('')
  const [catMsg, setCatMsg] = useState(null)
  const [catLoading, setCatLoading] = useState(false)

  const [orderId, setOrderId] = useState('')
  const [orderStatus, setOrderStatus] = useState('PENDIENTE')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const notify = (type, text) => {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 4000)
  }

  const notifyCat = (type, text) => {
    setCatMsg({ type, text })
    setTimeout(() => setCatMsg(null), 4000)
  }

  const handleCreateCat = async (e) => {
    e.preventDefault()
    if (!newCat.trim()) return
    setCatLoading(true)
    try {
      await createCategory(newCat.trim())
      setNewCat('')
      notifyCat('ok', 'Categoría creada correctamente')
    } catch (err) {
      notifyCat('err', err.message || 'Error al crear la categoría')
    } finally {
      setCatLoading(false)
    }
  }

  const handleDeleteCat = async (cat) => {
    if (!window.confirm(`¿Eliminar la categoría "${cat.name}"?`)) return
    try {
      await removeCategory(cat._id)
      notifyCat('ok', `Categoría "${cat.name}" eliminada`)
    } catch (err) {
      notifyCat('err', err.message || 'Error al eliminar')
    }
  }

  const patchOrderStatus = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await ordersApi.updateOrderStatus(orderId, orderStatus)
      notify('ok', `Orden actualizada a "${orderStatus}" correctamente`)
      setOrderId('')
    } catch (err) {
      notify('err', err.message || 'Error actualizando la orden')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-ink">Panel de Administración</h1>
      <p className="mt-1 text-sm text-ink/60">Acceso exclusivo para administradores</p>

      {msg ? (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
            msg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {msg.text}
        </div>
      ) : null}

      {/* Quick access */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          to="/panel"
          className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm no-underline transition-shadow hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-2xl">
            🛒
          </div>
          <div>
            <div className="font-semibold text-ink">Gestión de Productos</div>
            <div className="text-xs text-ink/60">Crear, editar y eliminar productos</div>
          </div>
        </Link>
        <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-2xl">
            📦
          </div>
          <div>
            <div className="font-semibold text-ink">Gestión de Órdenes</div>
            <div className="text-xs text-ink/60">Actualizar estados de pedidos</div>
          </div>
        </div>
      </div>

      {/* Gestión de categorías */}
      <section className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ink">Categorías de productos</h2>
        <p className="mt-1 text-sm text-ink/60">
          Las categorías disponibles aparecen en el formulario de creación de productos.
        </p>

        {catMsg ? (
          <div className={`mt-3 rounded-xl px-4 py-2.5 text-sm font-medium ${catMsg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {catMsg.text}
          </div>
        ) : null}

        <form onSubmit={handleCreateCat} className="mt-4 flex gap-2">
          <input
            required
            placeholder="Nueva categoría..."
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            className="flex-1 rounded-xl border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
          <button
            type="submit"
            disabled={catLoading}
            className="rounded-full bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {catLoading ? 'Creando...' : '+ Agregar'}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.length === 0 ? (
            <p className="text-sm text-ink/50">Sin categorías aún.</p>
          ) : (
            categories.map((cat) => (
              <span
                key={cat._id}
                className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm"
              >
                {cat.name}
                <button
                  type="button"
                  onClick={() => handleDeleteCat(cat)}
                  className="rounded-full text-ink/40 hover:text-red-600 transition-colors"
                  title="Eliminar"
                >
                  ✕
                </button>
              </span>
            ))
          )}
        </div>
      </section>

      {/* Order status management */}
      <section className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ink">Actualizar Estado de Orden</h2>
        <p className="mt-1 text-sm text-ink/60">
          Ingresa el ID de la orden y selecciona el nuevo estado.
        </p>

        <form className="mt-5 grid gap-4" onSubmit={patchOrderStatus}>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/70">ID de la orden *</label>
            <input
              required
              placeholder="Ej: 6650abc123def456789"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full rounded-xl border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/70">Nuevo estado *</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setOrderStatus(s)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                    orderStatus === s
                      ? `${statusColor[s]} border-transparent ring-2 ring-offset-1 ring-brand/40`
                      : 'border-line bg-surface text-ink/70 hover:bg-line'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-brand py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? 'Actualizando…' : 'Actualizar orden'}
          </button>
        </form>
      </section>
    </div>
  )
}
