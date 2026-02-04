'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Cloud } from '@react-three/drei';
import { Suspense } from 'react';
import { FloatingBucket } from './FloatingBucket';
import { LoadingBucket } from './LoadingBucket';
import { DayScene } from './DayScene';
import { NightScene } from './NightScene';
import { DayModeScene } from './DayModeScene';
import { useAppStore } from '@/store/useAppStore';

export function Scene() {
  const mode = useAppStore((state) => state.mode);

  return (
    <div className="w-full h-screen">
      <Canvas 
        gl={{ 
          alpha: true,
          antialias: true 
        }}
      >
        {/* DARK BLUE/GREY BACKGROUND FOR NIGHT (better contrast than pure black) */}
        <color attach="background" args={mode === 'day' ? ['#87ceeb'] : ['#0a0a1e']} />
        
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        <OrbitControls enableZoom={false} enablePan={false} />
        
        {/* Conditional lighting */}
        {mode === 'day' ? <DayScene /> : <NightScene />}
        
        {/* Stars only visible at night */}
        {mode === 'night' && (
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1}
          />
        )}

        {/* Clouds only visible in day */}
        {mode === 'day' && (
          <>
            <Cloud 
              position={[-8, 4, -10]} 
              speed={0.1} 
              opacity={0.6}
              color="#ffffff"
              segments={30}
              bounds={[4, 2, 2]}
            />
            <Cloud 
              position={[8, 5, -12]} 
              speed={0.12} 
              opacity={0.55}
              color="#ffffff"
              segments={30}
              bounds={[5, 2, 2]}
            />
            <Cloud 
              position={[-5, 6, -15]} 
              speed={0.15} 
              opacity={0.58}
              color="#ffffff"
              segments={30}
              bounds={[4.5, 2, 2]}
            />
            <Cloud 
              position={[10, 3, -8]} 
              speed={0.08} 
              opacity={0.62}
              color="#ffffff"
              segments={30}
              bounds={[5, 2.5, 2]}
            />
          </>
        )}
        
        {/* 3D Objects */}
        <Suspense fallback={<LoadingBucket />}>
          {mode === 'day' ? (
            <DayModeScene />
          ) : (
            <FloatingBucket />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}