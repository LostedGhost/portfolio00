import { Points, PointMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Points as ThreePoints } from 'three';

interface ParticlesProps {
  count?: number;
}

export function Particles({ count = 1800 }: ParticlesProps) {
  const ref = useRef<ThreePoints>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const accent = [0, 170 / 255, 1];
    const violet = [123 / 255, 47 / 255, 1];

    for (let i = 0; i < count; i++) {
      const radius = 6 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const t = Math.random();
      col[i * 3] = accent[0] + (violet[0] - accent[0]) * t;
      col[i * 3 + 1] = accent[1] + (violet[1] - accent[1]) * t;
      col[i * 3 + 2] = accent[2] + (violet[2] - accent[2]) * t;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.02;
    ref.current.rotation.x += delta * 0.005;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}
