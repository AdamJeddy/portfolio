'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Abstract morphing geometry component
function MorphingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorA: { value: new THREE.Color('#6366f1') },
        colorB: { value: new THREE.Color('#8b5cf6') },
        colorC: { value: new THREE.Color('#14b8a6') },
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          vec3 pos = position;
          
          // Create flowing deformation
          pos.x += sin(pos.y * 2.0 + time * 0.5) * 0.1;
          pos.y += cos(pos.x * 2.0 + time * 0.7) * 0.1;
          pos.z += sin(pos.x * pos.y + time * 0.3) * 0.05;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 colorA;
        uniform vec3 colorB;
        uniform vec3 colorC;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec2 uv = vUv;
          
          // Create flowing color patterns
          float pattern1 = sin(uv.x * 3.0 + time * 0.5) * 0.5 + 0.5;
          float pattern2 = cos(uv.y * 4.0 + time * 0.3) * 0.5 + 0.5;
          float pattern3 = sin(length(uv - 0.5) * 8.0 - time * 0.8) * 0.5 + 0.5;
          
          vec3 color = mix(colorA, colorB, pattern1);
          color = mix(color, colorC, pattern2 * pattern3);
          
          // Add some transparency variation
          float alpha = 0.7 + pattern3 * 0.3;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
    })
  }, [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.15) * 0.05
    }
  })

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <primitive object={shaderMaterial} ref={materialRef} />
    </mesh>
  )
}

// Floating particles
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null!)
  const particleCount = 100

  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
      
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#6366f1"
        size={0.02}
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  )
}

// Floating geometric shapes
function FloatingShapes() {
  return (
    <>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[-2, 1, -1]}>
          <octahedronGeometry args={[0.3]} />
          <meshStandardMaterial
            color="#8b5cf6"
            transparent
            opacity={0.7}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh position={[2, -1, 1]}>
          <icosahedronGeometry args={[0.4]} />
          <meshStandardMaterial
            color="#14b8a6"
            transparent
            opacity={0.6}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
      </Float>

      <Float speed={0.8} rotationIntensity={0.7} floatIntensity={0.3}>
        <mesh position={[0, 2, -2]}>
          <tetrahedronGeometry args={[0.5]} />
          <meshStandardMaterial
            color="#f97316"
            transparent
            opacity={0.5}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      </Float>
    </>
  )
}

// Main scene component
export default function AbstractScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />

        {/* 3D Elements */}
        <MorphingGeometry />
        <ParticleField />
        <FloatingShapes />

        {/* Controls - disabled for ambient experience */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  )
}
