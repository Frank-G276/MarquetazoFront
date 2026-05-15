const buildUrl = (path) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const bucket = import.meta.env.VITE_SUPABASE_PUBLIC_BUCKET
  if (!supabaseUrl || !bucket) return ''
  return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${path.replace(/^\//, '')}`
}

export const getAllProductImages = (product) => {
  if (!product) return []
  if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
    return product.imageUrls.filter(Boolean)
  }
  if (!Array.isArray(product.imagePaths)) return []
  return product.imagePaths.filter(Boolean).map(buildUrl).filter(Boolean)
}

export const getProductPrimaryImage = (product) => {
  return getAllProductImages(product)[0] || ''
}
