import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { usePriceCalculator } from '../hooks/usePriceCalculator'

const SPECS = [
  { label: 'Layout', value: '75% Compact' },
  { label: 'Keys', value: '84 Keys' },
  { label: 'Connectivity', value: 'USB-C / Wireless' },
  { label: 'Battery', value: '4000mAh - 200hrs' },
  { label: 'Backlight', value: 'RGB Per-Key' },
  { label: 'Material', value: 'Aluminum Frame' },
  { label: 'Weight', value: '820g' },
  { label: 'Dimensions', value: '325 x 145 x 35mm' },
  { label: 'Polling Rate', value: '1000Hz' },
  { label: 'N-Key Rollover', value: 'Full NKRO' }
]

const SWITCH_SPECS = {
  red: {
    name: 'Cherry MX Red',
    type: 'Linear',
    actuation: '45g',
    travel: '4.0mm',
    lifespan: '100M clicks'
  },
  blue: {
    name: 'Cherry MX Blue',
    type: 'Clicky',
    actuation: '50g',
    travel: '4.0mm',
    lifespan: '100M clicks'
  },
  brown: {
    name: 'Cherry MX Brown',
    type: 'Tactile',
    actuation: '45g',
    travel: '4.0mm',
    lifespan: '100M clicks'
  }
}

export default function SpecsOverlay({ onClose }) {
  const switchColor = useStore((state) => state.switchColor)
  const { price, stock } = usePriceCalculator(switchColor)
  const currentSwitch = SWITCH_SPECS[switchColor]

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { delay: 0.1, duration: 0.4 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.3 }
    }
  }

  return (
    <motion.div
      className="specs-overlay"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="specs-content"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="specs-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="specs-header">
          <h2>AuraGear Pro</h2>
          <p className="specs-subtitle">Technical Specifications</p>
          <div className="specs-price-badge">
            <span className="price">${price.toFixed(2)}</span>
            <span className={`stock ${stock > 10 ? 'in-stock' : 'low-stock'}`}>
              {stock > 10 ? 'In Stock' : `${stock} left`}
            </span>
          </div>
        </div>

        <div className="specs-grid">
          {/* General Specs */}
          <div className="specs-section">
            <h3>General</h3>
            <div className="specs-list">
              {SPECS.map((spec, index) => (
                <motion.div 
                  key={spec.label}
                  className="spec-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className="spec-label">{spec.label}</span>
                  <span className="spec-value">{spec.value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Switch Specs */}
          <div className="specs-section switch-section">
            <h3>
              Switch Type
              <span 
                className="switch-color-indicator"
                style={{ 
                  backgroundColor: switchColor === 'red' ? '#ff4757' : 
                                  switchColor === 'blue' ? '#3742fa' : '#c4a35a' 
                }}
              />
            </h3>
            <div className="switch-card">
              <div className="switch-name">{currentSwitch.name}</div>
              <div className="switch-type-badge">{currentSwitch.type}</div>
              <div className="switch-details">
                <div className="switch-detail">
                  <span className="detail-label">Actuation Force</span>
                  <span className="detail-value">{currentSwitch.actuation}</span>
                </div>
                <div className="switch-detail">
                  <span className="detail-label">Total Travel</span>
                  <span className="detail-value">{currentSwitch.travel}</span>
                </div>
                <div className="switch-detail">
                  <span className="detail-label">Lifespan</span>
                  <span className="detail-value">{currentSwitch.lifespan}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="specs-features">
          <h3>Key Features</h3>
          <div className="features-grid">
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Hot-Swappable</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎨</span>
              <span>16.8M Colors</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🔊</span>
              <span>Sound Dampening</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💾</span>
              <span>Onboard Memory</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎮</span>
              <span>Gaming Mode</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📱</span>
              <span>App Control</span>
            </div>
          </div>
        </div>

        <motion.button
          className="specs-cta"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Configure & Buy
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
