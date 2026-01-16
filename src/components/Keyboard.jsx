import { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useProgress } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useStore } from '../store/useStore'
import * as THREE from 'three'
import gsap from 'gsap'

const MODEL_URL = '/assets/keyboard.glb'

// Color configurations for different switch types
const SWITCH_COLORS = {
  red: {
    emissive: new THREE.Color('#ff4757'),
    emissiveIntensity: 0.8,
    accent: new THREE.Color('#ff6b7a')
  },
  blue: {
    emissive: new THREE.Color('#3742fa'),
    emissiveIntensity: 0.9,
    accent: new THREE.Color('#5352ed')
  },
  brown: {
    emissive: new THREE.Color('#c4a35a'),
    emissiveIntensity: 0.6,
    accent: new THREE.Color('#d4b36a')
  }
}

// Generate a seeded random number for consistent randomness per mesh
function seededRandom(seed) {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

export default function Keyboard() {
  const groupRef = useRef()
  const meshesRef = useRef([])
  const { scene, nodes, materials } = useGLTF(MODEL_URL)
  const { viewport } = useThree()
  
  const switchColor = useStore((state) => state.switchColor)
  const explodeAmount = useStore((state) => state.explodeAmount)
  const setLoaded = useStore((state) => state.setLoaded)

  // Store original positions for all meshes
  const originalPositions = useRef(new Map())
  // Store random offsets for each mesh (for cool variation)
  const randomOffsets = useRef(new Map())

  // Clone scene to avoid mutations
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    return clone
  }, [scene])

  // Log nodes for debugging and find all meshes
  useEffect(() => {
    // Log nodes to console for future reference
    console.log('=== KEYBOARD MODEL NODES ===')
    console.log(nodes)
    console.log('=== END NODES ===')

    meshesRef.current = []
    originalPositions.current.clear()
    randomOffsets.current.clear()

    let meshIndex = 0
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        // Store original position
        originalPositions.current.set(child.uuid, child.position.clone())
        
        // Generate random offset multipliers for this mesh (0.3 to 1.0 range for variety)
        const randomY = 0.3 + seededRandom(meshIndex * 1.1) * 0.7  // Y offset multiplier
        const randomX = (seededRandom(meshIndex * 2.2) - 0.5) * 0.4  // X drift (-0.2 to 0.2)
        const randomZ = (seededRandom(meshIndex * 3.3) - 0.5) * 0.4  // Z drift (-0.2 to 0.2)
        const randomRotX = (seededRandom(meshIndex * 4.4) - 0.5) * 0.3  // Rotation variation
        const randomRotZ = (seededRandom(meshIndex * 5.5) - 0.5) * 0.3
        
        randomOffsets.current.set(child.uuid, {
          y: randomY,
          x: randomX,
          z: randomZ,
          rotX: randomRotX,
          rotZ: randomRotZ
        })

        // Add ALL meshes to our array for explosion
        meshesRef.current.push(child)
        meshIndex++

        // Enable shadows
        child.castShadow = true
        child.receiveShadow = true

        // Enhance materials
        if (child.material) {
          child.material = child.material.clone()
          child.material.envMapIntensity = 1.5
        }
      }
    })

    console.log(`Found ${meshesRef.current.length} meshes in model`)
    setLoaded(true)
  }, [clonedScene, nodes, setLoaded])

  // Update switch colors - apply to all meshes with emissive glow
  useEffect(() => {
    const colorConfig = SWITCH_COLORS[switchColor]

    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Apply subtle emissive glow to all parts
        child.material.emissive = colorConfig.emissive
        child.material.emissiveIntensity = 0.05
        
        // Apply stronger glow to parts that might be switches/LEDs
        const isSwitch = child.name.toLowerCase().includes('switch') ||
                        child.name.toLowerCase().includes('led') ||
                        child.name.toLowerCase().includes('light') ||
                        child.name.toLowerCase().includes('key')

        if (isSwitch) {
          gsap.to(child.material, {
            emissiveIntensity: colorConfig.emissiveIntensity * 0.3,
            duration: 0.5,
            ease: 'power2.out'
          })
        }
      }
    })
  }, [switchColor, clonedScene])

  // Generic Exploding view animation - applies to ALL meshes
  useEffect(() => {
    meshesRef.current.forEach((mesh) => {
      const originalPos = originalPositions.current.get(mesh.uuid)
      const offsets = randomOffsets.current.get(mesh.uuid)
      if (!originalPos || !offsets) return

      // Calculate explosion offset with randomized distances
      const explodeY = originalPos.y + (explodeAmount * 2.5 * offsets.y)
      const explodeX = originalPos.x + (explodeAmount * offsets.x)
      const explodeZ = originalPos.z + (explodeAmount * offsets.z)

      gsap.to(mesh.position, {
        x: explodeX,
        y: explodeY,
        z: explodeZ,
        duration: 0.6,
        ease: 'power2.out'
      })

      // Add slight rotation during explosion for extra cool effect
      gsap.to(mesh.rotation, {
        x: explodeAmount * offsets.rotX,
        z: explodeAmount * offsets.rotZ,
        duration: 0.6,
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

  return (
    <group ref={groupRef} dispose={null}>
      <primitive 
        object={clonedScene} 
        scale={2}
        position={[0, 0, 0]}
        rotation={[0.1, 0, 0]}
      />
    </group>
  )
}

// Preload the model
useGLTF.preload('/assets/keyboard.glb')
