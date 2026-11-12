import { motion } from 'framer-motion';
import { useCertifications, useEducation } from '../../api/hooks';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/** Suite du ch.03 — Les diplômes et certifications, posés sans décor. */
export function ChapterFormation() {
  const { data: education = [] } = useEducation();
  const { data: certifications = [] } = useCertifications();
  const reduced = useReducedMotion();

  if (education.length === 0 && certifications.length === 0) return null;

  return (
    <section className="relative px-6 py-16 md:px-16">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
        {education.length > 0 && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-(--color-text-dim) mb-6">Diplômes</p>
            {education.map((e) => (
              <div key={e.id} className="py-4 border-b border-(--color-border)">
                <p className="font-mono text-xs text-(--color-text-dim)">
                  {new Date(e.start_date).getFullYear()} — {e.end_date ? new Date(e.end_date).getFullYear() : 'présent'}
                </p>
                <h4 className="font-medium mt-1">{e.degree}</h4>
                <p className="text-sm text-(--color-text-dim)">{e.institution}</p>
              </div>
            ))}
          </div>
        )}
        {certifications.length > 0 && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-(--color-text-dim) mb-6">Certifications</p>
            {certifications.map((c, i) => (
              <motion.div
                key={c.id}
                initial={reduced ? undefined : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-baseline justify-between gap-4 py-4 border-b border-(--color-border)"
              >
                <div>
                  <h4 className="font-medium">{c.name}</h4>
                  <p className="text-sm text-(--color-text-dim)">{c.issuer}</p>
                </div>
                <span className="font-mono text-xs text-(--color-text-dim) shrink-0">
                  {new Date(c.date_obtained).getFullYear()}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
