import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Trace les <path>/<circle> d'un SVG réservés [data-draw] au scroll (scrub) :
 * l'équivalent maison de DrawSVG (dasharray = longueur, dashoffset scrubé).
 * Option : delayFactor répartit les tracés en cascade.
 * Reduced-motion : tracé complet immédiat.
 */
export function useDrawOnScroll(
  scopeRef: React.RefObject<HTMLElement | null>,
  { start = 'top 85%', end = 'top 35%' }: { start?: string; end?: string } = {},
) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const paths = scope.querySelectorAll<SVGGeometryElement>('[data-draw]');
    if (!paths.length) return;

    const ctx: Array<gsap.core.Tween | null> = [];
    paths.forEach((path, i) => {
      const len = path.getTotalLength?.() ?? 0;
      if (!len) return;
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: reduced ? 0 : len });
      if (reduced) return;
      ctx.push(
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: scope, start, end, scrub: 0.5 },
          delay: i * 0.1,
        } as gsap.TweenVars),
      );
    });
    ScrollTrigger.refresh();

    return () => ctx.forEach((t) => t?.scrollTrigger?.kill());
  }, [scopeRef, start, end]);
}
