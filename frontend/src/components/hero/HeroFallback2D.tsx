/**
 * Fallback 2D du hero (si WebGL indisponible ou appareil léger) :
 * halo doux menthe/violet. Bandeau discret si la 3D est réellement
 * indisponible (WebGL perdu), pour ne pas laisser croire à un bug muet.
 */
export function HeroFallback2D({ withNotice = false }: { withNotice?: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl opacity-35 animate-pulse"
        style={{ background: 'radial-gradient(circle, #57ff9a, #4fc3f7 70%, transparent)' }}
      />
      {withNotice && (
        <p className="absolute bottom-6 font-mono text-[10px] tracking-[0.2em] text-(--color-text-dim)">
          RENDU 3D INDISPONIBLE SUR CET APPAREIL — LE RÉCIT RESTE COMPLET
        </p>
      )}
    </div>
  );
}

