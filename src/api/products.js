import { apiFetch } from './client.js'

export const getProducts = (cat) => {
  const query = cat ? `?cat=${encodeURIComponent(cat)}` : ''
  return apiFetch(`/products${query}`)
}

export const getProductById = (id) => apiFetch(`/products/${id}`)

export const createProduct = (formData) =>
  apiFetch('/products', { method: 'POST', body: formData })

export const updateProduct = (id, formData) =>
  apiFetch(`/products/${id}`, { method: 'PUT', body: formData })

export const deleteProduct = (id) => apiFetch(`/products/${id}`, { method: 'DELETE' })
