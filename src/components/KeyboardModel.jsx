import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { useStore } from '../store/useStore'
import * as THREE from 'three'

// Keyboard layout - simplified QWERTY
const KEYBOARD_LAYOUT = [
  // Row 0 - Function keys
  { row: 0, keys: ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'] },
  // Row 1 - Number row
  { row: 1, keys: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Back'] },
  // Row 2 - QWERTY row
  { row: 2, keys: ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'] },
  // Row 3 - Home row
  { row: 3, keys: ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'] },
  // Row 4 - Bottom row
  { row: 4, keys: ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'] },
  // Row 5 - Space row
  { row: 5, keys: ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Menu', 'Ctrl'] }
]

// Key width multipliers for special keys
const KEY_WIDTHS = {
  'Back': 2,
  'Tab': 1.5,
  '\\': 1.5,
  'Caps': 1.75,
  'Enter': 2.25,
  'Shift': 2.25,
  'Ctrl': 1.25,
  'Win': 1.25,
  'Alt': 1.25,
  'Space': 6.25,
  'Fn': 1,
  'Menu': 1.25
}

// Switch colors - Catchy vibrant colors
const SWITCH_COLORS = {
  red: '#ff2d55',      // Hot Pink Red
  blue: '#00d4ff',     // Electric Cyan
  brown: '#ffcc00'     // Golden Yellow
}

function Key({ position, width = 1, height = 1, label, switchColor, explodeAmount, index }) {
  const meshRef = useRef()
  
  // Calculate explosion offset
  const explodeOffset = useMemo(() => {
    const seed = index * 12345
    const random = (s) => {
      const x = Math.sin(s) * 10000
      return x - Math.floor(x)
    }
    return {
      y: 0.3 + random(seed) * 0.7,
      x: (random(seed * 2) - 0.5) * 0.3,
      z: (random(seed * 3) - 0.5) * 0.3,
      rotX: (random(seed * 4) - 0.5) * 0.4,
      rotZ: (random(seed * 5) - 0.5) * 0.4
    }
  }, [index])

  const currentPosition = useMemo(() => {
    return [
      position[0] + explodeAmount * explodeOffset.x * 2,
      position[1] + explodeAmount * explodeOffset.y * 3,
      position[2] + explodeAmount * explodeOffset.z * 2
    ]
  }, [position, explodeAmount, explodeOffset])

  const currentRotation = useMemo(() => {
    return [
      explodeAmount * explodeOffset.rotX,
      0,
      explodeAmount * explodeOffset.rotZ
    ]
  }, [explodeAmount, explodeOffset])

  return (
    <group position={currentPosition} rotation={currentRotation}>
      {/* Keycap */}
      <RoundedBox
        ref={meshRef}
        args={[width * 0.9, 0.4, height * 0.9]}
        radius={0.05}
        smoothness={4}
        position={[0, 0.25, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.3}
          roughness={0.4}
        />
      </RoundedBox>
      
      {/* Switch underneath (visible when exploded) */}
      <mesh position={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.5]} />
        <meshStandardMaterial
          color={SWITCH_COLORS[switchColor]}
          emissive={SWITCH_COLORS[switchColor]}
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}

function KeyboardBase({ explodeAmount }) {
  const baseOffset = explodeAmount * -1.5

  return (
    <group position={[0, baseOffset, 0]}>
      {/* Main base */}
      <RoundedBox
        args={[15, 0.5, 6]}
        radius={0.1}
        smoothness={4}
        position={[0, -0.3, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.7}
          roughness={0.3}
        />
      </RoundedBox>
      
      {/* PCB layer */}
      <RoundedBox
        args={[14.5, 0.1, 5.5]}
        radius={0.05}
        smoothness={4}
        position={[0, 0, 0]}
        castShadow
      >
        <meshStandardMaterial
          color="#0d5c0d"
          metalness={0.4}
          roughness={0.6}
        />
      </RoundedBox>
      
      {/* Plate */}
      <RoundedBox
        args={[14.5, 0.15, 5.5]}
        radius={0.05}
        smoothness={4}
        position={[0, 0.1, 0]}
        castShadow
      >
        <meshStandardMaterial
          color="#333333"
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>
    </group>
  )
}

export default function KeyboardModel() {
  const groupRef = useRef()
  const { viewport } = useThree()
  
  const switchColor = useStore((state) => state.switchColor)
  const explodeAmount = useStore((state) => state.explodeAmount)
  const setLoaded = useStore((state) => state.setLoaded)

  // Set loaded immediately since we're not loading an external file
  useMemo(() => {
    setLoaded(true)
  }, [setLoaded])

  // Generate all keys with positions
  const keys = useMemo(() => {
    const allKeys = []
    let keyIndex = 0
    
    const startX = -7
    const startZ = -2.5
    const keySize = 1
    const keyGap = 0.1
    const rowGap = 0.15

    KEYBOARD_LAYOUT.forEach((row, rowIndex) => {
      let xOffset = 0
      
      // Add gap after function keys row
      const rowZ = startZ + rowIndex * (keySize + rowGap) + (rowIndex > 0 ? 0.3 : 0)
      
      row.keys.forEach((key) => {
        const width = KEY_WIDTHS[key] || 1
        const x = startX + xOffset + (width * keySize) / 2
        
        allKeys.push({
          key,
          position: [x, 0, rowZ],
          width: width * keySize,
          index: keyIndex++
        })
        
        xOffset += width * keySize + keyGap
      })
    })
    
    return allKeys
  }, [])

  // Gentle rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
  })

  // Responsive scale
  const scale = Math.min(0.5, viewport.width / 20)

  return (
    <group ref={groupRef} scale={scale} rotation={[0.3, 0, 0]} position={[0, 0, 0]}>
      {/* Keyboard Base */}
      <KeyboardBase explodeAmount={explodeAmount} />
      
      {/* All Keys */}
      {keys.map((keyData) => (
        <Key
          key={keyData.index}
          position={keyData.position}
          width={keyData.width}
          label={keyData.key}
          switchColor={switchColor}
          explodeAmount={explodeAmount}
          index={keyData.index}
        />
      ))}
    </group>
  )
}
