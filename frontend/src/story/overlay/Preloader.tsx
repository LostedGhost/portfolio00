import { useEffect, useState } from 'react';

/**
 * Preloader (ch.01, < 2,5 s) : compteur 0→100 lié au chargement RÉEL des
 * images critiques [data-critical], plancher 1 s, plafond 2,5 s.
 * Reduced-motion / cache chaud : quasi instantané.
 */
export function usePreloader(): { ready: boolean; pct: number } {
  const [ready, setReady] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img[data-critical]'));
    const total = Math.max(1, imgs.length);
    let loaded = 0;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      setPct(100);
      const elapsed = performance.now() - start;
      const wait = Math.max(0, 1000 - elapsed);
      setTimeout(() => setReady(true), wait);
    };

    const tick = () => {
      loaded++;
      setPct(Math.round((loaded / total) * 100));
      if (loaded >= total) finish();
    };

    imgs.forEach((img) => {
      if (img.complete) tick();
      else {
        img.addEventListener('load', tick, { once: true });
        img.addEventListener('error', tick, { once: true });
      }
    });

    const bail = setTimeout(finish, 2500);
    return () => clearTimeout(bail);
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
