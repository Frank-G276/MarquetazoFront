import { apiFetch } from './client.js'

export const getCategories = () => apiFetch('/categories')

export const createCategory = (name) =>
  apiFetch('/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })

export const deleteCategory = (id) =>
  apiFetch(`/categories/${id}`, { method: 'DELETE' })
