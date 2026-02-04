'use client';

import { MenuItem3D } from './MenuItem3D';
import { useMenuStore } from '@/store/useMenuStore';
import { FloatingBucket } from './FloatingBucket';

export function DayModeScene() {
  const { items, discoverItem } = useMenuStore();

  // Arrange items in a circle around the center
  const itemPositions: Record<string, [number, number, number]> = {
    bucket: [0, 0, 0], // Center
    chicken: [-2, 0.5, 1],
    burger: [2, 0.5, 1],
    fries: [-2, -0.5, -1],
    wings: [2, -0.5, -1],
  };

  return (
    <>
      {items.map((item) => {
        if (item.id === 'bucket') {
          // Use our main bucket component for the center - now clickable!
          return (
            <FloatingBucket 
              key={item.id} 
              onClick={() => discoverItem(item.id)}
              discovered={item.discovered}
            />
          );
        }
        
        return (
          <MenuItem3D
            key={item.id}
            position={itemPositions[item.id] || [0, 0, 0]}
            type={item.id as any}
            onClick={() => discoverItem(item.id)}
            discovered={item.discovered}
          />
        );
      })}
    </>
  );
}