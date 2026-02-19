'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

// Large animated chicken drumstick for hologram
export function HologramCharacter() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Rotate and float
      groupRef.current.rotation.y += 0.02;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.5;
      
      // Gentle scale pulse
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* LARGE Chicken Drumstick */}
      
      {/* Drumstick bone (white stick) */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.1, 1, 16]} />
        <meshStandardMaterial 
          color="#f5f5dc"
          metalness={0.1}
          roughness={0.6}
        />
      </mesh>

      {/* Drumstick meat (golden brown) */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          color="#d4a574"
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>

      {/* Crispy coating bumps */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 0.75;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <mesh 
            key={i} 
            position={[x, 0.3 + Math.sin(i) * 0.2, z]}
          >
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial 
              color="#c49563"
              roughness={0.8}
            />
          </mesh>
        );
      })}

      {/* Glowing "KFC" text on drumstick */}
      <Text
        position={[0, 0.3, 0.85]}
        fontSize={0.25}
        color="#e4002b"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        KFC
      </Text>

      {/* Sparkles around drumstick */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 0.5) * 0.5;
        
        return (
          <mesh key={`sparkle-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial 
              color="#ffd700"
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}

      {/* Glowing aura */}
      <pointLight 
        position={[0, 0.3, 0]} 
        intensity={2} 
        color="#ff6b00" 
        distance={4} 
      />
      
      <pointLight 
        position={[0, 1, 0]} 
        intensity={1.5} 
        color="#ffd700" 
        distance={3} 
      />
    </group>
  );
}

// Alternative: Large Colonel Sanders Face (if you prefer)
export function ColonelFace() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.015;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Large circular face */}
      <mesh>
        <cylinderGeometry args={[1.5, 1.5, 0.3, 32]} />
        <meshStandardMaterial 
          color="#ffffff"
          metalness={0.1}
          roughness={0.4}
        />
      </mesh>

      {/* Red border */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.15, 16, 32]} />
        <meshStandardMaterial 
          color="#e4002b"
          emissive="#e4002b"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* KFC Text */}
      <Text
        position={[0, 0, 0.2]}
        fontSize={0.6}
        color="#e4002b"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        KFC
      </Text>

      {/* Glow */}
      <pointLight 
        position={[0, 0, 0.5]} 
        intensity={3} 
        color="#e4002b" 
        distance={5} 
      />
    </group>
  );
}