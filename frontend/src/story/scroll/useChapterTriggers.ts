import { useEffect } from 'react';
import { ScrollTrigger, scrollState } from './System';
import { chapters } from '../../mock/data';

/**
 * Crée un ScrollTrigger par chapitre (dérivé du DOM, pas de constantes) :
 * - alimente scrollState.chapters.get(id) = progress local continu 0..1 ;
 * - calcule la fenêtre contextualisée (from..to en progress global) depuis
 *   les positions réelles des ancres — plus aucunes constantes en dur.
 *
 * Re-calculé automatiquement par ScrollTrigger.refresh (redimensionnement,
 * chargement des images...).
 */
export function useChapterTriggers() {
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    const make = () => {
      for (const c of chapters) {
        const el = document.getElementById(c.id);
        if (!el) continue;
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            scrollState.chapters.set(c.id, self.progress);
          },
        });
        triggers.push(trigger);
      }
    };

    make();
    // Les images lazy modifient les hauteurs : un refresh vit après montage.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      triggers.forEach((t) => t.kill());
      scrollState.chapters.clear();
    };
  }, []);
}
