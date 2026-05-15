import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as categoriesApi from '../api/categories.js'

const CategoriesContext = createContext(null)

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const data = await categoriesApi.getCategories()
      setCategories(Array.isArray(data) ? data : [])
    } catch {
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  const create = useCallback(async (name) => {
    const data = await categoriesApi.createCategory(name)
    setCategories((prev) =>
      [...prev, data].sort((a, b) => a.name.localeCompare(b.name, 'es'))
    )
    return data
  }, [])

  const remove = useCallback(async (id) => {
    await categoriesApi.deleteCategory(id)
    setCategories((prev) => prev.filter((c) => c._id !== id))
  }, [])

  const value = useMemo(
    () => ({ categories, loading, reload, create, remove }),
    [categories, loading, reload, create, remove]
  )

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
}

export function useCategories() {
  const ctx = useContext(CategoriesContext)
  if (!ctx) throw new Error('useCategories debe usarse dentro de CategoriesProvider')
  return ctx
}
