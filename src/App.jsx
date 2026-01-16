import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import Experience from './components/Experience'
import Sidebar from './components/Sidebar'
import Loader from './components/Loader'
import SpecsOverlay from './components/SpecsOverlay'
import Header from './components/Header'
import { useStore } from './store/useStore'

function App() {
  const [showSpecs, setShowSpecs] = useState(false)
  const switchColor = useStore((state) => state.switchColor)

  return (
    <div className="app">
      {/* Header */}
      <Header onSpecsClick={() => setShowSpecs(true)} />

      {/* Main 3D Canvas */}
      <div className="canvas-container">
        <Canvas
          shadows
          camera={{ position: [0, 2, 5], fov: 45 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>

        {/* Loading Screen */}
        <Loader />
      </div>

      {/* Sidebar Controls */}
      <Sidebar />

      {/* Product Info */}
      <motion.div 
        className="product-info"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="product-tag">NEW RELEASE</span>
        <h1 className="product-title">AuraGear Pro</h1>
        <p className="product-subtitle">Mechanical Keyboard</p>
        <div className="switch-indicator">
          <span className="switch-dot" style={{ 
            backgroundColor: switchColor === 'red' ? '#ff4757' : 
                           switchColor === 'blue' ? '#3742fa' : '#c4a35a' 
          }} />
          <span>{switchColor.charAt(0).toUpperCase() + switchColor.slice(1)} Switches</span>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <div className="scroll-line" />
        <span>Scroll to Explore</span>
      </motion.div>

      {/* Specs Overlay */}
      <AnimatePresence>
        {showSpecs && <SpecsOverlay onClose={() => setShowSpecs(false)} />}
      </AnimatePresence>
    </div>
  )
}

export default App
