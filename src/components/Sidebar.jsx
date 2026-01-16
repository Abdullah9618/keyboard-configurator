import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { usePriceCalculator } from '../hooks/usePriceCalculator'

const SWITCH_OPTIONS = [
  { id: 'red', name: 'Cherry MX Red', type: 'Linear', color: '#ff4757' },
  { id: 'blue', name: 'Cherry MX Blue', type: 'Clicky', color: '#3742fa' },
  { id: 'brown', name: 'Cherry MX Brown', type: 'Tactile', color: '#c4a35a' }
]

export default function Sidebar() {
  const switchColor = useStore((state) => state.switchColor)
  const setSwitchColor = useStore((state) => state.setSwitchColor)
  const autoRotate = useStore((state) => state.autoRotate)
  const toggleAutoRotate = useStore((state) => state.toggleAutoRotate)
  const explodeAmount = useStore((state) => state.explodeAmount)
  const setExplodeAmount = useStore((state) => state.setExplodeAmount)

  const { price, stock, isLoading } = usePriceCalculator(switchColor)

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 1,
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <motion.aside 
      className="sidebar"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Switch Color Selector */}
      <motion.div className="sidebar-section" variants={itemVariants}>
        <h3 className="section-title">Switch Type</h3>
        <div className="switch-options">
          {SWITCH_OPTIONS.map((option) => (
            <motion.button
              key={option.id}
              className={`switch-option ${switchColor === option.id ? 'active' : ''}`}
              onClick={() => setSwitchColor(option.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span 
                className="switch-color-dot" 
                style={{ backgroundColor: option.color }}
              />
              <div className="switch-info">
                <span className="switch-name">{option.name}</span>
                <span className="switch-type">{option.type}</span>
              </div>
              {switchColor === option.id && (
                <motion.div 
                  className="switch-selected-indicator"
                  layoutId="switchIndicator"
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Explode View Control */}
      <motion.div className="sidebar-section" variants={itemVariants}>
        <h3 className="section-title">Exploded View</h3>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explodeAmount}
            onChange={(e) => setExplodeAmount(parseFloat(e.target.value))}
            className="slider"
          />
          <div className="slider-labels">
            <span>Assembled</span>
            <span>Exploded</span>
          </div>
        </div>
      </motion.div>

      {/* Auto Rotate Toggle */}
      <motion.div className="sidebar-section" variants={itemVariants}>
        <h3 className="section-title">Display</h3>
        <motion.button
          className={`toggle-button ${autoRotate ? 'active' : ''}`}
          onClick={toggleAutoRotate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="toggle-icon">{autoRotate ? '⟳' : '○'}</span>
          <span>Auto Rotate</span>
          <span className={`toggle-status ${autoRotate ? 'on' : 'off'}`}>
            {autoRotate ? 'ON' : 'OFF'}
          </span>
        </motion.button>
      </motion.div>

      {/* Price & Stock Display */}
      <motion.div className="sidebar-section pricing" variants={itemVariants}>
        <div className="price-display">
          <span className="price-label">Price</span>
          <span className="price-value">
            {isLoading ? (
              <span className="loading-shimmer">---</span>
            ) : (
              `$${price.toFixed(2)}`
            )}
          </span>
        </div>
        <div className="stock-display">
          <span className="stock-label">Stock</span>
          <span className={`stock-value ${stock > 10 ? 'in-stock' : stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
            {isLoading ? (
              <span className="loading-shimmer">---</span>
            ) : stock > 10 ? (
              'In Stock'
            ) : stock > 0 ? (
              `Only ${stock} left`
            ) : (
              'Out of Stock'
            )}
          </span>
        </div>
        <motion.button
          className="buy-button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={stock === 0}
        >
          <span>Add to Cart</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6h15l-1.5 9h-12z" />
            <circle cx="9" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
        </motion.button>
      </motion.div>
    </motion.aside>
  )
}
