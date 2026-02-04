'use client';

import { useAppStore } from '@/store/useAppStore';
import { Sun, Moon, Sparkles } from 'lucide-react';

export function ModeToggle() {
  const { mode, isAutoMode, toggleMode, setAutoMode } = useAppStore();

  return (
    <div className="flex flex-col gap-2">
      {/* Auto Mode Toggle */}
      <button
        onClick={() => setAutoMode(!isAutoMode)}
        className={`
          px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all backdrop-blur-sm border
          ${isAutoMode 
            ? 'bg-purple-500/30 border-purple-400/50 text-purple-200' 
            : 'bg-white/10 border-white/20 text-white/50'
          }
          hover:scale-105
        `}
      >
        <Sparkles className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
        Auto {isAutoMode ? 'ON' : 'OFF'}
      </button>

      {/* Manual Mode Toggle */}
      <button
        onClick={toggleMode}
        disabled={isAutoMode}
        className={`
          px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all backdrop-blur-sm border
          ${mode === 'day'
            ? 'bg-orange-500/30 border-orange-400 text-orange-100'
            : 'bg-indigo-500/30 border-indigo-400 text-indigo-100'
          }
          ${isAutoMode ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        `}
      >
        {mode === 'day' ? (
          <>
            <Sun className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Day
          </>
        ) : (
          <>
            <Moon className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Night
          </>
        )}
      </button>
    </div>
  );
}