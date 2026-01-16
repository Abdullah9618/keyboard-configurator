import { useRef, useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useStore } from '../store/useStore'
import * as THREE from 'three'
import gsap from 'gsap'

const MODEL_URL = '/assets/keyboard.glb'

// Color configurations for different switch types - Catchy vibrant colors
const SWITCH_COLORS = {
  red: {
    emissive: new THREE.Color('#ff2d55'),
    emissiveIntensity: 1.0,
    accent: new THREE.Color('#ff6b8a')
  },
  blue: {
    emissive: new THREE.Color('#00d4ff'),
    emissiveIntensity: 1.0,
    accent: new THREE.Color('#40e0ff')
  },
  brown: {
    emissive: new THREE.Color('#ffcc00'),
    emissiveIntensity: 0.9,
    accent: new THREE.Color('#ffd633')
  }
}

// Consistent explode multiplier for uniform keycap motion
const EXPLODE_MULTIPLIER = 2

export default function Keyboard() {
  const groupRef = useRef()
  const keycapsRef = useRef([])
  const { scene } = useGLTF(MODEL_URL)
  const { viewport } = useThree()
  
  const switchColor = useStore((state) => state.switchColor)
  const explodeAmount = useStore((state) => state.explodeAmount)
  const setLoaded = useStore((state) => state.setLoaded)

  // Store original positions for keycaps only
  const originalPositions = useRef(new Map())

  // Clone scene to avoid mutations
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    return clone
  }, [scene])

  // Set loaded state immediately when component mounts
  useEffect(() => {
    setLoaded(true)
  }, [setLoaded])

  // Find keycaps and setup meshes
  useEffect(() => {
    keycapsRef.current = []
    originalPositions.current.clear()

    // Log all mesh names for reference
    console.log('=== KEYBOARD MODEL MESH NAMES ===')
    
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        console.log(`Mesh: "${child.name}"`)
        
        // Enable shadows for all meshes
        child.castShadow = true
        child.receiveShadow = true

        // Enhance materials
        if (child.material) {
          child.material = child.material.clone()
          child.material.envMapIntensity = 1.5
        }

        // Track parts for exploding animation
        // Check for common keycap naming patterns (case-insensitive)
        const nameLower = child.name.toLowerCase()
        const isKeycap = nameLower.includes('keycap') || 
                         nameLower.includes('key_') ||
                         nameLower.includes('key-') ||
                         nameLower.includes('cap') ||
                         nameLower.includes('button') ||
                         (nameLower.includes('key') && !nameLower.includes('keyboard'))
        
        if (isKeycap) {
          // Store original position for this keycap
          originalPositions.current.set(child.uuid, child.position.clone())
          keycapsRef.current.push(child)
        }
      }
    })
    
    console.log(`=== Found ${keycapsRef.current.length} keycaps ===`)
    
    // If no keycaps found, animate ALL meshes as fallback
    if (keycapsRef.current.length === 0) {
      console.log('No keycaps detected by name, animating all meshes...')
      clonedScene.traverse((child) => {
        if (child.isMesh) {
          originalPositions.current.set(child.uuid, child.position.clone())
          keycapsRef.current.push(child)
        }
      })
      console.log(`=== Fallback: animating ${keycapsRef.current.length} meshes ===`)
    }
  }, [clonedScene])

  // Update switch colors - apply to all meshes with emissive glow
  useEffect(() => {
    const colorConfig = SWITCH_COLORS[switchColor]

    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Apply subtle emissive glow to all parts
        child.material.emissive = colorConfig.emissive
        child.material.emissiveIntensity = 0.05
        
        // Apply stronger glow to keycaps and switches
        const isKeycap = child.name.toLowerCase().includes('keycap')
        const isSwitch = child.name.toLowerCase().includes('switch') ||
                        child.name.toLowerCase().includes('led') ||
                        child.name.toLowerCase().includes('light')

        if (isKeycap || isSwitch) {
          gsap.to(child.material, {
            emissiveIntensity: colorConfig.emissiveIntensity * 0.3,
            duration: 0.5,
            ease: 'power2.out'
          })
        }
      }
    })
  }, [switchColor, clonedScene])

  // Clean exploding view animation - ONLY keycaps, uniform Y motion
  useEffect(() => {
    keycapsRef.current.forEach((keycap) => {
      const originalPos = originalPositions.current.get(keycap.uuid)
      if (!originalPos) return

      // Calculate uniform Y offset: scroll.offset * multiplier
      // All keycaps rise by the same amount for clean, uniform motion
      const targetY = originalPos.y + (explodeAmount * EXPLODE_MULTIPLIER)

      // Use GSAP for smooth interpolation
      gsap.to(keycap.position, {
        y: targetY,
        duration: 0.4,
        ease: 'power2.out'
      })
    })
  }, [explodeAmount])

  // Gentle hover animation
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle breathing animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02
    }
  })

  // Base scale - larger for better view
  const baseScale = Math.min(0.25, viewport.width / 30)
  // Dynamic zoom: scale increases slightly as explode amount increases
  const zoomBoost = 1 + (explodeAmount * 0.15)
  const scale = baseScale * zoomBoost

  return (
    <group ref={groupRef} dispose={null}>
      <primitive 
        object={clonedScene} 
        scale={scale}
        position={[0, 0, 0]}
        rotation={[0.3, 0, 0]}
      />
    </group>
  )
}

// Preload the model
useGLTF.preload('/assets/keyboard.glb')
