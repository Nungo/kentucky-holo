'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function useModeDetection() {
  const { isAutoMode, setMode } = useAppStore();

  useEffect(() => {
    if (!isAutoMode) return;

    // Function to detect mode based on time
    const detectMode = () => {
      const hour = new Date().getHours();
      
      // Night mode: 8 PM (20:00) to 6 AM (6:00)
      // Day mode: 6 AM (6:00) to 8 PM (20:00)
      const isNightTime = hour >= 20 || hour < 6;
      
      setMode(isNightTime ? 'night' : 'day');
    };

    // Detect immediately
    detectMode();

    // Check every minute
    const interval = setInterval(detectMode, 60000);

    // Try to detect ambient light (experimental)
    if ('AmbientLightSensor' in window) {
      try {
        // @ts-ignore - Experimental API
        const sensor = new AmbientLightSensor();
        sensor.addEventListener('reading', () => {
          // @ts-ignore
          const lux = sensor.illuminance;
          
          // If very dark (< 10 lux), switch to night mode
          if (lux < 10) {
            setMode('night');
          } else if (lux > 50) {
            setMode('day');
          }
        });
        sensor.start();
        
        return () => {
          sensor.stop();
          clearInterval(interval);
        };
      } catch (error) {
        console.log('Ambient light sensor not available');
      }
    }

    return () => clearInterval(interval);
  }, [isAutoMode, setMode]);
}