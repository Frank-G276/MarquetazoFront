import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as cartApi from '../api/cart.js'
import { useAuth } from './AuthContext.jsx'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null)
      return
    }
    setLoading(true)
    try {
      const data = await cartApi.getCart()
      setCart(data)
    } catch {
      setCart(null)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addItem = useCallback(async (productId, quantity) => {
    const data = await cartApi.addToCart(productId, quantity)
    setCart(data)
    return data
  }, [])

  const removeItem = useCallback(async (idProduct) => {
    const data = await cartApi.removeFromCart(idProduct)
    setCart(data)
    return data
  }, [])

  const itemCount = useMemo(
    () => (cart?.items || []).reduce((acc, item) => acc + Number(item.quantity || 0), 0),
    [cart],
  )

  const value = useMemo(
    () => ({ cart, loading, itemCount, refreshCart, addItem, removeItem }),
    [cart, loading, itemCount, refreshCart, addItem, removeItem],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
