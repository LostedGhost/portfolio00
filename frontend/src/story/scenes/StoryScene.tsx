import { Float, PerformanceMonitor } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { DoubleSide, MathUtils, type Group, type Mesh } from 'three';
import { scrollState } from '../scroll/System';
import { CeramicOrb } from './parts/CeramicOrb';
import { ToolCubes } from './parts/ToolCubes';
import { DieOpening } from './parts/DieOpening';

interface StorySceneProps {
  active: boolean;
  className?: string;
  /** ouvert = preloader terminé, le dé plein prend le relais. */
  opened?: boolean;
}

/**
 * SCÈNE CONTINUE (socle GSAP + ScrollTrigger) :
 * - progress global et vitesse lus depuis scrollState (module) — continu,
 *   aucun arrondi ; lissage par MathUtils.damp côté useFrame.
 * - Fenêtres des satellites dérivées du nombre réel de chapitres : chaque
 *   chapitre possèdee sa bande de traversal bas→haut.
 * - Le dé tourne sans cesse, réagit à la vitesse de scroll (le « vent »)
 *   et incline sa face lumineuse vers le pointeur (inertie spring).
 * - PerformanceMonitor adapte le dpr ; dégrade sur machine lente.
 */
interface StorySceneProps {
  active: boolean;
  className?: string;
  /** ouvert = preloader terminé : le dé plein prend le relais de DieOpening. */
  opened?: boolean;
}

const MINT = '#57ff9a';
const CLAY = '#c8ded0';
const CYAN = '#4fc3f7';

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function windowState(from: number, to: number, progress: number) {
  const local = clamp01((progress - from) / Math.max(0.0001, to - from));
  const fade = clamp01(Math.min(local, 1 - local) * 4);
  return { y: -6 + local * 12, fade, local };
}

/** Le dé protagoniste : rotation continue + accélération selon le vent du scroll. */
function Die() {
  const mesh = useRef<Mesh>(null);
  const spring = useRef({ x: 0, z: 0, vx: 0, vz: 0 });

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const d = Math.min(delta, 0.05);
    // Le scroll est le vent : plus il est rapide, plus le dé tourne vite.
    const boost = Math.min(3, Math.abs(scrollState.velocity) / 900);
    mesh.current.rotation.y += d * (0.15 + boost * 0.55);

    // Face lumineuse : suit le pointeur avec inertie (spring amorti).
    const s = spring.current;
    const k = 6;
    s.vx += (state.pointer.y * 0.4 - s.x) * k * d;
    s.vx *= Math.max(0, 1 - 4.2 * d);
    s.x += s.vx * d * 8;
    s.vz += (state.pointer.x * 0.25 - s.z) * k * d;
    s.vz *= Math.max(0, 1 - 4.2 * d);
    s.z += s.vz * d * 8;
    mesh.current.rotation.x = s.x;
    mesh.current.rotation.z = s.z;
  });

  return (
    <mesh>
      <boxGeometry args={[1.9, 1.9, 1.9]} />
      <meshToonMaterial color={CLAY} emissive={MINT} emissiveIntensity={0.1} />
    </mesh>
  );
}

interface SatelliteProps {
  from: number;
  to: number;
  x: number;
  z: number;
  kind: 'orb' | 'ring' | 'donut';
  scale?: number;
  color?: string;
}

/** Satellite : traverse son bande de progress global, fade en entrée/sortie. */
function Satellite({ from, to, x, z, kind, scale = 1, color = CLAY }: SatelliteProps) {
  const ref = useRef<Mesh>(null);
  const smoothed = useRef(0);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    smoothed.current = MathUtils.damp(smoothed.current, scrollState.global, 4, Math.min(delta, 0.05));
    const { y, fade } = windowState(from, to, smoothed.current);
    ref.current.position.y = y;
    ref.current.position.x = x + Math.sin(clock.elapsedTime * 0.5 + x * 10) * 0.25;
    ref.current.rotation.y = clock.elapsedTime * (kind === 'donut' ? 0.45 : 0.2);
    ref.current.rotation.x = kind === 'donut' ? clock.elapsedTime * 0.3 : 0.7;
    if (kind === 'ring') ref.current.rotation.z += 0.003;
    ref.current.scale.setScalar(Math.max(0.0001, scale * fade));
    ref.current.visible = fade > 0.02;
  });

  return (
    <mesh
      ref={ref}
      position={[x, -6, z]}
      rotation={kind === 'ring' ? [Math.PI / 2.3, 0, 0.2] : [0.7, 0.3, 0]}
      scale={0.0001}
    >
      {kind === 'orb' && <icosahedronGeometry args={[0.9, 3]} />}
      {kind === 'ring' && <torusGeometry args={[1.2, 0.03, 12, 100]} />}
      {kind === 'donut' && <torusGeometry args={[0.6, 0.26, 16, 60]} />}
      {kind === 'ring' ? (
        <meshBasicMaterial color={MINT} transparent opacity={0.55} side={DoubleSide} />
      ) : (
        <meshToonMaterial color={color} />
      )}
    </mesh>
  );
}

