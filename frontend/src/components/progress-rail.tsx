import { useEffect, useState } from 'react'
import { ScrollTrigger } from '@/lib/motion'
import { cn } from '@/lib/utils'

/** Fil conducteur : segments + nom du chapitre en cours (écrans larges). */
export function ProgressRail() {
  const [chapters, setChapters] = useState<string[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('[data-chapter]')]
    setChapters(els.map((e) => e.dataset.chapter!))
    const update = () => {
      let idx = 0
      els.forEach((e, i) => { if (e.getBoundingClientRect().top < innerHeight * 0.5) idx = i })
      setCurrent(idx)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    ScrollTrigger.addEventListener('refresh', update)
    return () => { window.removeEventListener('scroll', update); ScrollTrigger.removeEventListener('refresh', update) }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div className="glass flex items-center gap-3 rounded-full py-1.5 pl-3.5 pr-2.5">
        <span className="font-display text-[11px] font-semibold text-head">{chapters[current]}</span>
        <div className="flex flex-col gap-1.5">
          {chapters.map((c, i) => (
            <span key={c} className={cn('block h-px w-3 origin-right bg-head transition-transform duration-500', i === current ? 'scale-x-[2.6]' : 'opacity-40')} />
          ))}
        </div>
      </div>
    </div>
  )
}
