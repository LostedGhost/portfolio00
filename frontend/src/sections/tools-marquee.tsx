import { tools } from '@/config/portfolio'

/** Bandeau d'outils qui défile en continu (pause au survol). */
export function ToolsMarquee() {
  const row = [...tools, ...tools]
  return (
    <div className="marquee-host relative overflow-hidden border-y border-glass-b bg-forest py-5 text-em3" aria-label={`Outils : ${tools.join(', ')}`}>
      <ul className="marquee flex w-max gap-10 font-display text-[clamp(1.4rem,3vw,2.4rem)] font-semibold uppercase tracking-tight" aria-hidden="true">
        {row.map((t, i) => (
          <li key={i} className="flex items-center gap-10 whitespace-nowrap">
            {t}<span className="size-2.5 rounded-full bg-em2" />
          </li>
        ))}
      </ul>
    </div>
  )
}
