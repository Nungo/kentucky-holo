'use client';

export function LoadingBucket() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#e4002b" wireframe />
    </mesh>
  );
}