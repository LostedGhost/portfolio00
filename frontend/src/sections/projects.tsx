import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion, onAnchorClick } from '@/lib/motion'
import { projects, projectsTitle, type Project } from '@/config/portfolio'
import { Icon } from '@/components/icon'
import { ProjectVisual } from '@/components/project-visual'
import { cn } from '@/lib/utils'

const tones: Record<Project['tone'], string> = {
  mint: 'bg-gradient-to-br from-[#a7f3d0] to-[#6ee7b7] text-deep',
  pale: 'bg-gradient-to-br from-[#d1fae5] to-[#a7f3d0] text-deep',
  deep: 'bg-gradient-to-br from-[#064e3b] to-[#022c22] text-[#d1fae5]',
  emerald: 'bg-gradient-to-br from-[#34d399] to-[#10b981] text-deep',
  paper: 'bg-gradient-to-br from-[#f0fdf6] to-[#d1fae5] text-deep',
}

/** Événement écouté par le formulaire de contact pour se préremplir. */
export const ASK_EVENT = 'portfolio:ask'

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const dark = p.tone === 'deep'
  const external = p.link.href?.startsWith('http')
  return (
    <article
      data-card
      className={cn(
        'group sticky mb-[5vh] grid origin-top gap-4 overflow-hidden rounded-[1.6rem] p-5 shadow-[0_20px_60px_rgb(6_78_59/0.2)] md:mb-[6vh] md:min-h-[66vh] md:grid-cols-[1.1fr_1fr] md:gap-8 md:rounded-[2rem] md:p-[clamp(1.4rem,3.5vw,3rem)]',
        tones[p.tone],
      )}
      style={{ top: `calc(env(safe-area-inset-top, 0px) + 5rem + ${i * 0.8}rem)` }}
      aria-labelledby={`p-${p.id}`}
    >
      <div className="flex flex-col justify-between gap-6">
        <div>
          <div className="flex items-center justify-between">
            <div className="grid size-12 place-items-center rounded-[1.1rem] bg-gradient-to-br from-em2 to-[#047857] text-white shadow-[0_8px_20px_rgb(4_120_87/0.4)] md:size-[3.6rem]">
              <Icon name={p.icon} className="size-6 md:size-7" />
            </div>
            <span className="font-display text-sm font-semibold tabular-nums opacity-60">{String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
          </div>
          <h3 id={`p-${p.id}`} className="mb-3 mt-4 text-[1.7rem] font-bold text-inherit md:mb-4 md:mt-5 md:text-[clamp(2rem,4.8vw,4.2rem)]">{p.title}</h3>
          <p className="max-w-[38ch] text-base leading-snug md:text-lg md:leading-relaxed">{p.text}</p>
          {p.tags && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => <li key={t} className="rounded-full border-[1.5px] border-current px-3 py-0.5 font-display text-sm font-medium">{t}</li>)}
            </ul>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={p.link.href ?? '#contact'}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            onClick={(e) => {
              if (p.link.ask) window.dispatchEvent(new CustomEvent(ASK_EVENT, { detail: p.link.ask }))
              if (!external) onAnchorClick(e)
            }}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-5 py-3 font-display font-medium transition-transform duration-200 hover:-translate-y-0.5',
              dark ? 'border border-white/25 bg-white/10 backdrop-blur-xl' : 'pill-glass',
            )}
          >
            <Icon name={p.link.icon} />{p.link.label}{external && <Icon name="ext" className="size-4" />}
            {external && <span className="sr-only">(nouvel onglet)</span>}
          </a>
        </div>
      </div>
      <ProjectVisual kind={p.visual} images={p.images} title={p.title} dark={dark} />
    </article>
  )
}

/** Chapitre 3 : les projets, en cartes qui s'empilent et se tassent sous la suivante. */
export function Projects() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.from('[data-ptitle] > span', { yPercent: 100, duration: 1.1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: '[data-ptitle]', start: 'top 85%' } })
    const cards = gsap.utils.toArray<HTMLElement>('[data-card]')
    cards.forEach((card, i) => {
      const next = cards[i + 1]
      gsap.from(card.querySelectorAll('[data-grow]'), { scaleX: 0, transformOrigin: 'left center', duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: card, start: 'top 70%' } })
      if (!next) return
      gsap.to(card, { scale: 0.93, filter: 'brightness(0.92)', ease: 'none', scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 14%', scrub: true } })
    })
  }, { scope: root })

  return (
    <section ref={root} id="projets" data-chapter="Projets" aria-labelledby="projects-title" className="px-[clamp(1.2rem,4vw,4rem)] pb-20 pt-[clamp(3rem,8vw,6rem)]">
      <h2 id="projects-title" data-ptitle className="mb-10 overflow-hidden pb-2 text-[clamp(2.4rem,6.5vw,5.5rem)] font-bold">
        {projectsTitle.split(' ').map((w, i) => <span key={i} className="mr-[0.25em] inline-block">{w}</span>)}
      </h2>
      {projects.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
    </section>
  )
}
