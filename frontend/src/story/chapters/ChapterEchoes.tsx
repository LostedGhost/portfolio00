import { motion } from 'framer-motion';
import { useTestimonials } from '../../api/hooks';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Chapter } from '../Chapter';

/** Interlude — Les échos : ce que les gens en disent, sobre. */
export function ChapterEchoes() {
  const { data: testimonials = [] } = useTestimonials();
  const reduced = useReducedMotion();

  if (testimonials.length === 0) return null;

  return (
    <Chapter index="05+" id="echoes" title="Les échos">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.id}
            initial={reduced ? undefined : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="border border-(--color-border) bg-white/[0.02] p-6 flex flex-col"
          >
            <blockquote className="text-(--color-text-dim) leading-relaxed flex-1">« {t.content} »</blockquote>
            <figcaption className="flex items-center gap-3 mt-6 pt-4 border-t border-(--color-border)">
              {t.photo && (
                <img src={t.photo} alt="" loading="lazy" decoding="async" className="h-9 w-9 rounded-full object-cover" />
              )}
              <div>
                <p className="text-sm font-medium">{t.author_name}</p>
                {t.author_role && <p className="font-mono text-[10px] text-(--color-text-dim)">{t.author_role}</p>}
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Chapter>
  );
}
