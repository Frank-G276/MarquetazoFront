import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as productsApi from '../api/products.js'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reloadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await productsApi.getProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reloadProducts()
  }, [reloadProducts])

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean))
    return [...set].sort((a, b) => a.localeCompare(b, 'es'))
  }, [products])

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      categories,
      reloadProducts,
      setProducts,
    }),
    [products, loading, error, categories, reloadProducts],
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts debe usarse dentro de ProductsProvider')
  return ctx
}
