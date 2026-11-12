import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ManifestProps {
  text: string;
  /** Index du chapitre, affiché en mono à gauche. */
  index: string;
}

/**
 * Phrase-manifeste scroll-driven (façon Luke Baffait) :
 * - le bloc flotte à contresens du scroll (parallaxe douce) ;
 * - les mots s'éclairent progressivement pendant la traversée.
 * prefers-reduced-motion : texte fixe et net.
 */
export function Manifest({ text, index }: ManifestProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['16%', '-16%']);

  const words = text.split(' ');

  return (
    <section className="section min-h-[72vh] flex items-center gap-6 md:gap-10">
      <span className="font-mono text-sm text-(--color-text-dim) shrink-0 select-none self-start pt-2">
        ({index})
      </span>
      <p ref={ref} className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight max-w-4xl">
        <motion.span style={reduced ? undefined : { y, display: 'block' }}>
          {words.map((word, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1.5) / words.length]} reduced={reduced}>
              {word}
            </Word>
          ))}
        </motion.span>
      </p>
    </section>
  );
}

/** Un mot : opacity 0.14 → 1 sur sa plage de progression. */
function Word({
  children,
  progress,
  range,
  reduced,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  reduced: boolean;
}) {
  const opacity = useTransform(progress, range, reduced ? [1, 1] : [0.14, 1]);
  const color = useTransform(opacity, (o) => (o > 0.85 ? 'var(--color-accent)' : 'var(--color-text)'));
  return (
    <motion.span style={{ opacity, color }} className="inline-block mr-[0.28em]">
      {children}
    </motion.span>
  );
}
