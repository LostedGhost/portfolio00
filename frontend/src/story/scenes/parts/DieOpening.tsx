import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { MathUtils, type Group, type Mesh } from 'three';

/**
 * Ouverture du dé (ch.01) : les 6 faces se matérialisent une à une
 * (scale 0.8→1, opacity, 0.15 s chacune, STAGGER 0.15) — la face supérieure
 * s'allume en menthe en dernier. Expose le nombre de faces déjà posées
 * via un compteur module (lu par le DOM pour synchroniser le nom : chaque
 * face qui apparaît libère 2-3 lettres).
 *
 * Chronométrage : 0 s → 0.9 s (6 faces × stagger 0.15). `opened` bascule
 * vers le dé plein (avec ouverture physique de l'abandon).
 */
const DURATION = 0.15;
const STAGGER = 0.15;
const TOTAL = 6 * STAGGER; // 0.9s
const MINT = new THREE.Color('#57ff9a');
const CLAY = new THREE.Color('#c8ded0');

/** Compteur partagé : faces posées 0..6 (l'introduction du nom s'y calque). */
export const dieFacesState = { placed: 0 };

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
    let placed = 0;
    faceRefs.current.forEach((face, i) => {
      if (!face) return;
      const local = MathUtils.clamp((t.current - i * STAGGER) / DURATION, 0, 1);
      const ease = 1 - Math.pow(1 - local, 3);
      face.scale.setScalar(Math.max(0.001, 0.8 + 0.2 * ease));
      const mat = face.material as THREE.MeshBasicMaterial;
      mat.opacity = ease * 0.95;
      if (local >= 1) placed++;
      // La 3e face (dessus = « 1 ») s'allume en menthe quand elle est prête.
      if (i === 2 && local >= 1) mat.color.lerp(MINT, 0.12);
    });
    dieFacesState.placed = placed;
  });

  if (opened) {
    dieFacesState.placed = 6;
    return null;
  }

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

/**
 * Chute + rebond du dé au PREMIER scroll (ch.01, ~300 premiers px) :
 * bounce physique simple piloté par scrollY ; partagé à la scène.
 */
const dropState = { done: false, y: 0 };

export function computeDropOffset(scrollY: number): number {
  // 0 → 300px de scroll : la chute de 1.2 unité monte (le dé « tombe » visuellement
  // vers sa position d'attente). Rebond amorti (courbe abs(sin) décroissante).
  if (scrollY >= 320) return 0;
  const t = MathUtils.clamp(scrollY / 320, 0, 1);
  // chute : y va de 0 à -0.9 en ease-in, puis rebond représenté en inverse du sin dampé
  const fall = -0.9 * t * t;
  const bounce = Math.abs(Math.sin(t * Math.PI * 1.5)) * (1 - t) * 0.35;
  return fall + bounce * 0.35;
}

export { dropState, TOTAL };
