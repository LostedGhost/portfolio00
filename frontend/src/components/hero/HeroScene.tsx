import { Float, MeshDistortMaterial, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';
import { SRGBColorSpace } from 'three';
import { Particles } from '../three/Particles';
import { Scene } from '../three/Scene';

interface CoreProps {
  textureUrl?: string | null;
}

function Core({ textureUrl }: CoreProps) {
  const mesh = useRef<Mesh>(null);
  const texture = useTexture(textureUrl || '/icon-192.png');
  texture.colorSpace = SRGBColorSpace;

  useFrame((state) => {
    if (!mesh.current) return;
    const { pointer } = state;
    mesh.current.rotation.y += 0.003;
    mesh.current.rotation.x += (pointer.y * 0.4 - mesh.current.rotation.x) * 0.05;
    mesh.current.rotation.z += (pointer.x * 0.2 - mesh.current.rotation.z) * 0.05;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={mesh} position={[2.6, 0.6, -1.5]}>
        <icosahedronGeometry args={[1.7, 6]} />
        <MeshDistortMaterial
          map={textureUrl ? texture : undefined}
          color={textureUrl ? '#ffffff' : '#0a1030'}
          emissive="#00aaff"
          emissiveIntensity={textureUrl ? 0.06 : 0.18}
          distort={0.22}
          speed={1.8}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

interface HeroSceneProps {
  active: boolean;
  textureUrl?: string | null;
}

export function HeroScene({ active, textureUrl }: HeroSceneProps) {
  return (
    <Scene active={active} cameraPosition={[0, 0, 9]} className="!absolute inset-0">
      <Particles count={1400} />
      <Core textureUrl={textureUrl} />
    </Scene>
  );
}
