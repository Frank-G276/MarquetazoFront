import { apiFetch } from './client.js'

export const createOrder = () => apiFetch('/orders', { method: 'POST' })

export const getOrders = () => apiFetch('/orders')

export const updateOrderStatus = (id, status) =>
  apiFetch(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
