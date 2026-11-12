import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/**
 * Socle de scroll du récit (décision d'implémentation) :
 * - Lenis lisse le scroll natif (lerp), aucune capture : le scroll reste
 *   natif en interne, seul le rendu est lissé.
 * - Lenis est branché sur gsap.ticker ; chaque tick appelle
 *   ScrollTrigger.update pour que les triggers suivent le lissage.
 * - Expose le progress global *continu* (0..1) via scrollState (module) :
 *   plus d'arrondi à 1 % ; le lissage 3D se fait côté useFrame (damp).
 *
 * ScrollTrigger est enregistré une fois ici.
 */
gsap.registerPlugin(ScrollTrigger);

/** État de scroll partagé (lu par StoryScene et le rail sans re-render). */
export const scrollState = {
  /** Progression globale continue 0..1 (lissée côté r3f). */
  global: 0,
  /** Vitesse instantanée du scroll (px/s, lissée), pour les réactions 3D. */
  velocity: 0,
  /** Progress par chapitre, clé = id d'ancre, laissé aux triggers. */
  chapters: new Map<string, number>(),
};

export function ScrollSocle({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      // Reduced motion : pas de lissage, on alimente juste scrollState au scroll natif.
      const onScroll = () => {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        scrollState.global = docH > 0 ? window.scrollY / docH : 0;
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    let lenis: Lenis | null = null;
    let lastY = window.scrollY;
    let lastT = performance.now();

    const update = (time: number) => {
      // ATTENTION : gsap.ticker fournit `time` en SECONDES, lenis.raf attend
      // des MILLISECONDES — sans ×1000, le scroll tourne au 1/60 de vitesse
      // et « résiste » (bug d'intégration classique Lenis+GSAP).
      lenis?.raf(time * 1000);
      const y = window.scrollY;
      const dt = Math.max(0.001, (performance.now() - lastT) / 1000);
      scrollState.velocity = (y - lastY) / dt;
      lastY = y;
      lastT = performance.now();
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.global = docH > 0 ? y / docH : 0;
      ScrollTrigger.update();
    };

    lenis = new Lenis({
      lerp: 0.1, // lissage doux, réactif
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Vitesse à 0 en pause (onglet caché).
    const onVisibility = () => {
      if (document.hidden) scrollState.velocity = 0;
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      gsap.ticker.remove(update);
      lenis?.destroy();
      scrollState.velocity = 0;
    };
  }, []);

  return <>{children}</>;
}

export { ScrollTrigger, gsap };
