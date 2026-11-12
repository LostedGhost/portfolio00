import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { MathUtils, type Group, type InstancedMesh } from 'three';
import { scrollState } from '../../scroll/System';

/**
 * MIGRATION CUBIQUE ch.03→ch.04 : un InstancedMesh de N cubes (N = outils
 * de data.ts plafonné à 8) qui :
 *  - ch.03 (fragmentation) : éclate depuis un point en spirale éparse ;
 *  - ch.04 (rangement) : convergent en grille, flare menthe à l'atterrissage,
 *    puis échelle 1 = ils « deviennent » la grille tech.
 *
 * Toutes les trajectoires sont des fonctions pures de la progression ch.03
 * et ch.04 (lissées) : aucune allocation par frame (matrices réutilisées).
 */
const MAX_TOOL_CUBES = 8;

export function ToolCubes({ position }: { position: [number, number, number] }) {
  const mesh = useRef<InstancedMesh>(null);
  const group = useRef<Group>(null);
  // Progress lissés des deux chapitres concernés.
  const p = useRef({ practice: 0, tools: 0 });

  const count = MAX_TOOL_CUBES;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  // Trajectoires stables : direction + rotation propres à chaque cube.
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        // direction d'éclatement (sphèreordonnée déterministe)
        dir: new THREE.Vector3(
          Math.cos(i * 2.399) * (0.6 + (i % 3) * 0.35),
          Math.sin(i * 1.7) * 0.9,
          Math.sin(i * 2.399) * (0.5 + (i % 2) * 0.4),
        ).normalize(),
        spin: 0.5 + ((i * 37) % 100) / 100,
        // position de grille (2 rangées x 4, MOINS espacé que l'éclatement)
        grid: new THREE.Vector3(((i % 4) - 1.5) * 1.05, ((i < 4 ? 1 : -1)) * 0.55, (i % 3) * 0.05),
      })),
    [count],
  );
  const color = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    if (!mesh.current || !group.current) return;
    const d = Math.min(delta, 0.05);
    p.current.practice = MathUtils.damp(p.current.practice, scrollState.chapters.get('experience') ?? 0, 4, d);
    p.current.tools = MathUtils.damp(p.current.tools, scrollState.chapters.get('technologies') ?? 0, 4, d);

    // Visibilité : absent avant ch.03, disparu après ch.04 (les dés logo prennent le relais).
    const visible = p.current.practice > 0.01 && p.current.tools < 0.995;
    group.current.visible = visible;
    if (!visible) return;

    // Phase 1 : éclatement (0→0.6 de ch.03). Phase 2 : migration/rangement ch.04.
    const burst = Math.min(1, p.current.practice / 0.6);
    const settle = MathUtils.smoothstep(p.current.tools, 0.1, 0.75);

    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      // Position = mélange éclat diffus → grille ordonnée.
      const burstPos = s.dir.clone().multiplyScalar(burst * 3.2);
      const x = THREE.MathUtils.lerp(burstPos.x, s.grid.x, settle);
      const y = THREE.MathUtils.lerp(burstPos.y, s.grid.y, settle);
      const z = THREE.MathUtils.lerp(burstPos.z, s.grid.z, settle);
      dummy.position.set(x, y, z);
      dummy.rotation.set(s.spin * p.current.tools * 4, s.spin * burst * 3, 0);
      // Échelle : croît à l'éclatement puis décroît légèrement rangé.
      const scale = 0.18 * (0.6 + 0.4 * burst) * (1 - 0.25 * settle);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
      // Flare menthe à l'atterrissage (settle 0.9→1 : couleur mixte).
      const flare = MathUtils.smoothstep(settle, 0.85, 1);
      color.setRGB(0.78 + 0.2 * flare * 0, 0.87 - 0.36 * flare, 0.81 - 0.2 * flare);
      mesh.current.setColorAt(i, color);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  });

  return (
    <group ref={group} position={position} visible={false}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial />
      </instancedMesh>
    </group>
  );
}
