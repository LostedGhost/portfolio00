import { useEffect, useState } from 'react';
import { chapters } from '../mock/data';

/**
 * Rail latéral des chapitres : numéro du chapitre courant à gauche
 * (façon « (19) » de Luke Baffait) + barre de progression fine à droite.
 * Clic = navigation native vers l'ancre.
 */
export function ChapterRail() {
  const [current, setCurrent] = useState('');
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        setScrollTop(docH > 0 ? window.scrollY / docH : 0);
        // Chapitre actif : le dernier dont l'ancre est passée.
        let active = '';
        for (const c of chapters) {
          const el = document.getElementById(c.id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) active = c.index;
        }
        setCurrent(active);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <span className="fixed left-4 md:left-6 bottom-8 z-40 font-mono text-xs text-(--color-text-dim) select-none pointer-events-none">
        {current ?? ''}
      </span>
      <nav
        aria-label="Progression du récit"
        className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2"
      >
        {chapters.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            aria-label={`Chapitre ${c.index} — ${c.title}`}
            className="group flex items-center gap-2"
          >
            <span className="font-mono text-[10px] text-(--color-text-dim) opacity-0 group-hover:opacity-100 transition-opacity">
              {c.index}
            </span>
            <span
              className={`h-px transition-all duration-300 ${
                current === c.index
                  ? 'w-5 bg-(--color-accent)'
                  : 'w-3 bg-(--color-border) group-hover:w-5 group-hover:bg-(--color-text-dim)'
              }`}
            />
          </a>
        ))}
        {/* Fine barre de progression globale */}
        <span className="absolute -right-[2px] top-0 bottom-0 w-px bg-(--color-border) -z-10" />
      </nav>
      <span
        aria-hidden
        className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 h-px bg-(--color-accent) hidden md:block pointer-events-none"
        style={{ width: 2, opacity: 0 }}
      />
      <span
        aria-hidden
        className="fixed right-3 md:right-5 h-px bg-(--color-accent) opacity-70 hidden md:block pointer-events-none z-30"
        style={{ top: `${12 + scrollTop * 76}%` }}
      />
    </>
  );
}
