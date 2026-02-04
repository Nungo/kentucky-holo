'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial, Text } from '@react-three/drei';

// Floating Particles (Spices, Herbs, Stars)
export function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = 200;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Create particles in a sphere around the bucket
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 3 + Math.random() * 2;
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Rotate particle system slowly
      pointsRef.current.rotation.y += 0.001;
      
      // Make particles float up and down
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3 + 1;
        positions[idx] += Math.sin(state.clock.elapsedTime + i) * 0.001;
        
        // Reset if too high or low
        if (positions[idx] > 3) positions[idx] = -3;
        if (positions[idx] < -3) positions[idx] = 3;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#ff6b8a"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

// Sparkle Particles (Smaller, brighter)
export function SparkleParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = 100;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        // Twinkle effect
        positions[idx] += Math.sin(state.clock.elapsedTime * 2 + i) * 0.002;
        positions[idx + 1] += Math.cos(state.clock.elapsedTime * 2 + i) * 0.002;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

// Light Beams (Subtle rays from bucket)
export function LightBeams() {
  const beamsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (beamsRef.current) {
      beamsRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={beamsRef}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 0.1;
        const z = Math.sin(angle) * 0.1;
        
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, angle, 0]}>
            <planeGeometry args={[0.05, 4]} />
            <meshBasicMaterial
              color="#e4002b"
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Floating Text Elements (Story words, recipe notes)
export function FloatingTextElements({ isStoryActive }: { isStoryActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const textElements = useMemo(() => {
    return [
      { text: '11 Herbs', position: [-2, 2, 0], color: '#ffd700' },
      { text: '& Spices', position: [2, 1.5, 0], color: '#ffd700' },
      { text: 'Secret Recipe', position: [0, 2.5, -1], color: '#ff6b8a' },
      { text: 'Original', position: [-1.5, -1, 1], color: '#ffaa00' },
      { text: 'Crispy', position: [1.8, -1.5, -0.5], color: '#ffaa00' },
    ];
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  // HIDE when story is active - this prevents blocking hologram
  if (isStoryActive) return null;

  return (
    <group ref={groupRef}>
      {textElements.map((element, i) => (
        <Text
          key={i}
          position={element.position as [number, number, number]}
          fontSize={0.15}
          color={element.color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {element.text}
        </Text>
      ))}
    </group>
  );
}

// Orbiting Ingredient Icons (Visual representation)
export function OrbitingIngredients() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const ingredients = [
    { angle: 0, color: '#ff6b8a' },
    { angle: Math.PI * 2 / 3, color: '#ffd700' },
    { angle: Math.PI * 4 / 3, color: '#ffaa00' },
  ];

  return (
    <group ref={groupRef}>
      {ingredients.map((ingredient, i) => {
        const radius = 2;
        const x = Math.cos(ingredient.angle) * radius;
        const z = Math.sin(ingredient.angle) * radius;
        
        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color={ingredient.color} transparent opacity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}