export function HeroFallback2D() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl opacity-40 animate-pulse"
        style={{ background: 'radial-gradient(circle, #00aaff, #7b2fff 70%, transparent)' }}
      />
    </div>
  );
}
