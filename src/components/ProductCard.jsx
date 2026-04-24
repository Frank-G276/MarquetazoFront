import { Link } from 'react-router-dom'
import { finalUnitPrice, formatCLP } from '../utils/money.js'
import { getProductPrimaryImage } from '../utils/productImage.js'

export function ProductCard({ product }) {
  const image = getProductPrimaryImage(product)
  const finalPrice = finalUnitPrice(product)
  const discount = Number(product.discountPercent || 0)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/producto/${product._id}`} className="block aspect-[4/3] overflow-hidden bg-surface no-underline">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl font-bold text-brand/35">
            {product.name?.[0] || '?'}
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs uppercase tracking-wide text-ink/50">{product.category}</p>
        <Link to={`/producto/${product._id}`} className="mt-1 line-clamp-2 text-base font-semibold text-ink no-underline hover:text-brand">
          {product.name}
        </Link>
        {discount > 0 ? <p className="mt-3 text-xs text-ink/50 line-through">{formatCLP(product.price)}</p> : <div className="mt-3" />}
        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="text-lg font-bold text-brand">{formatCLP(finalPrice)}</p>
          {discount > 0 ? <span className="rounded-full bg-accent px-2 py-1 text-xs font-bold text-white">-{discount}%</span> : null}
        </div>
      </div>
    </article>
  )
}
