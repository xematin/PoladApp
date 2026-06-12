import { useEffect, useState } from 'react'

import api from '../api/client'

/**
 * Fetch products from the backend and split them by type.
 */
export function useProducts() {
  const [premiumProducts, setPremiumProducts] = useState([])
  const [starsProducts, setStarsProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    api
      .getProducts()
      .then((products) => {
        if (!active) return
        const list = products || []
        setPremiumProducts(list.filter((p) => p.product_type === 'PREMIUM'))
        setStarsProducts(list.filter((p) => p.product_type === 'STARS'))
      })
      .catch((err) => {
        if (active) setError(err.message || 'خطا در دریافت محصولات')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { premiumProducts, starsProducts, loading, error }
}

export default useProducts
