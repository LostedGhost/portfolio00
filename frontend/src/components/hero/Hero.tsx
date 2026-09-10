import { motion } from 'framer-motion';
import { useProfile } from '../../api/hooks';
import { useDeviceTier } from '../../hooks/useDeviceTier';
import { useInView } from '../../hooks/useInView';
import { HeroFallback2D } from './HeroFallback2D';
import { HeroScene } from './HeroScene';

export function Hero() {
  const { data: profile } = useProfile();
  const tier = useDeviceTier();
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-end overflow-hidden pb-24 pt-32">
      {tier === 'full' ? <HeroScene active={inView} textureUrl={profile?.hero_image} /> : <HeroFallback2D />}

      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{ background: 'linear-gradient(100deg, rgba(5,5,15,0.92) 20%, rgba(5,5,15,0.4) 55%, transparent 75%)' }}
      />

      <div className="relative z-10 w-full max-w-6xl px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="eyebrow mb-5"
        >
          {profile?.available ? '● DISPONIBLE POUR DE NOUVEAUX PROJETS' : profile?.title?.toUpperCase()}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] max-w-3xl"
        >
          {profile?.full_name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 max-w-md text-lg text-(--color-text-dim)"
        >
          {profile?.title}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center gap-6"
        >
          <a
            href="#contact"
            className="px-7 py-3 font-medium text-black bg-(--color-accent) hover:brightness-110 transition-[filter]"
          >
            Me contacter
          </a>
          {profile?.cv && (
            <a
              href="#about"
              className="font-mono text-sm text-(--color-text-dim) hover:text-white transition-colors border-b border-(--color-border) pb-0.5"
            >
              Voir mon profil ↓
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
