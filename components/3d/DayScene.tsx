'use client';

export function DayScene() {
  return (
    <>
      {/* Bright sun-like lighting */}
      <ambientLight intensity={1} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={2} 
        color="#fffacd" 
      />
      <pointLight 
        position={[5, 5, 5]} 
        intensity={1} 
        color="#87ceeb" 
      />
      
      {/* Blue sky atmosphere via fog */}
      <fog attach="fog" args={['#87ceeb', 15, 25]} />
    </>
  );
}