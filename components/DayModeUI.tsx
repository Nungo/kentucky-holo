'use client';

import { useMenuStore } from '@/store/useMenuStore';
import { Trophy, Zap, Users } from 'lucide-react';

export function DayModeUI() {
  const { items, totalScore, genAlphaScore, genZScore, millennialScore, genXScore, boomerScore } = useMenuStore();
  
  const discoveredCount = items.filter(item => item.discovered).length;
  const totalItems = items.length;
  const progress = (discoveredCount / totalItems) * 100;

  return (
    <>
      {/* Score Display - Top Left */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-10">
        <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/50 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            <h2 className="font-bold text-lg sm:text-xl text-gray-900">
              Menu Explorer
            </h2>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-700">Discovered:</span>
              <span className="font-bold text-base sm:text-lg text-gray-900">
                {discoveredCount}/{totalItems}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs sm:text-sm text-gray-700">Score:</span>
              <span className="font-bold text-xl sm:text-2xl text-red-600">
                {totalScore}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Battle - Top Right */}
      <div className="absolute top-20 sm:top-8 right-4 sm:right-8 z-10">
        <div className="bg-white/40 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/50 shadow-xl">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            <h3 className="font-bold text-xs sm:text-sm text-gray-900">
              Gen Battle
            </h3>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-3">
              <span className="text-xs text-gray-700">Alpha:</span>
              <span className="font-bold text-xs sm:text-sm text-pink-600">{genAlphaScore}</span>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span className="text-xs text-gray-700">Gen Z:</span>
              <span className="font-bold text-xs sm:text-sm text-purple-600">{genZScore}</span>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span className="text-xs text-gray-700">Millennial:</span>
              <span className="font-bold text-xs sm:text-sm text-blue-600">{millennialScore}</span>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span className="text-xs text-gray-700">Gen X:</span>
              <span className="font-bold text-xs sm:text-sm text-green-600">{genXScore}</span>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span className="text-xs text-gray-700">Boomer:</span>
              <span className="font-bold text-xs sm:text-sm text-orange-600">{boomerScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {discoveredCount === 0 && (
        <div className="absolute bottom-20 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 px-4 max-w-xs sm:max-w-none">
          <div className="bg-white/40 backdrop-blur-md rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-white/50 shadow-xl">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 animate-pulse" />
              <p className="text-xs sm:text-sm font-medium text-gray-900">
                Click on items to discover the menu!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {discoveredCount === totalItems && (
        <div className="absolute bottom-20 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 px-4">
          <div className="bg-black/80 backdrop-blur-lg rounded-2xl px-8 sm:px-10 py-4 sm:py-5 border border-red-600/50 shadow-2xl">
            <p className="text-xl sm:text-2xl font-bold text-white text-center tracking-wide">
              Menu Complete
            </p>
            <p className="text-xs sm:text-sm text-gray-300 text-center mt-1">
              {totalScore} points earned
            </p>
          </div>
        </div>
      )}
    </>
  );
}