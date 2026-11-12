/**
 * Fallback 2D du hero (si WebGL indisponible ou appareil léger) :
 * halo doux menthe/violet, cohérent avec la bible.
 */
export function HeroFallback2D() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl opacity-35 animate-pulse"
        style={{ background: 'radial-gradient(circle, #57ff9a, #4fc3f7 70%, transparent)' }}
      />
    </div>
  );
}
