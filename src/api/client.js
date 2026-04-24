const joinBase = (base, path) => {
  const b = base.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${b}${p}`
}

const API_BASE = (import.meta.env.VITE_API_BASE || '/api').replace(/\/$/, '')

export async function apiFetch(path, options = {}) {
  const url = joinBase(API_BASE, path)
  const headers = new Headers(options.headers || {})

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  })

  const text = await response.text()
  let payload = null
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = text
    }
  }

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && payload.message) ||
      `Error ${response.status}`
    const err = new Error(message)
    err.status = response.status
    err.data = payload
    throw err
  }

  return payload
}
