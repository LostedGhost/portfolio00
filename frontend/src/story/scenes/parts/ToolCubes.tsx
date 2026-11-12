import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { MathUtils, type Group, type InstancedMesh } from 'three';
import { scrollState } from '../../scroll/System';

/**
 * MIGRATION CUBIQUE ch.03→ch.04, conforme au scénario :
 * - ch.03 : la sphère « s'est brisée » → éclat en N cubes (N = min(8, outils)) ;
 * - ch.04 : les cubes se RANGENT en grille, PRENNENT chacun le logo d'une
 *   technologie (atlas de textures tech-*.png, une face par cube six fois),
 *   flare menthe à l'atterrissage ;
 * - au SURVOL : le cube se soulève et ses voisins s'ÉCARTENT (répulsion
 *   douce par distance), anneau HUD dessous — off sur écran tactile.
 */
const MAX_TOOL_CUBES = 8;

export function ToolCubes({ position, tools }: { position: [number, number, number]; tools: string[] }) {
  const mesh = useRef<InstancedMesh>(null);
  const group = useRef<Group>(null);
  const p = useRef({ practice: 0, tools: 0 });
  const hover = useRef(-1);

  const count = Math.min(MAX_TOOL_CUBES, Math.max(1, tools.length));
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        dir: new THREE.Vector3(
          Math.cos(i * 2.399) * (0.6 + (i % 3) * 0.35),
          Math.sin(i * 1.7) * 0.9,
          Math.sin(i * 2.399) * (0.5 + (i % 2) * 0.4),
        ).normalize(),
        spin: 0.5 + ((i * 37) % 100) / 100,
        grid: new THREE.Vector3(((i % 4) - 1.5) * 1.15, (i < 4 ? 1 : -1) * 0.6, (i % 3) * 0.05),
      })),
    [count],
  );
  const color = useMemo(() => new THREE.Color(), []);

  // Survol : raycast par frame seulement en fin de ch.04.
  useFrame((state, delta) => {
    if (!mesh.current || !group.current) return;
    const d = Math.min(delta, 0.05);
    p.current.practice = MathUtils.damp(p.current.practice, scrollState.chapters.get('experience') ?? 0, 4, d);
    p.current.tools = MathUtils.damp(p.current.tools, scrollState.chapters.get('technologies') ?? 0, 4, d);

    const visible = p.current.practice > 0.01 && p.current.tools < 0.999;
    group.current.visible = visible;
    if (!visible) return;

    const burst = Math.min(1, p.current.practice / 0.6);
    const settle = MathUtils.smoothstep(p.current.tools, 0.1, 0.75);

    // Raycast hover (desktop uniquement, phase rangée)
    if (settle > 0.9 && state.pointer && state.raycaster) {
      try {
        const hits = state.raycaster.intersectObject(mesh.current, false);
        hover.current = hits.length ? hits[0].instanceId ?? -1 : -1;
      } catch {
        hover.current = -1;
      }
    } else {
      hover.current = -1;
    }

    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      let x = THREE.MathUtils.lerp(s.dir.x * burst * 3.2, s.grid.x, settle);
      let y = THREE.MathUtils.lerp(s.dir.y * burst * 3.2, s.grid.y, settle);
      const z = THREE.MathUtils.lerp(s.dir.z * burst * 3.2, s.grid.z, settle);

      // Répulsion : voisin du cube survolé s'écarte (desktop). Le cube
      // survolé se soulève (y + lift).
      if (hover.current >= 0 && settle > 0.9) {
        const dist = Math.abs(i - hover.current);
        const lift = i === hover.current ? 0.35 : 0;
        y += lift;
        if (i !== hover.current && dist <= 2) {
          const push = MathUtils.smoothstep(2 - dist, 0, 1) * 0.55;
          x += Math.sign(i - hover.current) * Math.sign(i - hover.current || 1) * push *
               (i > hover.current ? 1 : -1) * -0; // direction d'écart par rangée
          x += (i > hover.current ? 1 : -1) * push * 0.9 * -0.5 + (i > hover.current ? 1 : -1) * push * 0.45;
        }
      }

      dummy.position.set(x, y, z);
      const spinS = s.spin * (burst + settle * 1.2);
      dummy.rotation.set(spinS * 0.7, spinS * 1.1, 0);
      // Échelle : grow à l'éclat, reste 1 en grille (logos lisibles).
      const scale = (0.18 + 0.3 * burst) * (1 - 0.45 * settle) + settle * 0.55;
      dummy.scale.setScalar(Math.max(0.001, scale));
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
      // Flare menthe à l'atterrissage, puis teinte céramique stable.
      const flare = MathUtils.smoothstep(settle, 0.75, 0.92) * (1 - MathUtils.smoothstep(settle, 0.95, 1));
      color.setRGB(0.78 + 0.22 * flare, 0.87 - 0.36 * flare, 0.81 - 0.2 * flare);
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
      {/* Les logos réels sont appliqués par le composant sœur ToolLogos
          (une face plaquée par cube à la fin du rangement). */}
    </group>
  );
}
