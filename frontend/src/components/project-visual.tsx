import { useEffect, useRef, useState } from 'react'
import type { ProjectVisual as Kind } from '@/config/portfolio'
import { Icon } from '@/components/icon'
import { cn } from '@/lib/utils'

/** Illustrations CSS des projets (aucune image requise). */
function Illustration({ kind }: { kind: Kind }) {
  switch (kind) {
    case 'bars':
      return (
        <div className="flex flex-col justify-center gap-3.5">
          {[92, 68, 81, 34].map((w, i) => (
            <div key={i} className="relative h-9 overflow-hidden rounded-full bg-deep/15">
              <i data-grow className="absolute inset-y-0 left-0 rounded-full bg-forest" style={{ width: `${w}%` }} />
              {i % 2 === 0 && <b className="absolute right-2 top-2 size-5 rounded-full bg-white" />}
            </div>
          ))}
        </div>
      )
    case 'grades':
      return (
        <div className="flex flex-col justify-center gap-3.5">
          {[[100, 16], [80, 12], [92, 18], [66, 14]].map(([w, n], i) => (
            <div key={i} className="grid grid-cols-[1fr_4rem] items-center gap-3">
              <span data-grow className="h-[1.1rem] rounded-md bg-deep/20" style={{ width: `${w}%` }} />
              <em className="rounded-lg bg-forest py-0.5 text-center font-display text-2xl font-bold not-italic text-em3">{n}</em>
            </div>
          ))}
        </div>
      )
    case 'terminal':
      return (
        <div className="font-mono text-[0.92rem] leading-[1.75] text-em3">
          <p><b className="font-normal text-em2">$</b> <span className="text-white">lulucode</span> docscan contrat.pdf</p>
          <p>Lecture du document…</p>
          <p>12 pages, 3 tableaux trouvés</p>
          <p><b className="font-normal text-em2">$</b> <span className="text-white">lulucode</span> résume les clauses</p>
          <p>Résumé prêt<span className="animate-pulse text-em2">_</span></p>
        </div>
      )
    case 'files':
      return (
        <div className="flex flex-col justify-center gap-3">
          {['rapport.pdf', 'photo.jpg', 'archive.zip'].map((f, i) => (
            <div key={f} data-grow className="flex items-center gap-3.5 rounded-2xl bg-white/40 px-4 py-3 font-display font-medium text-deep" style={{ marginLeft: `${i * 1.6}rem` }}>
              <span className="h-9 w-7 shrink-0 rounded-md bg-forest" />{f}
            </div>
          ))}
        </div>
      )
    case 'face':
      return (
        <div className="relative mx-auto aspect-[3/4] w-[min(100%,220px)] self-center">
          {/* Coins du cadre de visée */}
          {['left-0 top-0 border-l-[5px] border-t-[5px] rounded-tl-2xl', 'right-0 top-0 border-r-[5px] border-t-[5px] rounded-tr-2xl',
            'left-0 bottom-0 border-l-[5px] border-b-[5px] rounded-bl-2xl', 'right-0 bottom-0 border-r-[5px] border-b-[5px] rounded-br-2xl'].map((c) => (
            <span key={c} className={cn('absolute size-9 border-em', c)} />
          ))}
          <span className="absolute left-[30%] top-[18%] aspect-square w-[40%] rounded-full bg-em3" />
          <span className="absolute inset-x-[18%] bottom-[12%] h-[30%] rounded-t-full bg-em3" />
          <span className="face-scan absolute inset-x-[6%] top-[8%] h-1 rounded bg-em shadow-[0_0_12px_var(--color-em)]" />
        </div>
      )
  }
}

/**
 * Panneau visuel d'une carte projet : l'illustration, puis les captures
 * éventuelles dans un carrousel à défilement magnétique.
 */
export function ProjectVisual({ kind, images = [], title, dark }: { kind: Kind; images?: string[]; title: string; dark?: boolean }) {
  const track = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const count = images.length + 1

  useEffect(() => {
    const el = track.current
    if (!el || count < 2) return
    const on = () => setCurrent(Math.round(el.scrollLeft / el.clientWidth))
    el.addEventListener('scroll', on, { passive: true })
    return () => el.removeEventListener('scroll', on)
  }, [count])

  const go = (dir: number) => {
    const el = track.current
    if (!el) return
    const to = Math.max(0, Math.min(count - 1, current + dir))
    el.scrollTo({ left: to * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div
      className={cn(
        'relative flex min-h-[150px] overflow-hidden rounded-[1.6rem] border backdrop-blur-xl md:min-h-[200px]',
        dark ? 'border-white/20 bg-white/5' : 'border-white/60 bg-white/30 shadow-[inset_0_1px_0_rgb(255_255_255/0.7)]',
      )}
      aria-hidden={count < 2 ? true : undefined}
      role={count > 1 ? 'region' : undefined}
      aria-label={count > 1 ? `Images du projet ${title}` : undefined}
    >
      <div ref={track} className="no-scrollbar flex min-w-0 flex-1 snap-x snap-mandatory overflow-x-auto">
        <div className="flex min-h-[150px] flex-[0_0_100%] snap-center flex-col justify-center p-4 md:min-h-[200px] md:p-6">
          <Illustration kind={kind} />
        </div>
        {images.map((src, i) => (
          <div key={src} className="flex-[0_0_100%] snap-center">
            <img src={src} alt={`${title}, capture ${i + 1}`} loading="lazy" className="size-full min-h-[150px] object-cover" />
          </div>
        ))}
      </div>
      {count > 1 && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {Array.from({ length: count }, (_, i) => (
              <i key={i} className={cn('h-2 rounded-full transition-[width] duration-200', i === current ? 'w-6 bg-white' : 'w-2 bg-white/60')} />
            ))}
          </div>
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => go(d)}
              aria-label={d < 0 ? 'Image précédente' : 'Image suivante'}
              className={cn('pill-glass absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-deep', d < 0 ? 'left-2.5' : 'right-2.5')}
            >
              <Icon name={d < 0 ? 'prev' : 'next'} className="size-[18px]" />
            </button>
          ))}
        </>
      )}
    </div>
  )
}
