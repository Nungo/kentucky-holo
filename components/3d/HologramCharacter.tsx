'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

// LARGE KFC Bucket (More recognizable than chicken)
export function HologramCharacter() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.03;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.8;
      
      const scale = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      groupRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* LARGE White Bucket Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2, 1.5, 3, 32]} />
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>

      {/* Red Stripe Top */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[2.1, 2.1, 0.4, 32]} />
        <meshStandardMaterial 
          color="#e4002b"
          emissive="#e4002b"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Red Stripe Bottom */}
      <mesh position={[0, -1.3, 0]}>
        <cylinderGeometry args={[1.6, 1.6, 0.4, 32]} />
        <meshStandardMaterial 
          color="#e4002b"
          emissive="#e4002b"
          emissiveIntensity={1}
        />
      </mesh>

      {/* GIANT KFC Text - Front */}
      <Text
        position={[0, 0, 2.1]}
        fontSize={1.2}
        color="#e4002b"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        KFC
      </Text>

      {/* GIANT KFC Text - Back */}
      <Text
        position={[0, 0, -2.1]}
        rotation={[0, Math.PI, 0]}
        fontSize={1.2}
        color="#e4002b"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        KFC
      </Text>

      {/* GIANT KFC Text - Right */}
      <Text
        position={[2.1, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={1.2}
        color="#e4002b"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        KFC
      </Text>

      {/* GIANT KFC Text - Left */}
      <Text
        position={[-2.1, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={1.2}
        color="#e4002b"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        KFC
      </Text>

      {/* SUPER BRIGHT Glow Lights */}
      <pointLight position={[0, 0, 2.5]} intensity={5} color="#e4002b" distance={8} />
      <pointLight position={[0, 0, -2.5]} intensity={5} color="#ff0000" distance={8} />
      <pointLight position={[2.5, 0, 0]} intensity={5} color="#ff6b00" distance={8} />
      <pointLight position={[-2.5, 0, 0]} intensity={5} color="#ff0000" distance={8} />
      <pointLight position={[0, 2, 0]} intensity={4} color="#ffffff" distance={6} />
      <pointLight position={[0, -2, 0]} intensity={4} color="#e4002b" distance={6} />

      {/* Orbiting Stars */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 + (Date.now() * 0.001);
        const radius = 3.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 0.5 + Date.now() * 0.002) * 1.5;
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial 
              color="#ffd700"
              transparent
              opacity={0.9}
            />
            <pointLight intensity={2} color="#ffd700" distance={2} />
          </mesh>
        );
      })}
    </group>
  );
}