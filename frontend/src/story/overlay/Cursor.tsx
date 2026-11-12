import { useEffect, useRef } from 'react';

/**
 * Curseur custom : anneau fin qui suit le pointeur (damping), grossit sur
 * les éléments interactifs (a, button, [data-cursor]). Désactivé si le
 * pointeur n'est pas fin (tactile) ou reduced-motion. Le curseur natif
 * reste visible (complément, pas remplacement) — décision DA : lisibilité
 * d'abord.
 */
export function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced || !ring.current) return;

    const el = ring.current;
    let x = -100, y = -100, tx = x, ty = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [data-cursor], input, textarea, [role="button"]');
      el.style.opacity = '1';
      el.style.width = el.style.height = interactive ? '40px' : '18px';
      el.style.borderColor = interactive ? 'rgba(87,255,154,0.9)' : 'rgba(87,255,154,0.4)';
    };

    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate(${x - 0.02 * parseFloat(el.style.width || '18')}px, ${y - 0.02 * parseFloat(el.style.height || '18')}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    document.documentElement.style.cursor = 'crosshair';

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      document.documentElement.style.cursor = '';
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden
      className="fixed top-0 left-0 z-[200] w-[18px] h-[18px] rounded-full border pointer-events-none"
      style={{ borderColor: 'var(--color-accent)', opacity: 0, transition: 'width .2s, height .2s' }}
    />
  );
}
