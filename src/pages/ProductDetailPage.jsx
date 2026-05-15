import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import * as productsApi from '../api/products.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { finalUnitPrice, formatCLP } from '../utils/money.js'
import { getAllProductImages } from '../utils/productImage.js'

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [selectedImg, setSelectedImg] = useState(0)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const data = await productsApi.getProductById(id)
        if (mounted) setProduct(data)
      } catch (err) {
        if (mounted) setError(err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [id])

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-ink/60">Cargando producto...</div>
  if (!product || error) return <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-red-700">Producto no encontrado.</div>

  const images = getAllProductImages(product)
  const finalPrice = finalUnitPrice(product)
  const maxQty = Math.max(1, Math.min(Number(product.stock || 1), 99))

  const onAdd = async () => {
    setMessage('')
    if (!user) {
      navigate('/login', { state: { from: `/producto/${id}` } })
      return
    }
    try {
      await addItem(product._id, quantity)
      setMessage('Producto agregado al carrito.')
    } catch (err) {
      setMessage(err.message || 'No se pudo agregar.')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-xs text-ink/60">
        <Link to="/" className="no-underline">Inicio</Link> / <Link to="/tienda" className="no-underline">Tienda</Link> / {product.name}
      </nav>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          {/* Imagen principal */}
          <div className="flex min-h-72 items-center justify-center overflow-hidden rounded-3xl border border-line bg-white p-4">
            {images.length > 0
              ? <img
                  key={selectedImg}
                  src={images[selectedImg]}
                  alt={product.name}
                  className="max-h-96 w-full object-contain transition-opacity duration-200"
                />
              : <div className="flex h-72 w-full items-center justify-center text-6xl font-bold text-brand/20">
                  {product.name?.[0] || '?'}
                </div>}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImg(i)}
                  className={`shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedImg === i
                      ? 'border-brand shadow-md scale-105'
                      : 'border-line opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Vista ${i + 1}`} className="h-16 w-16 object-contain bg-white p-1" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-brand">{product.category}</p>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink/80">{product.description}</p>
          <div className="mt-5 flex items-end gap-3">
            {Number(product.discountPercent || 0) > 0 ? <span className="text-sm text-ink/50 line-through">{formatCLP(product.price)}</span> : null}
            <span className="text-3xl font-bold text-brand">{formatCLP(finalPrice)}</span>
          </div>
          <p className="mt-1 text-sm text-ink/70">Stock: {product.stock}</p>

          <div className="mt-7 rounded-2xl border border-line bg-surface p-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">Cantidad</label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={maxQty}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(maxQty, Number(e.target.value) || 1)))}
                className="w-24 rounded-xl border border-line bg-white px-3 py-2 text-sm"
              />
              <button type="button" className="rounded-full bg-brand px-5 py-2 text-sm font-bold text-white hover:bg-brand-dark" onClick={onAdd}>
                Agregar al carrito
              </button>
            </div>
            {message ? <p className="mt-3 text-sm text-ink/80">{message}</p> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
