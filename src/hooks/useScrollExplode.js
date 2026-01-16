import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

/**
 * Custom hook that tracks mouse wheel and 
 * updates the explode amount for the keyboard animation
 */
export function useScrollExplode() {
  const setExplodeAmount = useStore((state) => state.setExplodeAmount)
  const explodeAmountRef = useRef(useStore.getState().explodeAmount)

  useEffect(() => {
    const handleWheel = (e) => {
      // Prevent default zoom behavior
      e.preventDefault()
      
      // Calculate delta (normalize for different browsers/devices)
      const delta = e.deltaY * 0.002
      
      // Update explode amount (clamp between 0 and 1)
      explodeAmountRef.current = Math.max(0, Math.min(1, explodeAmountRef.current + delta))
      
      console.log('Scroll explode:', explodeAmountRef.current) // Debug log
      
      setExplodeAmount(explodeAmountRef.current)
    }

    // Add wheel listener with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [setExplodeAmount])

  // Sync ref with store changes (e.g., from slider)
  useEffect(() => {
    const unsubscribe = useStore.subscribe((state) => {
      explodeAmountRef.current = state.explodeAmount
    })
    return unsubscribe
  }, [])
}

// Easing function for smooth animation (keeping for potential future use)
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}
