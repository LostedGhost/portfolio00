import { useEffect, useState } from 'react';
import { useProfile } from '../../api/hooks';
import { hero } from '../../mock/data';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Chapitre 01 — Le dé. La scène 3D est CONTINUE (montée fixe dans App) ;
 * ce chapitre ne fait que poser le texte par-dessus. Ouverture :
 * HUD tapé au terminal, nom glissé, manifeste révélé mot à mot.
 */
export function ChapterOpening() {
  const { data: profile } = useProfile();
  const reduced = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Voile de lisibilité (le fond 3D continue dessous) */}
      <div
        aria-hidden
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 64% 48% at 50% 44%, rgba(7,12,9,0.55) 25%, transparent 80%)' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
        {!reduced ? (
          <TypedHud text={hero.ticker} />
        ) : (
          <p className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-(--color-text-dim) mb-8">
            {hero.ticker}
          </p>
        )}

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]">
          {profile?.full_name?.split('').map((ch, i) => (
            <RevealLetter key={i} ch={ch} delay={0.25 + i * 0.045} reduced={reduced} />
          ))}
        </h1>

        <p className="mt-5 text-base md:text-lg text-(--color-text-dim)">
          {profile?.title}
        </p>

        <div className="mt-14 flex flex-col items-center gap-8">
          <HeroManifesto text={hero.manifesto} />
          {!reduced && <ScrollHint />}
        </div>
      </div>

      <div className="absolute bottom-8 inset-x-0 z-10 flex justify-center">
        <p className="font-mono text-[10px] tracking-[0.3em] text-(--color-text-dim) animate-pulse">
          {profile?.available ? '● DISPONIBLE' : '—'}
        </p>
      </div>
    </section>
  );
}

/** HUD tapé caractère par caractère (curseur ▌), façon terminal. */
function TypedHud({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= text.length) return;
    const t = setTimeout(() => setN((v) => v + 1), 34);
    return () => clearTimeout(t);
  }, [n, text.length]);

  return (
    <p className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-(--color-text-dim) mb-8">
      {text.slice(0, n)}
      <span aria-hidden className="inline-block w-[0.6em] animate-pulse">▌</span>
    </p>
  );
}

/** Lettre révélée du flou vers le net, en cascade. */
function RevealLetter({
  ch,
  delay,
  reduced,
}: {
  ch: string;
  delay: number;
  reduced: boolean;
}) {
  return (
    <span
      className="inline-block whitespace-pre"
      style={
        reduced
          ? undefined
          : {
              animation: `letter-in 0.5s ${delay}s both cubic-bezier(0.22, 1, 0.36, 1)`,
            }
      }
    >
      {ch}
    </span>
  );
}

/** Manifeste du hero : mots du flou à la menthe, en cascade douce. */
function HeroManifesto({ text }: { text: string }) {
  const words = text.split(' ');
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (lit >= words.length) return;
    const t = setTimeout(() => setLit((v) => v + 1), 240);
    return () => clearTimeout(t);
  }, [lit, words.length]);

  return (
    <p className="text-lg md:text-xl font-medium">
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block mr-[0.3em] transition-all duration-300"
          style={{
            color: i < lit ? 'var(--color-accent)' : 'var(--color-text-dim)',
            filter: i < lit ? 'none' : 'blur(2px)',
            opacity: i < lit ? 1 : 0.55,
          }}
        >
          {w}
        </span>
      ))}
    </p>
  );
}

/** Discret indicateur de scroll (barre qui respire). */
function ScrollHint() {
  return (
    <a
      href="#about"
      className="group inline-flex flex-col items-center gap-2 text-(--color-text-dim) hover:text-(--color-accent) transition-colors font-mono text-[10px] tracking-[0.3em]"
    >
      DÉCOUVRIR L'HISTOIRE
      <span aria-hidden className="h-8 w-px bg-current overflow-hidden relative">
        <span className="absolute inset-x-0 top-0 h-2/5 bg-current animate-[scroll-hint_1.6s_ease-in-out_infinite]" />
      </span>
    </a>
  );
}
