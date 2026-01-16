import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { 
  Environment, 
  ContactShadows, 
  OrbitControls,
  Float,
  Stars
} from '@react-three/drei'
import { useStore } from '../store/useStore'
import Keyboard from './Keyboard'
import * as THREE from 'three'

export default function Experience() {
  const controlsRef = useRef()
  const autoRotate = useStore((state) => state.autoRotate)
  const { camera } = useThree()

  // Smooth camera animation on mount
  useEffect(() => {
    camera.position.set(4, 3, 6)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <>
      {/* Environment & Lighting */}
      <Environment
        preset="city"
        environmentIntensity={0.4}
        backgroundBlurriness={0.8}
      />

      {/* Ambient Light */}
      <ambientLight intensity={0.2} />

      {/* Key Lights */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Rim Light */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.8}
        color="#4a9eff"
      />

      {/* Fill Light */}
      <pointLight
        position={[0, -2, 5]}
        intensity={0.5}
        color="#ff6b6b"
      />

      {/* Accent Spot Light */}
      <spotLight
        position={[0, 8, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
        color="#ffffff"
      />

      {/* Stars Background */}
      <Stars
        radius={100}
        depth={50}
        count={2000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Floating Keyboard Model */}
      <Float
        speed={1.5}
        rotationIntensity={0.2}
        floatIntensity={0.3}
        floatingRange={[-0.1, 0.1]}
      >
        <Keyboard />
      </Float>

      {/* Ground Contact Shadows */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.65}
        scale={12}
        blur={2.5}
        far={4}
        color="#1a1a2e"
      />

      {/* Ground Plane for Reflections */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#0a0a0f"
          metalness={0.8}
          roughness={0.4}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Orbit Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        autoRotate={autoRotate}
        autoRotateSpeed={1}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={3}
        maxDistance={10}
        dampingFactor={0.05}
        enableDamping={true}
      />
    </>
  )
}
