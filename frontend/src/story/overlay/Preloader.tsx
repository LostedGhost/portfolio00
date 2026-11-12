import { useEffect, useState } from 'react';
import { dieFacesState } from '../faceState';

/**
 * Preloader (ch.01, < 2,5 s) : deux signaux combinés —
 *  1. le canvas 3D signale que le dé est entièrement construit (faces posées) ;
 *  2. les images critiques sont chargées (s'il y en a).
 * Plancher 1 s, plafond 2,5 s. Reduced-motion / cache chaud : quasi instantané.
 */
export function usePreloader(): { ready: boolean; pct: number } {
  const [ready, setReady] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let sceneReady = false;
    let assetsDone = false;
    let done = false;
    const timers: number[] = [];
    // Progrès : 60 % pour la scène, 40 % pour les assets.
    const scenePct = { value: 0 };

    const progress = () => {
      const base = sceneReady ? 60 : Math.min(55, scenePct.value);
      const assets = assetsDone ? 40 : 5;
      setPct(Math.min(100, base + assets));
    };

    const finish = () => {
      if (done) return;
      done = true;
      timers.forEach((t) => clearTimeout(t));
      setPct(100);
      const elapsed = performance.now() - start;
      const wait = Math.max(0, 1000 - elapsed);
      timers.push(
        window.setTimeout(() => {
          setReady(true);
          document.body.style.overflow = '';
        }, wait),
      );
    };

    // Signal 1 : la scène polle dieFacesState (le dé se construit).
    const pollScene = () => {
      scenePct.value = (dieFacesState.placed / 6) * 55;
      if (dieFacesState.placed >= 6) {
        sceneReady = true;
        if (assetsDone) finish();
        else progress();
      } else {
        progress();
        timers.push(window.setTimeout(pollScene, 120));
      }
    };
    pollScene();

    // Signal 2 : images critiques (peut être vide → immédiat).
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img[data-critical]'));
    if (imgs.length === 0) {
      assetsDone = true;
    } else {
      let loaded = 0;
      const tick = () => {
        loaded++;
        if (loaded >= imgs.length) {
          assetsDone = true;
          if (sceneReady) finish();
        }
      };
      imgs.forEach((img) => {
        if (img.complete) tick();
        else {
          img.addEventListener('load', tick, { once: true });
          img.addEventListener('error', tick, { once: true });
        }
      });
    }

    // Garde-fou dur : 2,5 s max.
    timers.push(window.setTimeout(finish, 2500));
    progress();

    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return { ready, pct };
}

/** Overlay visuel du preloader : compteur mono + ligne fine. */
export function PreloaderOverlay({ ready, pct }: { ready: boolean; pct: number }) {
  if (ready) return null;
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[300] flex items-center justify-center bg-(--color-bg) transition-opacity duration-500"
      style={{ opacity: pct >= 100 ? 0 : 1 }}
    >
      <div className="flex flex-col items-center gap-4">
        <p className="font-mono text-4xl text-(--color-text-dim) tabular-nums">{pct}</p>
        <span className="h-px w-40 bg-(--color-border) overflow-hidden">
          <span className="block h-full bg-(--color-accent) origin-left" style={{ width: `${pct}%` }} />
        </span>
      </div>
    </div>
  );
}
