'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';

interface GenerationSelectorProps {
  onSelect: (generation: 'genalpha' | 'genz' | 'millennial' | 'genx' | 'boomer') => void;
}

export function GenerationSelector({ onSelect }: GenerationSelectorProps) {
  const [selected, setSelected] = useState<'genalpha' | 'genz' | 'millennial' | 'genx' | 'boomer' | null>(null);

  const handleSelect = (gen: 'genalpha' | 'genz' | 'millennial' | 'genx' | 'boomer') => {
    setSelected(gen);
    setTimeout(() => {
      onSelect(gen);
    }, 300);
  };

  const generations = [
    { id: 'genalpha', label: 'Gen Alpha', years: 'Born 2013+' },
    { id: 'genz', label: 'Gen Z', years: 'Born 1997-2012' },
    { id: 'millennial', label: 'Millennial', years: 'Born 1981-1996' },
    { id: 'genx', label: 'Gen X', years: 'Born 1965-1980' },
    { id: 'boomer', label: 'Boomer', years: 'Born 1946-1964' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-black rounded-2xl p-6 sm:p-10 max-w-3xl w-full mx-4 border-2 border-[#e4002b] shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Users className="w-12 h-12 text-[#e4002b] mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Choose Your Generation
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Join the battle and discover the menu!
          </p>
        </div>

        {/* Generation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {generations.map((gen) => (
            <button
              key={gen.id}
              onClick={() => handleSelect(gen.id as any)}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-300
                ${selected === gen.id
                  ? 'bg-[#e4002b] border-[#e4002b] scale-105 shadow-lg shadow-red-900/50'
                  : 'bg-black/50 border-[#e4002b]/50 hover:border-[#e4002b] hover:bg-[#e4002b]/10'
                }
              `}
            >
              <h3 className={`text-xl sm:text-2xl font-bold mb-1 ${
                selected === gen.id ? 'text-white' : 'text-white'
              }`}>
                {gen.label}
              </h3>
              <p className={`text-sm ${
                selected === gen.id ? 'text-white/90' : 'text-gray-400'
              }`}>
                {gen.years}
              </p>
              
              {/* Selected indicator */}
              {selected === gen.id && (
                <div className="absolute top-3 right-3 w-3 h-3 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your generation will earn points as you discover menu items
          </p>
        </div>
      </div>
    </div>
  );
}