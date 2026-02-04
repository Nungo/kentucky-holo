'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Text } from '@react-three/drei';
import { useAppStore } from '@/store/useAppStore';
import * as THREE from 'three';
import { useStoryStore } from '@/store/useStoryStore';

interface FloatingBucketProps {
  onClick?: () => void;
  discovered?: boolean;
}

export function FloatingBucket({ onClick, discovered = true }: FloatingBucketProps) {
  const meshRef = useRef<Mesh>(null);
  const mode = useAppStore((state) => state.mode);
  const currentStory = useStoryStore((state) => state.currentStory);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      
      // MOVE UP when story is active (so it's visible above popup)
      const targetY = currentStory && mode === 'night' 
        ? Math.sin(state.clock.elapsedTime) * 0.3 + 2  // Move up by 2 units
        : Math.sin(state.clock.elapsedTime) * 0.3;     // Normal position
      
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetY,
        0.05
      );

      if (onClick && mode === 'day') {
        if (clicked) {
          const bounce = Math.sin(state.clock.elapsedTime * 10) * 0.2;
          meshRef.current.scale.set(1 + bounce * 0.3, 1 + bounce * 0.3, 1 + bounce * 0.3);
        } else if (hovered) {
          meshRef.current.scale.lerp({ x: 1.15, y: 1.15, z: 1.15 } as any, 0.1);
        } else {
          meshRef.current.scale.lerp({ x: 1, y: 1, z: 1 } as any, 0.1);
        }
      }
    }
  });

  const handleClick = () => {
    if (onClick) {
      onClick();
      setClicked(true);
      setTimeout(() => setClicked(false), 500);
    }
  };

  return (
    <group
      ref={meshRef}
      onClick={handleClick}
      onPointerOver={() => onClick && setHovered(true)}
      onPointerOut={() => onClick && setHovered(false)}
    >
      {/* Main bucket body - DARK GREY/BLACK */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1, 2, 32]} />
        <meshStandardMaterial 
          color={discovered ? "#2a2a2a" : "#999999"}
          metalness={0.1}
          roughness={0.4}
        />
      </mesh>

      {/* KFC Text - Front */}
      <Text
        position={[0, 0, 1.25]}
        fontSize={0.6}
        color="#e4002b"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        KFC
      </Text>

      {/* KFC Text - Back */}
      <Text
        position={[0, 0, -1.25]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.6}
        color="#e4002b"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        KFC
      </Text>

      {/* KFC Text - Right */}
      <Text
        position={[1.25, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.6}
        color="#e4002b"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        KFC
      </Text>

      {/* KFC Text - Left */}
      <Text
        position={[-1.25, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={0.6}
        color="#e4002b"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        KFC
      </Text>

      {/* Bucket rim - DARK GREY */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[1.3, 1.25, 0.15, 32]} />
        <meshStandardMaterial 
          color="#3a3a3a"
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>

      {/* Night mode - STRONG RED GLOW */}
      {mode === 'night' && (
        <>
          <pointLight position={[0, 0, 1.5]} intensity={1.5} color="#e4002b" distance={3} />
          <pointLight position={[0, 0, -1.5]} intensity={1.2} color="#ff6b8a" distance={2.5} />
          <pointLight position={[0, 1.2, 0]} intensity={0.8} color="#e4002b" distance={2} />
          <pointLight position={[0, -1, 0]} intensity={0.6} color="#e4002b" distance={2} />
        </>
      )}

      {/* Day mode glow */}
      {discovered && mode === 'day' && onClick && (
        <pointLight intensity={0.5} color="#e4002b" distance={2} />
      )}
    </group>
  );
}