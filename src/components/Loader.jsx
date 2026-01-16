import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { useEffect, useState } from 'react'

export default function Loader() {
  const { progress, active } = useProgress()
  const isLoaded = useStore((state) => state.isLoaded)
  const [forceHide, setForceHide] = useState(false)

  // Force hide loader after 3 seconds to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceHide(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const showLoader = !forceHide && (active || !isLoaded)

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div 
          className="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <div className="loader-content">
            <div className="loader-logo">
              <svg viewBox="0 0 80 80" fill="none">
                <circle 
                  cx="40" 
                  cy="40" 
                  r="35" 
                  stroke="url(#loaderGradient)" 
                  strokeWidth="2"
                  strokeDasharray="220"
                  strokeDashoffset={220 - (progress / 100) * 220}
                  strokeLinecap="round"
                  className="loader-circle"
                />
                <path 
                  d="M25 40L40 25L55 40L40 55L25 40Z" 
                  fill="url(#loaderGradient)"
                  className="loader-diamond"
                />
                <defs>
                  <linearGradient id="loaderGradient" x1="0" y1="0" x2="80" y2="80">
                    <stop offset="0%" stopColor="#667eea"/>
                    <stop offset="100%" stopColor="#764ba2"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2 className="loader-title">AuraGear</h2>
            <div className="loader-progress">
              <div 
                className="loader-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="loader-percentage">{Math.round(progress)}%</span>
            <p className="loader-text">Loading premium experience...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
