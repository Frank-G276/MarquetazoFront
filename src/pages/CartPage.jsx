import { Link, useNavigate } from 'react-router-dom'
import * as ordersApi from '../api/orders.js'
import { useCart } from '../context/CartContext.jsx'
import { finalUnitPrice, formatCLP } from '../utils/money.js'
import { getProductPrimaryImage } from '../utils/productImage.js'

export function CartPage() {
  const { cart, loading, removeItem, refreshCart } = useCart()
  const navigate = useNavigate()

  const items = cart?.items || []
  const total = items.reduce((acc, item) => acc + finalUnitPrice(item.product) * item.quantity, 0)

  const checkout = async () => {
    try {
      await ordersApi.createOrder()
      await refreshCart()
      navigate('/mis-pedidos')
    } catch (err) {
      alert(err.message || 'No se pudo generar la orden')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Carrito</h1>
      <p className="mt-2 text-sm text-ink/70">Endpoints usados: <code>GET /api/cart</code>, <code>DELETE /api/cart/remove/:idProduct</code>, <code>POST /api/orders</code>.</p>

      {loading ? <p className="mt-6 text-sm text-ink/60">Cargando carrito...</p> : null}
      {!loading && items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-white p-8 text-center">
          <p className="text-sm text-ink/70">Tu carrito está vacío.</p>
          <Link to="/tienda" className="mt-4 inline-block rounded-full bg-brand px-5 py-2 text-sm font-bold text-white no-underline hover:bg-brand-dark hover:text-white">Ir a tienda</Link>
        </div>
      ) : null}

      {items.length > 0 ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => {
              const p = item.product
              const image = getProductPrimaryImage(p)
              return (
                <article key={item._id || p?._id} className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface">
                    {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{p?.name}</p>
                    <p className="mt-1 text-xs text-ink/60">Cantidad: {item.quantity}</p>
                    <p className="mt-1 text-sm text-brand">{formatCLP(finalUnitPrice(p))} c/u</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                    <p className="text-sm font-bold">{formatCLP(finalUnitPrice(p) * item.quantity)}</p>
                    <button type="button" className="mt-2 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700" onClick={() => removeItem(p?._id)}>
                      Quitar
                    </button>
                  </div>
                </article>
              )
            })}
          </div>

          <aside className="h-fit rounded-2xl border border-line bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-ink/60">Resumen</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <strong>{formatCLP(total)}</strong>
            </div>
            <p className="mt-2 text-xs text-ink/60">El backend recalcula descuentos y stock al crear la orden.</p>
            <button type="button" onClick={checkout} className="mt-5 w-full rounded-full bg-accent py-3 text-sm font-bold text-white hover:bg-orange-600">
              Finalizar compra
            </button>
          </aside>
        </div>
      ) : null}
    </div>
  )
}
