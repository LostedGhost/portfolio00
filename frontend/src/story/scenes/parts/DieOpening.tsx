import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { MathUtils, type Group, type Mesh } from 'three';

/**
 * Ouverture du dé (preloader, ch.01) : les 6 faces (planes) se matérialisent
 * une à une (scale 0.8→1, opacity 0→0.95, 0.15 s chacune), la face supérieure
 * s'allume en menthe en dernier. Une fois `opened`, le parent bascule vers
 * le dé plein opaque (ce composant ne rend plus rien).
 */
const DURATION = 0.15;
const STAGGER = 0.15;
const MINT = new THREE.Color('#57ff9a');
const CLAY = new THREE.Color('#c8ded0');

const FACES: Array<{ pos: [number, number, number]; rot: [number, number, number] }> = [
  { pos: [0.5, 0, 0], rot: [0, Math.PI / 2, 0] },
  { pos: [-0.5, 0, 0], rot: [0, -Math.PI / 2, 0] },
  { pos: [0, 0.5, 0], rot: [-Math.PI / 2, 0, 0] },
  { pos: [0, -0.5, 0], rot: [Math.PI / 2, 0, 0] },
  { pos: [0, 0, 0.5], rot: [0, 0, 0] },
  { pos: [0, 0, -0.5], rot: [0, Math.PI, 0] },
];

export function DieOpening({ opened }: { opened: boolean }) {
  const group = useRef<Group>(null);
  const faceRefs = useRef<Array<Mesh | null>>([]);
  const t = useRef(0);

  const materials = useMemo(
    () =>
      FACES.map(
        () =>
          new THREE.MeshBasicMaterial({
            color: CLAY.clone(),
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
          }),
      ),
    [],
  );

  useFrame((_, delta) => {
    if (opened) return;
    t.current += Math.min(delta, 0.05);
    faceRefs.current.forEach((face, i) => {
      if (!face) return;
      const local = MathUtils.clamp((t.current - i * STAGGER) / DURATION, 0, 1);
      const ease = 1 - Math.pow(1 - local, 3);
      face.scale.setScalar(Math.max(0.001, 0.8 + 0.2 * ease));
      const mat = face.material as THREE.MeshBasicMaterial;
      mat.opacity = ease * 0.95;
      // La 3e face (dessus = « 1 ») s'allume en menthe quand elle est prête.
      if (i === 2 && local >= 1) mat.color.lerp(MINT, 0.12);
    });
  });

  if (opened) return null;

  return (
    <group ref={group}>
      {FACES.map((f, i) => (
        <mesh
          key={i}
          ref={(m) => {
            faceRefs.current[i] = m;
          }}
          position={f.pos}
          rotation={f.rot}
          material={materials[i]}
          scale={0.001}
        >
          <planeGeometry args={[1, 1]} />
        </mesh>
      ))}
    </group>
  );
}
