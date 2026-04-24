export const getProductPrimaryImage = (product) => {
  if (!product) return ''
  if (Array.isArray(product.imageUrls) && product.imageUrls[0]) {
    return product.imageUrls[0]
  }

  if (!Array.isArray(product.imagePaths) || !product.imagePaths[0]) {
    return ''
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const bucket = import.meta.env.VITE_SUPABASE_PUBLIC_BUCKET
  if (supabaseUrl && bucket) {
    const path = product.imagePaths[0].replace(/^\//, '')
    return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${path}`
  }

  return ''
}
