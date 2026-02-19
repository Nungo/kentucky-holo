'use client';

import { FloatingParticles, SparkleParticles, LightBeams, FloatingTextElements, OrbitingIngredients } from './HologramEffects';
import { HologramCharacter } from './HologramCharacter';
import { useStoryStore } from '@/store/useStoryStore';

export function NightScene() {
  const currentStory = useStoryStore((state) => state.currentStory);
  const isStoryActive = !!currentStory;

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#6366f1" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ec4899" />

      {/* LARGE Hologram Character (shows during story) */}
      {isStoryActive && <HologramCharacter />}

      {/* Other effects (show when no story) */}
      {!isStoryActive && (
        <>
          <FloatingParticles />
          <SparkleParticles />
          <LightBeams />
          <FloatingTextElements isStoryActive={false} />
          <OrbitingIngredients />
        </>
      )}
    </>
  );
}