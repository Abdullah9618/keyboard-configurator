import { useState, useEffect, useCallback } from 'react'

// Base prices for different switch types
const BASE_PRICES = {
  red: 189.99,
  blue: 199.99,
  brown: 194.99
}

// Mock stock data
const MOCK_STOCK = {
  red: 42,
  blue: 28,
  brown: 35
}

// Simulated API response delay
const API_DELAY = 300

/**
 * Custom hook for calculating price and fetching stock
 * based on the selected switch configuration
 * Uses mock data - no backend required
 */
export function usePriceCalculator(switchColor) {
  const [price, setPrice] = useState(BASE_PRICES[switchColor] || 189.99)
  const [stock, setStock] = useState(MOCK_STOCK[switchColor] || 30)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Use mock data directly (no API call)
  const fetchPriceAndStock = useCallback(async (color) => {
    setIsLoading(true)
    setError(null)

    // Simulate brief loading delay for UX
    await new Promise(resolve => setTimeout(resolve, API_DELAY))
    
    // Use mock prices and stock
    setPrice(BASE_PRICES[color] || 189.99)
    setStock(MOCK_STOCK[color] || 30)
    
    setIsLoading(false)
  }, [])

  // Fetch on mount and when switch color changes
  useEffect(() => {
    fetchPriceAndStock(switchColor)
  }, [switchColor, fetchPriceAndStock])

  // Calculate total with optional modifiers
  const calculateTotal = useCallback((quantity = 1, discount = 0) => {
    const subtotal = price * quantity
    const discountAmount = subtotal * (discount / 100)
    return subtotal - discountAmount
  }, [price])

  // Format price for display
  const formatPrice = useCallback((value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }, [])

  return {
    price,
    stock,
    isLoading,
    error,
    calculateTotal,
    formatPrice,
    refetch: () => fetchPriceAndStock(switchColor)
  }
}
