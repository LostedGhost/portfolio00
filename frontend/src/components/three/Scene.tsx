import { Canvas } from '@react-three/fiber';
import type { ReactNode } from 'react';
import type { Vector3 } from 'three';

interface SceneProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  active?: boolean;
  className?: string;
}

export function Scene({ children, cameraPosition = [0, 0, 8], fov = 50, active = true, className }: SceneProps) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: cameraPosition as unknown as Vector3, fov }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#00aaff" />
      <pointLight position={[-10, -8, -10]} intensity={1} color="#7b2fff" />
      {children}
    </Canvas>
  );
}
