import { motion } from 'framer-motion'

export default function Header({ onSpecsClick }) {
  return (
    <motion.header 
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="logo">
        <div className="logo-icon">
          <svg viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="url(#logoGradient)" strokeWidth="2"/>
            <path d="M12 20L20 12L28 20L20 28L12 20Z" fill="url(#logoGradient)"/>
            <defs>
              <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stopColor="#667eea"/>
                <stop offset="100%" stopColor="#764ba2"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="logo-text">AuraGear</span>
      </div>

      <nav className="nav">
        <a href="#" className="nav-link active">Keyboards</a>
        <a href="#" className="nav-link">Mice</a>
        <a href="#" className="nav-link">Accessories</a>
        <motion.button 
          className="nav-specs-btn"
          onClick={onSpecsClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          Specs
        </motion.button>
      </nav>

      <div className="header-actions">
        <motion.button 
          className="cart-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6h15l-1.5 9h-12z"/>
            <circle cx="9" cy="20" r="1"/>
            <circle cx="18" cy="20" r="1"/>
          </svg>
          <span className="cart-count">0</span>
        </motion.button>
      </div>
    </motion.header>
  )
}
