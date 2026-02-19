'use client';

import { Scene } from '@/components/3d/Scene';
import { ModeToggle } from '@/components/ModeToggle';
import { DayModeUI } from '@/components/DayModeUI';
import { GenerationSelector } from '@/components/GenerationSelector';
import { NightModeUI } from '@/components/NightModeUI';
import { useModeDetection } from '@/hooks/useModeDetection';
import { useAppStore } from '@/store/useAppStore';
import { useMenuStore } from '@/store/useMenuStore';
import { useState } from 'react';

export default function Home() {
  const [show3D, setShow3D] = useState(false);
  const mode = useAppStore((state) => state.mode);
  const { userGeneration, setUserGeneration } = useMenuStore();
  
  // Activate mode detection
  useModeDetection();

  const handleGenerationSelect = (gen: 'genalpha' | 'genz' | 'millennial' | 'genx' | 'boomer') => {
    setUserGeneration(gen);
  };

  if (!show3D) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black p-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-7xl font-bold text-white mb-4 tracking-tight">
            Kentucky Holo
          </h1>
          <p className="text-xl text-gray-400 mb-12 font-light">
            Digital Holographic Experience
          </p>
          
          <button
            onClick={() => setShow3D(true)}
            className="bg-[#e4002b] text-white font-bold text-lg px-12 py-4 rounded-lg hover:bg-[#c4001b] transition-all hover:scale-105 shadow-lg shadow-red-900/50"
          >
            Enter Experience
          </button>

          <div className="mt-16 text-gray-500 text-sm">
            <p>Powered by KFC South Africa</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main 
      className={`relative w-full h-screen transition-colors duration-1000 ${
        mode === 'day' ? 'bg-sky-400' : 'bg-slate-900'
      }`}
    >
      {/* Generation Selector Popup */}
      {!userGeneration && (
        <GenerationSelector onSelect={handleGenerationSelect} />
      )}

      {/* 3D Scene */}
      <Scene />
      
      {/* Day Mode Interactive UI */}
      {mode === 'day' && <DayModeUI />}
      
      {/* Night Mode UI */}
      {mode === 'night' && <NightModeUI />}
      
      {/* Exit Button */}
      <button
        onClick={() => setShow3D(false)}
        className={`
          absolute top-4 sm:top-8 right-4 sm:right-8 z-50 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-3 rounded-lg border transition-all font-medium
          ${mode === 'day'
            ? 'bg-white/40 border-white/50 text-gray-900 hover:bg-white/60'
            : 'bg-black/60 border-white/10 text-white hover:bg-black/80'
          }
        `}
      >
        Exit
      </button>

      {/* Mode Toggle Controls */}
      <div className="absolute bottom-4 left-4 z-40">
        <ModeToggle />
      </div>
    </main>
  );
}