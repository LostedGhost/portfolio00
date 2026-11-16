import { site } from '@/config/portfolio'
import { cn } from '@/lib/utils'

/** Pastille de marque : logo si renseigné dans la config, sinon initiales. */
export function Brand({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label={`Logo de ${site.firstName} ${site.lastName}`}
      className={cn('glass grid size-[4.2rem] place-items-center overflow-hidden rounded-full font-display text-xl font-bold text-em', className)}
    >
      {site.logo ? <img src={site.logo} alt="" className="size-full object-cover" /> : site.initials}
    </div>
  )
}
