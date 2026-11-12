import { Canvas, useFrame } from '@react-three/fiber';
import { Float, useTexture } from '@react-three/drei';
import { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import type { Mesh } from 'three';
import type { Technology } from '../../../lib/types';

/**
 * Les instruments : dés-cubes céramiques tournant doucement, logo gravé
 * sur chaque face. Palette biblique : matériau clair, lueur menthe au survol.
 */
function TechDie({ technology, position }: { technology: Technology; position: [number, number, number] }) {
  const mesh = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(technology.logo);

  const speed = useRef(0.25 + Math.random() * 0.3).current;
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * speed;
    mesh.current.rotation.x += delta * speed * 0.35;
    const target = hovered ? 1.25 : 1;
    const next = mesh.current.scale.x + (target - mesh.current.scale.x) * 0.15;
    mesh.current.scale.setScalar(next);
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        <mesh
          ref={mesh}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[1.05, 1.05, 1.05]} />
          <meshToonMaterial map={texture} color={hovered ? '#dff7e9' : '#c8ded0'} emissive="#57ff9a" emissiveIntensity={hovered ? 0.35 : 0.04} />
        </mesh>
        {hovered && (
          <Html center distanceFactor={10} className="pointer-events-none">
            <span className="font-mono text-xs whitespace-nowrap px-3 py-1 rounded-full bg-black/70 text-(--color-accent) border border-(--color-border)">
              {technology.name}
            </span>
          </Html>
        )}
      </group>
    </Float>
  );
}

const COLS = 6;
const GAP = 2.0;

export function TechScene({ technologies }: { technologies: Technology[] }) {
  const rows = Math.ceil(technologies.length / COLS);
  const offX = ((Math.min(technologies.length, COLS) - 1) * GAP) / 2;
  const offY = ((rows - 1) * GAP) / 2;

  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 11], fov: 45 }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 6]} intensity={1.1} />
      <pointLight position={[-6, -3, 2]} intensity={0.55} color="#57ff9a" />
      {technologies.map((tech, i) => (
        <TechDie key={tech.id} technology={tech} position={[ (i % COLS) * GAP - offX, offY - Math.floor(i / COLS) * GAP, 0 ]} />
      ))}
    </Canvas>
  );
}

/** Fallback 2D (mobile léger / WebGL indisponible) : chips sobres. */
export function TechSceneFallback({ technologies }: { technologies: Technology[] }) {
  return (
    <div className="flex flex-wrap gap-3 content-start">
      {technologies.map((tech) => (
        <span
          key={tech.id}
          className="flex items-center gap-2 rounded-full border border-(--color-border) pl-2 pr-4 py-1.5 bg-white/[0.03]"
        >
          <img src={tech.logo} alt="" loading="lazy" decoding="async" className="h-6 w-6 rounded-full object-cover" />
          <span className="font-mono text-xs text-(--color-text-dim)">{tech.name}</span>
        </span>
      ))}
    </div>
  );
}