/**
 * Les satellites : un par chapitre, fenêtres calculées sur le compte réel
 * des ancres (ScrollTrigger via scrollState.chapters, recalculé à refresh).
 */
function StorySatellites({ quality }: { quality: 'high' | 'low' }) {
  const windows = deriveWindows();
  // Recette visuelle par chapitre (dans l'ordre hero→contact) ; modulo sûr.
  const recipes: Array<Omit<SatelliteProps, 'from' | 'to'>> = [
    { x: -3.8, z: -2.5, kind: 'orb', scale: 1 },                 // ch.02 : le chemin (sphère)
    { x: -3.2, z: -2, kind: 'ring', scale: 1 },                  // ch.02++ : anneaux
    { x: -4.5, z: -3, kind: 'orb', scale: 0.7 },                 // ch.03 : la pratique
    { x: 3.9, z: -2, kind: 'ring', scale: 0.85 },                // ch.04 : instruments
    { x: 4.4, z: -2.4, kind: 'donut', scale: quality === 'high' ? 0.9 : 0.001, color: CYAN }, // ch.05
    { x: -3.9, z: -2, kind: 'donut', scale: 1, color: CYAN },    // interlude preuves
    { x: 3.6, z: -2, kind: 'orb', scale: 0.8, color: MINT },     // ch.06 : continuité
  ];

  return (
    <>
      {windows.map((w, i) => {
        const recipe = recipes[i % recipes.length];
        return (
          <Satellite
            key={w.id}
            from={w.from}
            to={w.to}
            x={recipe.x}
            z={recipe.z}
            kind={recipe.kind}
            scale={recipe.scale}
            color={recipe.color}
          />
        );
      })}
    </>
  );
}

/** Dérive les fenêtres des satellites : chaque chapitre occupe sa part du
 *  déroulé réel (l'ordre DOM, harmonisé par les progress mesurés). */
function deriveWindows(): Array<{ id: string; from: number; to: number }> {
  const ids = ['hero', 'about', 'experience', 'technologies', 'projects', 'contact'];
  return ids.map((id, i) => ({ id, from: i / ids.length, to: (i + 1) / ids.length }));
}

function Stage({ quality, opened }: { quality: 'high' | 'low'; opened: boolean }) {
  const group = useRef<Group>(null);
  const smooth = useRef(0);

  useFrame((_, delta) => {
    if (!group.current) return;
    smooth.current = MathUtils.damp(smooth.current, scrollState.global, 4, Math.min(delta, 0.05));
    group.current.position.y = (smooth.current - 0.5) * -0.9;
  });

  return (
    <group ref={group}>
      <group position={[2.4, 0.3, 0]}>
        {!opened ? (
          <DieOpening opened={opened} />
        ) : (
          <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.9}>
            <Die />
          </Float>
        )}
      </group>
      <StorySatellites quality={quality} />
      {/* Sphère céramique ch.02 (facettes révélées séquentiellement) —
          remplace l'orb de la recette satellites si quality high. */}
      {quality === 'high' && opened && <CeramicOrb position={[-3.8, 0, -2.5]} />}
      {/* Migration cubique ch.03 → ch.04 */}
      {opened && <ToolCubes position={[0, 0, -1.2]} />}
    </group>
  );
}

export function StoryScene({ active, className, opened = true }: StorySceneProps) {
  const [quality, setQuality] = useState<'high' | 'low'>('high');

  return (
    <div className={className}>
      <Canvas
        dpr={quality === 'high' ? [1, 1.5] : 1}
        frameloop={active ? 'always' : 'never'}
        gl={{ antialias: quality === 'high', alpha: true }}
        camera={{ position: [0, 0, 9], fov: 45 }}
      >
        <PerformanceMonitor onDecline={() => setQuality('low')} onIncline={() => setQuality('high')} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 6, 6]} intensity={1.15} />
        <pointLight position={[-6, -4, 2]} intensity={0.7} color={MINT} />
        <Stage quality={quality} opened={opened} />
      </Canvas>
    </div>
  );
}
