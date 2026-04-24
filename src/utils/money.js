export const formatCLP = (value) => {
  const n = Number(value)
  if (Number.isNaN(n)) return '—'
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(n)
}

export const finalUnitPrice = (product) => {
  const base = Number(product?.price || 0)
  const discount = Number(product?.discountPercent || 0)
  return Number((base * (1 - discount / 100)).toFixed(2))
}
