import { useEffect, useState } from 'react'
import * as ordersApi from '../api/orders.js'
import { formatCLP } from '../utils/money.js'

export function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await ordersApi.getOrders()
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'No se pudo cargar las órdenes')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Mis pedidos</h1>
      {loading ? <p className="mt-6 text-sm text-ink/60">Cargando...</p> : null}
      {error ? <p className="mt-6 text-sm text-red-700">{error}</p> : null}
      {!loading && !error ? (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <article key={order._id} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">Orden #{order._id.slice(-6).toUpperCase()}</p>
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">{order.status}</span>
              </div>
              <p className="mt-2 text-xs text-ink/60">
                {new Date(order.createdAt).toLocaleString('es-CL')}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {order.items.map((item, idx) => (
                  <li key={`${order._id}-${idx}`} className="flex items-center justify-between gap-2">
                    <span>{item.productName} × {item.quantity}</span>
                    <strong>{formatCLP(item.subTotal)}</strong>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-line pt-3 text-right text-sm">
                Total: <strong>{formatCLP(order.totalPrice)}</strong>
              </div>
            </article>
          ))}
          {orders.length === 0 ? <p className="text-sm text-ink/60">Aún no tienes pedidos.</p> : null}
        </div>
      ) : null}
    </div>
  )
}
