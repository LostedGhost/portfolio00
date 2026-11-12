import { useEffect, useRef, useState } from 'react';

/**
 * Progression de scroll d'un élément dans le viewport, de 0 (élément tout
 * en bas de l'écran) à 1 (élément passé au tiers supérieur). Un seul
 * scroll listener passif + rAF : pas de re-render par pixel, l'état
 * n'est mis à jour que par pas de 1 %.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    let last = -1;

    const measure = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quand le haut de l'élément entre par le bas de l'écran,
      // 1 quand il atteint le tiers supérieur.
      const total = rect.height + vh / 3;
      const raw = (vh - rect.top) / Math.max(total, 1);
      const next = Math.min(1, Math.max(0, raw));
      // Pas de 1 % pour limiter les re-renders.
      const quantized = Math.round(next * 100) / 100;
      if (quantized !== last) {
        last = quantized;
        setProgress(quantized);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return { ref, progress };
}
