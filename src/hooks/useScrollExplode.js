import { useEffect } from 'react'
import { useStore } from '../store/useStore'

/**
 * Custom hook that tracks scroll position and 
 * updates the explode amount for the keyboard animation
 */
export function useScrollExplode() {
  const setExplodeAmount = useStore((state) => state.setExplodeAmount)

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress (0 to 1)
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = Math.min(scrollTop / (docHeight || 1), 1)
      
      // Apply easing for smoother animation
      const easedProgress = easeOutCubic(scrollProgress)
      
      setExplodeAmount(easedProgress)
    }

    // Throttle scroll handler for performance
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledScroll)
    }
  }, [setExplodeAmount])
}

// Easing function for smooth animation
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}
