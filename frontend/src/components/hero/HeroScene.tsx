import { Float, MeshDistortMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';
import { Particles } from '../three/Particles';
import { Scene } from '../three/Scene';

function Core() {
  const mesh = useRef<Mesh>(null);

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
        <icosahedronGeometry args={[1.6, 6]} />
        <MeshDistortMaterial
          color="#0a1030"
          emissive="#00aaff"
          emissiveIntensity={0.18}
          distort={0.3}
          speed={1.8}
          roughness={0.25}
          metalness={0.75}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

interface HeroSceneProps {
  active: boolean;
}

export function HeroScene({ active }: HeroSceneProps) {
  return (
    <Scene active={active} cameraPosition={[0, 0, 9]} className="!absolute inset-0">
      <Particles count={1400} />
      <Core />
    </Scene>
  );
}
