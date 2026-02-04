'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Text } from '@react-three/drei';

interface MenuItem3DProps {
  position: [number, number, number];
  type: 'bucket' | 'chicken' | 'burger' | 'fries' | 'wings';
  onClick: () => void;
  discovered: boolean;
}

export function MenuItem3D({ position, type, onClick, discovered }: MenuItem3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      // Bounce when clicked
      if (clicked) {
        const bounce = Math.sin(state.clock.elapsedTime * 10) * 0.2;
        meshRef.current.scale.set(1 + bounce * 0.3, 1 + bounce * 0.3, 1 + bounce * 0.3);
      } else if (hovered) {
        meshRef.current.scale.lerp({ x: 1.2, y: 1.2, z: 1.2 } as any, 0.1);
      } else {
        meshRef.current.scale.lerp({ x: 1, y: 1, z: 1 } as any, 0.1);
      }
    }
  });

  const handleClick = () => {
    onClick();
    setClicked(true);
    setTimeout(() => setClicked(false), 500);
  };

  // Different geometries for different items
  const renderGeometry = () => {
    switch (type) {
      case 'bucket':
        return (
          <group>
            <mesh>
              <cylinderGeometry args={[0.4, 0.35, 0.5, 16]} />
              <meshStandardMaterial color={discovered ? "#e4002b" : "#999999"} />
            </mesh>
            <Text position={[0, 0, 0.41]} fontSize={0.15} color="#ffffff">
              KFC
            </Text>
          </group>
        );
      
      case 'chicken':
        return (
          <mesh>
            <dodecahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial 
              color={discovered ? "#d4a574" : "#999999"} 
              roughness={0.8}
            />
          </mesh>
        );
      
      case 'burger':
        return (
          <group>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
              <meshStandardMaterial color={discovered ? "#8b4513" : "#999999"} />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.35, 0.35, 0.15, 16]} />
              <meshStandardMaterial color={discovered ? "#e4002b" : "#666666"} />
            </mesh>
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
              <meshStandardMaterial color={discovered ? "#f4a460" : "#999999"} />
            </mesh>
          </group>
        );
      
      case 'fries':
        return (
          <group>
            {[...Array(5)].map((_, i) => (
              <mesh key={i} position={[(i - 2) * 0.1, i * 0.05, 0]}>
                <boxGeometry args={[0.08, 0.4, 0.08]} />
                <meshStandardMaterial color={discovered ? "#ffd700" : "#999999"} />
              </mesh>
            ))}
          </group>
        );
      
      case 'wings':
        return (
          <group>
            <mesh position={[-0.15, 0, 0]} rotation={[0, 0, 0.3]}>
              <coneGeometry args={[0.15, 0.4, 8]} />
              <meshStandardMaterial color={discovered ? "#d4a574" : "#999999"} />
            </mesh>
            <mesh position={[0.15, 0, 0]} rotation={[0, 0, -0.3]}>
              <coneGeometry args={[0.15, 0.4, 8]} />
              <meshStandardMaterial color={discovered ? "#d4a574" : "#999999"} />
            </mesh>
          </group>
        );
    }
  };

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {renderGeometry()}
      
      {/* Glow effect when discovered */}
      {discovered && (
        <pointLight intensity={0.5} color="#e4002b" distance={2} />
      )}
    </group>
  );
}