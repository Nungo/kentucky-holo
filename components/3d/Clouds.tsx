'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

function Cloud({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Slow horizontal drift
      groupRef.current.position.x += 0.002;
      
      // Reset position when too far
      if (groupRef.current.position.x > 15) {
        groupRef.current.position.x = -15;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Create cloud from multiple spheres */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8 * scale, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.7} roughness={1} />
      </mesh>
      <mesh position={[0.6 * scale, 0.1, 0]}>
        <sphereGeometry args={[0.6 * scale, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.65} roughness={1} />
      </mesh>
      <mesh position={[-0.6 * scale, 0, 0]}>
        <sphereGeometry args={[0.7 * scale, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.68} roughness={1} />
      </mesh>
      <mesh position={[0.3 * scale, -0.2, 0]}>
        <sphereGeometry args={[0.5 * scale, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.6} roughness={1} />
      </mesh>
      <mesh position={[-0.3 * scale, -0.15, 0]}>
        <sphereGeometry args={[0.55 * scale, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.62} roughness={1} />
      </mesh>
    </group>
  );
}

export function Clouds() {
  return (
    <>
      <Cloud position={[-10, 4, -12]} scale={1.2} />
      <Cloud position={[8, 5, -15]} scale={1} />
      <Cloud position={[-6, 3, -10]} scale={0.9} />
      <Cloud position={[12, 6, -18]} scale={1.1} />
      <Cloud position={[3, 4.5, -14]} scale={0.8} />
    </>
  );
}