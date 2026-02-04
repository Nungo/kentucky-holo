'use client';

import { FloatingParticles, SparkleParticles, LightBeams, FloatingTextElements, OrbitingIngredients } from './HologramEffects';
import { useStoryStore } from '@/store/useStoryStore';

export function NightScene() {
  const currentStory = useStoryStore((state) => state.currentStory);
  const isStoryActive = !!currentStory;

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#6366f1" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ec4899" />

      {/* Hologram Effects */}
      <FloatingParticles />
      <SparkleParticles />
      <LightBeams />
      <FloatingTextElements isStoryActive={isStoryActive} />
      <OrbitingIngredients />
    </>
  );
}