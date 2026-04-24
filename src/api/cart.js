import { apiFetch } from './client.js'

export const getCart = () => apiFetch('/cart')

export const addToCart = (productId, quantity) =>
  apiFetch('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  })

export const removeFromCart = (idProduct) =>
  apiFetch(`/cart/remove/${idProduct}`, { method: 'DELETE' })
