import { Html, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import type { Mesh } from 'three';
import type { Technology } from '../../lib/types';

interface TechDieProps {
  technology: Technology;
  position: [number, number, number];
}

export function TechDie({ technology, position }: TechDieProps) {
  const mesh = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(technology.logo);
  const speed = useRef(0.3 + Math.random() * 0.4).current;

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * speed;
    mesh.current.rotation.x += delta * speed * 0.4;
    const targetScale = hovered ? 1.35 : 1;
    const nextScale = mesh.current.scale.x + (targetScale - mesh.current.scale.x) * 0.15;
    mesh.current.scale.setScalar(nextScale);
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={texture} roughness={0.3} metalness={0.1} />
      </mesh>
      {hovered && (
        <Html center distanceFactor={10} className="pointer-events-none">
          <span className="glass rounded-full px-3 py-1 text-xs whitespace-nowrap text-white">
            {technology.name}
          </span>
        </Html>
      )}
    </group>
  );
}
